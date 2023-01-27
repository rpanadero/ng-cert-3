import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dialogInsertionPoint', { read: ViewContainerRef })
  dialogInsertionPoint?: ViewContainerRef;

  childComponentType?: Type<any>;

  private childComponentRef?: ComponentRef<unknown>;

  constructor(public viewContainerRef: ViewContainerRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.loadChildComponent();
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.childComponentRef?.destroy();
  }

  onClickOverlay(evt: MouseEvent) {
    evt.stopPropagation();
  }

  onClickDialog(evt: MouseEvent) {
    evt.stopPropagation();
  }

  private loadChildComponent() {
    if (!this.childComponentType || !this.dialogInsertionPoint) {
      return;
    }
    this.dialogInsertionPoint.clear();
    this.childComponentRef = this.dialogInsertionPoint.createComponent(this.childComponentType);
  }
}
