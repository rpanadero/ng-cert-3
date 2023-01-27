import { Subject } from 'rxjs'

export class DialogRef {
  private readonly afterClosedSubject = new Subject<any>()
  afterClosed$ = this.afterClosedSubject.asObservable();

  constructor() {}

  close(result?: any ) {
    this.afterClosedSubject.next(result)
  }
}
