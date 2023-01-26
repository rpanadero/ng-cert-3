import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatestWith, filter, map, Observable, switchMap } from 'rxjs';
import { Team, Game } from 'src/app/models/data.models';
import { NbaService } from 'src/app/services/nba.service';

@Component({
  selector: 'app-game-results',
  templateUrl: './game-results.component.html',
  styleUrls: ['./game-results.component.css'],
})
export class GameResultsComponent {
  team$: Observable<Team | undefined>;
  games$: Observable<Game[]>;

  constructor(private activatedRoute: ActivatedRoute, private nbaService: NbaService) {
    this.team$ = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.get('teamAbbr')),
      combineLatestWith(this.nbaService.state.trackedTeams$),
      map(([teamAbbr, trackedTeams]) => trackedTeams.find(t => t.abbreviation === teamAbbr))
    );
    this.games$ = this.team$.pipe(
      filter(Boolean),
      switchMap(team => this.nbaService.getLastResults(team))
    );
  }
}
