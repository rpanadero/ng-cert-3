import { Component } from '@angular/core';
import { DialogCloseDirective } from 'src/app/components/dialog/dialog-close.directive';
import { DialogContentDirective } from '../../components/dialog/dialog-content.directive';
import { DialogFooterDirective } from '../../components/dialog/dialog-footer.directive';

@Component({
  selector: 'app-remove-tracked-team-dialog',
  templateUrl: './remove-tracked-team-dialog.component.html',
  styleUrls: ['./remove-tracked-team-dialog.component.css'],
  standalone: true,
  imports: [DialogContentDirective, DialogFooterDirective, DialogCloseDirective],
})
export class RemoveTrackedTeamDialogComponent {}
