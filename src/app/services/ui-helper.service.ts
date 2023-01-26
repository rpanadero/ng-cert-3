import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiHelperService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  showToast<T>(msg: string, duration = 3000) {
    const toast = this.doc.createElement('span');
    toast.textContent = msg;
    toast.classList.add('toast');
    const el = this.doc.body.appendChild(toast);
    timer(duration).subscribe(() => {
      el.remove();
    });
  }
}
