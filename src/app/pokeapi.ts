import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EvolutionChain, NamedResource, PokemonDetail, Species } from './models';

@Injectable({ providedIn: 'root' })
export class Pokeapi {
  private http = inject(HttpClient);
  private base = 'https://pokeapi.co/api/v2';

  list(limit: number, offset = 0): Observable<{ count: number; results: NamedResource[] }> {
    return this.http.get<{ count: number; results: NamedResource[] }>(
      `${this.base}/pokemon?limit=${limit}&offset=${offset}`
    );
  }

  types(): Observable<{ results: NamedResource[] }> {
    return this.http.get<{ results: NamedResource[] }>(`${this.base}/type`);
  }

  type(name: string): Observable<{ pokemon: { pokemon: NamedResource }[] }> {
    return this.http.get<{ pokemon: { pokemon: NamedResource }[] }>(`${this.base}/type/${name}`);
  }

  pokemon(id: number): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.base}/pokemon/${id}`);
  }

  species(id: number): Observable<Species> {
    return this.http.get<Species>(`${this.base}/pokemon-species/${id}`);
  }

  evolutionChain(url: string): Observable<EvolutionChain> {
    return this.http.get<EvolutionChain>(url);
  }
}