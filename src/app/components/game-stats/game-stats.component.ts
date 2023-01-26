import { Component } from '@angular/core';
import {
  combineLatest,
  combineLatestWith,
  concat,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NbaService } from 'src/app/services/nba.service';
import {
  Conference,
  Division,
  Team,
  getDivisionsByConference,
  filterTeams,
} from 'src/app/models/data.models';
import { DialogService } from '../dialog/dialog.service';
import { RemoveTrackedTeamDialogComponent } from 'src/app/dialogs/remove-tracked-team-dialog/remove-tracked-team-dialog.component';
import { UiHelperService } from 'src/app/services/ui-helper.service';

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

  constructor(
    private nbaService: NbaService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private uiHelperService: UiHelperService,
  ) {
    this.form = this.buildForm();
    this.formDivisions$ = this.getFormDivisions();
    this.formTeamsSelect$ = this.getFormTeamsSelectData();
    this.trackedTeams$ = this.nbaService.state.trackedTeams$;
    this.teamResultsInDays = '12';
  }

  onTrackTeam(team: Team | undefined) {
    if (!team) {
      return;
    }
    const tracked = this.nbaService.addTrackedTeam(team);
    if (!tracked) {
      this.uiHelperService.showToast('Team already tracked');
    }
  }

  onTeamRemove(team: Team) {
    const dialog = this.dialogService.open(RemoveTrackedTeamDialogComponent, { data: team });
    dialog.afterClosed$.subscribe(res => {
      if (res?.confirm) {
        this.nbaService.removeTrackedTeam(team);
      }
    });
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
