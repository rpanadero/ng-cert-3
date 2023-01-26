import { Component } from '@angular/core';
import {
  Conference,
  Division,
  filterTeams,
  getDivisionsByConference,
  Team,
} from '../models/data.models';
import {
  combineLatest,
  combineLatestWith,
  concat,
  map,
  Observable,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { NbaService } from '../services/nba.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  // Team track form data
  form: FormGroup<TeamTrackForm>;
  formDivisions$: Observable<ReadonlyArray<Division>>;
  formTeamsSelect$: Observable<{ teams: Team[]; selectedTeam: Team | undefined }>;
  //
  trackedTeams$: Observable<Team[]>;
  teamResultsInDays: string;
  // UI messages
  teamToRemove?: Team;
  isTeamAlreadyTracked: boolean;

  constructor(private nbaService: NbaService, private fb: FormBuilder) {
    this.form = this.buildForm();
    this.formDivisions$ = this.getFormDivisions();
    this.formTeamsSelect$ = this.getFormTeamsSelectData();
    this.trackedTeams$ = this.nbaService.state.trackedTeams$;
    this.teamResultsInDays = '12';
    this.teamToRemove = undefined;
    this.isTeamAlreadyTracked = false;
  }

  onTrackTeam(team: Team | undefined) {
    if (!team) { return; }
    this.isTeamAlreadyTracked = false;
    const tracked = this.nbaService.addTrackedTeam(team);
    if (!tracked) {
      this.isTeamAlreadyTracked = true;
      timer(3000).subscribe(() => { this.isTeamAlreadyTracked = false; });
    }
  }

  onTeamRemove(team: Team) {
    this.teamToRemove = team;
  }

  cancelTeamRemove() {
    this.teamToRemove = undefined;
  }

  confirmTeamRemove() {
    if (!this.teamToRemove) {
      return;
    }
    this.nbaService.removeTrackedTeam(this.teamToRemove);
    this.teamToRemove = undefined;
  }

  private buildForm() {
    return this.fb.group<TeamTrackForm>({
      conference: this.fb.nonNullable.control(''),
      division: this.fb.nonNullable.control<Division | ''>({ value: '', disabled: true }),
      team: this.fb.nonNullable.control(''),
    });
  }

  private getFormDivisions() {
    return this.getFormConferenceValue().pipe(
      map(conference => (conference ? getDivisionsByConference(conference) : [])),
      tap(divisions => {
        if (divisions.length) {
          this.form.controls.division.enable();
        }
        this.form.patchValue({ division: '' });
      })
    );
  }

  private getFormTeamsSelectData() {
    const teams$ = combineLatest({
      conference: this.getFormConferenceValue(),
      division: this.getFormDivisionValue(),
    }).pipe(
      switchMap(({ conference, division }) => this.getFilteredTeams({ conference, division })),
      tap(teams => {
        this.form.patchValue({ team: String(teams[0]?.id) });
      })
    );
    const selectedTeam$ = this.getFormTeamIdValue().pipe(
      combineLatestWith(teams$),
      map(([teamId, teams]) => teams.find(t => t.id === Number(teamId)))
    );
    return combineLatest({
      teams: teams$,
      selectedTeam: selectedTeam$,
    });
  }

  private getFilteredTeams(filters?: { conference?: string; division?: string }) {
    return this.nbaService.allTeams$.pipe(map(teams => filterTeams(teams, filters)));
  }

  private getFormConferenceValue() {
    return concat(
      of(this.form.controls.conference.value),
      this.form.controls.conference.valueChanges
    );
  }

  private getFormDivisionValue() {
    return concat(of(this.form.controls.division.value), this.form.controls.division.valueChanges);
  }

  private getFormTeamIdValue() {
    return concat(of(this.form.controls.team.value), this.form.controls.team.valueChanges);
  }
}
