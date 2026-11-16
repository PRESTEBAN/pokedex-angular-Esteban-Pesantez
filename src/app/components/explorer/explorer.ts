import { Component, OnInit, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Pokeapi } from '../../pokeapi';
import { PokemonRef, artwork, idFromUrl } from '../../models';

@Component({
  selector: 'app-explorer',
  imports: [FormsModule],
  templateUrl: './explorer.html',
  styleUrl: './explorer.css',
})
export class Explorer implements OnInit {
  private api = inject(Pokeapi);

  pick = output<number>();

  query = signal('');
  selectedType = signal('');
  types = signal<string[]>([]);
  all = signal<PokemonRef[]>([]);
  source = signal<PokemonRef[]>([]);
  visible = signal(24);
  loading = signal(false);
  error = signal('');

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.source().filter(p => !q || p.name.includes(q) || String(p.id) === q);
  });
  shown = computed(() => this.filtered().slice(0, this.visible()));

  art = artwork;

  ngOnInit() {
    this.init();
  }

  init() {
    this.loading.set(true);
    this.error.set('');
    forkJoin({ list: this.api.list(1025), types: this.api.types() }).subscribe({
      next: ({ list, types }) => {
        const refs = list.results.map(r => ({ id: idFromUrl(r.url), name: r.name }));
        this.all.set(refs);
        this.source.set(refs);
        this.types.set(
          types.results.map(t => t.name).filter(n => !['unknown', 'stellar', 'shadow'].includes(n))
        );
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de Pokémon.');
        this.loading.set(false);
      },
    });
  }

  onQuery(value: string) {
    this.query.set(value);
    this.visible.set(24);
  }

  onType(name: string) {
    this.selectedType.set(name);
    this.visible.set(24);
    if (!name) {
      this.source.set(this.all());
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.api.type(name).subscribe({
      next: r => {
        this.source.set(
          r.pokemon
            .map(x => ({ id: idFromUrl(x.pokemon.url), name: x.pokemon.name }))
            .filter(p => p.id < 10000)
            .sort((a, b) => a.id - b.id)
        );
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo filtrar por tipo.');
        this.loading.set(false);
      },
    });
  }
}