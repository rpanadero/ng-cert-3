import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, switchMap, tap } from 'rxjs';
import { NbaService } from '../../services/nba.service';
import { Game, Stats, Team } from '../../models/data.models';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css'],
})
export class TeamStatsComponent implements OnInit {
  private static readonly DEFAULT_RESULTS_IN_DAYS = 12;

  @Input()
  team!: Team;
  @Input()
  set days(days: number | string) {
    this.daysSubject.next(Number(days));
  }
  @Output()
  teamRemove = new EventEmitter<Team>();

  games$?: Observable<Game[]>;
  stats?: Stats;

  private readonly daysSubject = new BehaviorSubject(TeamStatsComponent.DEFAULT_RESULTS_IN_DAYS);

  constructor(protected nbaService: NbaService) {}

  ngOnInit(): void {
    this.games$ = combineLatest({
      team: of(this.team),
      days: this.daysSubject,
    }).pipe(
      switchMap(({ team, days }) => this.nbaService.getLastResults(team, days)),
      tap(games => {
        this.stats = this.nbaService.getStatsFromGames(games, this.team);
      })
    );
  }

  get days() {
    return this.daysSubject.value;
  }

  onRemoveTrackedTeam(team: Team) {
    this.teamRemove.next(team);
  }
}
