import { Component, signal } from '@angular/core';
import { Explorer } from './components/explorer/explorer';
import { Detail } from './components/detail/detail';
import { TeamPanel } from './components/team-panel/team-panel';

@Component({
  selector: 'app-root',
  imports: [Explorer, Detail, TeamPanel],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  selected = signal<number | null>(null);
}