import { Component, inject, output } from '@angular/core';
import { Team } from '../../team';
import { TYPE_COLORS, artwork } from '../../models';

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.html',
  styleUrl: './team-panel.css',
})
export class TeamPanel {
  team = inject(Team);
  pick = output<number>();
  art = artwork;
  color = (t: string) => TYPE_COLORS[t] ?? '#777';
}