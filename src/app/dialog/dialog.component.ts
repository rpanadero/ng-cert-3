import { CommonModule } from '@angular/common';
import { Component, ContentChild, OnInit, TemplateRef } from '@angular/core';
import { DialogContentDirective } from './dialog-content.directive';
import { DialogFooterDirective } from './dialog-footer.directive';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DialogComponent implements OnInit {
  @ContentChild(DialogContentDirective, { read: TemplateRef })
  contentTmpl?: TemplateRef<DialogContentDirective>;
  @ContentChild(DialogFooterDirective, { read: TemplateRef })
  footerTmpl?: TemplateRef<DialogFooterDirective>;

  constructor() {}

  ngOnInit(): void {
    console.log('TEST');
  }

  ngAfterContentInit() {
    setInterval(() => {
      console.log('INIT 2', this.contentTmpl, this.footerTmpl);
    }, 5000);
  }
}
