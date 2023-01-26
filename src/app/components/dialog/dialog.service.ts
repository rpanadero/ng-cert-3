import { ComponentRef, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs';
import { DialogConfig } from './dialog-config.model';
import { DialogRef } from './dialog-ref.model';
import { DialogComponent } from './dialog.component';
import { DIALOG_CONFIG, DIALOG_REF } from './dialog.token';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private viewRef?: ViewContainerRef;
  private dialogCmpRef?: ComponentRef<DialogComponent>;

  constructor() {}

  open<T>(dialogCmp: Type<T>, config?: DialogConfig) {
    if (!this.viewRef) {
      throw new Error('No dialogOutlet set');
    }

    this.close(); // Destroy any existing dialog

    const dialogRef = new DialogRef();
    this.dialogCmpRef = this.viewRef?.createComponent(DialogComponent, {
      injector: Injector.create({
        providers: [
          {
            provide: DIALOG_CONFIG,
            useValue: config,
          },
          {
            provide: DIALOG_REF,
            useValue: dialogRef,
          },
        ],
      }),
    });

    if (!this.dialogCmpRef) {
      console.error('Error opening dialog');
      return;
    }

    dialogRef.afterClosed$.pipe(take(1)).subscribe(() => {
      // Removes the dialog
      this.viewRef?.clear();
    });

    this.dialogCmpRef.instance.childComponentType = dialogCmp;
    return dialogRef;
  }

  close() {
    this.viewRef?.clear();
  }

  setContext(vRef: ViewContainerRef) {
    this.viewRef = vRef;
  }
}
