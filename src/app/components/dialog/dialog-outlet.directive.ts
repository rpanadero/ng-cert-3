import { Directive, ViewContainerRef } from '@angular/core';
import { DialogService } from './dialog.service';

@Directive({
  selector: '[dialogOutlet]',
  standalone: true,
})
export class DialogOutletDirective {
  constructor(vc: ViewContainerRef, dialogService: DialogService) {
    dialogService.setContext(vc);
  }
}
