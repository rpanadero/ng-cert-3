import { Component } from '@angular/core';
import { Conference, Division, filterTeams, getDivisionsByConference, Team } from '../data.models';
import { combineLatest, concat, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { NbaService } from '../nba.service';
import { FormBuilder, FormControl } from '@angular/forms';

interface TeamTrackForm {
  conference: FormControl<Conference | ''>;
  division: FormControl<Division | ''>;
  team: FormControl<string>;
}

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css'],
})
export class GameStatsComponent {
  divisions$: Observable<ReadonlyArray<Division>>;
  teams$: Observable<Team[]>;
  allTeams: Team[] = [];
  teamResultsInDays = '12';

  form = this.buildForm();

  private readonly allTeams$ = this.nbaService.getAllTeams().pipe(shareReplay(1));

  constructor(protected nbaService: NbaService, private fb: FormBuilder) {
    this.teams$ = this.getTeams();
    this.divisions$ = this.getDivisions();
  }

  onTrackTeam() {
    const teamId = this.form.value.team;
    if (!teamId) {
      return;
    }
    const team = this.allTeams.find(team => team.id == Number(teamId));
    if (team) {
      this.nbaService.addTrackedTeam(team);
    }
  }

  private buildForm() {
    return this.fb.group<TeamTrackForm>({
      conference: this.fb.nonNullable.control(''),
      division: this.fb.nonNullable.control<Division | ''>({ value: '', disabled: true }),
      team: this.fb.nonNullable.control(''),
    });
  }

  private getDivisions() {
    return this.getConferenceValue().pipe(
      map(conference => (conference ? getDivisionsByConference(conference) : [])),
      tap(divisions => {
        if (divisions.length) {
          this.form.controls.division.enable();
        }
        this.form.patchValue({ division: '' });
      })
    );
  }

  private getTeams() {
    return combineLatest({
      conference: this.getConferenceValue(),
      division: this.getDivisionValue(),
    }).pipe(
      switchMap(({ conference, division }) =>
        this.getFilteredTeams({
          conference: conference || undefined,
          division: division || undefined,
        })
      ),
      tap(teams => {
        this.allTeams = teams;
        this.form.patchValue({ team: String(this.allTeams?.[0]?.id) });
      })
    );
  }

  private getFilteredTeams(filters?: { conference?: string; division?: string }) {
    return this.allTeams$.pipe(map(teams => filterTeams(teams, filters)));
  }

  private getConferenceValue() {
    return concat(
      of(this.form.controls.conference.value),
      this.form.controls.conference.valueChanges
    );
  }

  private getDivisionValue() {
    return concat(of(this.form.controls.division.value), this.form.controls.division.valueChanges);
  }
}
