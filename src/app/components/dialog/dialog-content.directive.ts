import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[dialogContent]',
  standalone: true,
})
export class DialogContentDirective {
  @HostBinding('class') classes = 'dialog-content';
}
