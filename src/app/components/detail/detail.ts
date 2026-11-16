import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Pokeapi } from '../../pokeapi';
import { Team } from '../../team';
import {
  ChainLink, PokemonDetail, PokemonRef, STAT_LABELS, TYPE_COLORS, artwork, idFromUrl,
} from '../../models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail {
  private api = inject(Pokeapi);
  team = inject(Team);

  id = input<number | null>(null);
  pick = output<number>();

  pokemon = signal<PokemonDetail | null>(null);
  genus = signal('');
  description = signal('');
  evolutions = signal<PokemonRef[]>([]);
  loading = signal(false);
  error = signal('');

  stats = computed(() =>
    this.pokemon()?.stats.map(s => ({
      label: STAT_LABELS[s.stat.name] ?? s.stat.name,
      value: s.base_stat,
      pct: Math.min(100, (s.base_stat / 150) * 100),
    })) ?? []
  );
  total = computed(() => this.pokemon()?.stats.reduce((a, s) => a + s.base_stat, 0) ?? 0);

  art = artwork;
  color = (t: string) => TYPE_COLORS[t] ?? '#777';

  private token = 0;

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) untracked(() => this.load(id));
    });
  }

  private async load(id: number) {
    const t = ++this.token;
    this.loading.set(true);
    this.error.set('');
    try {
      const p = await firstValueFrom(this.api.pokemon(id));
      const s = await firstValueFrom(this.api.species(id));
      const c = await firstValueFrom(this.api.evolutionChain(s.evolution_chain.url));
      if (t !== this.token) return;

      const text =
        s.flavor_text_entries.find(f => f.language.name === 'es') ??
        s.flavor_text_entries.find(f => f.language.name === 'en');
      const genus =
        s.genera.find(g => g.language.name === 'es') ??
        s.genera.find(g => g.language.name === 'en');

      this.pokemon.set(p);
      this.genus.set(genus?.genus ?? '');
      this.description.set((text?.flavor_text ?? '').replace(/[\n\f]/g, ' '));
      this.evolutions.set(this.flatten(c.chain));
    } catch {
      if (t === this.token) this.error.set('No se pudo cargar la información de este Pokémon.');
    } finally {
      if (t === this.token) this.loading.set(false);
    }
  }

  private flatten(link: ChainLink, out: PokemonRef[] = []): PokemonRef[] {
    out.push({ id: idFromUrl(link.species.url), name: link.species.name });
    link.evolves_to.forEach(l => this.flatten(l, out));
    return out;
  }

  addToTeam(p: PokemonDetail) {
    this.team.add({
      id: p.id,
      name: p.name,
      types: p.types.map(t => t.type.name),
      total: p.stats.reduce((a, s) => a + s.base_stat, 0),
    });
  }
}