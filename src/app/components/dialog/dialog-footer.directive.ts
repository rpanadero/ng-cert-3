import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[dialogFooter]',
  standalone: true
})
export class DialogFooterDirective {
  @HostBinding('class') classes = 'dialog-footer';
}
