import { Injectable, computed, effect, signal } from '@angular/core';
import { TeamMember } from './models';

const KEY = 'pokedex-team';

@Injectable({ providedIn: 'root' })
export class Team {
  members = signal<TeamMember[]>(this.load());

  full = computed(() => this.members().length >= 6);
  uniqueTypes = computed(() => [...new Set(this.members().flatMap(m => m.types))]);
  average = computed(() => {
    const m = this.members();
    return m.length ? Math.round(m.reduce((a, x) => a + x.total, 0) / m.length) : 0;
  });
  strongest = computed<TeamMember | null>(() => [...this.members()].sort((a, b) => b.total - a.total)[0] ?? null);

  constructor() {
    effect(() => {
      try { localStorage.setItem(KEY, JSON.stringify(this.members())); } catch { /* ignorar */ }
    });
  }

  has(id: number): boolean {
    return this.members().some(m => m.id === id);
  }

  add(member: TeamMember): void {
    if (this.full() || this.has(member.id)) return;
    this.members.update(list => [...list, member]);
  }

  remove(id: number): void {
    this.members.update(list => list.filter(m => m.id !== id));
  }

  clear(): void {
    this.members.set([]);
  }

  private load(): TeamMember[] {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}