import { InjectionToken } from '@angular/core';
import { DialogConfig } from './dialog-config.model';
import { DialogRef } from './dialog-ref.model';

export const DIALOG_CONFIG = new InjectionToken<DialogConfig>('DIALOG_CONFIG');
export const DIALOG_REF = new InjectionToken<DialogRef>('DIALOG_REFERENCE');;