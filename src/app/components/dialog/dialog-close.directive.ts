import { Directive, HostListener, Inject, Input } from '@angular/core';
import { DialogRef } from './dialog-ref.model';
import { DIALOG_REF } from './dialog.token';

@Directive({
  selector: '[dialogClose]',
  standalone: true,
})
export class DialogCloseDirective {
  @Input()
  result?: any;

  constructor(
    @Inject(DIALOG_REF) private dialogRef: DialogRef,
  ) {}

  @HostListener('click') onClick() {
    this.dialogRef.close(this.result);
  }
}
