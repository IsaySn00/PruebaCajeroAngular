import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtmKeypadService {

  private enterSource = new Subject<void>();
  private cancelSource = new Subject<void>();
  private clearSource = new Subject<void>();

  enterAction$ = this.enterSource.asObservable();
  cancelAction$ = this.cancelSource.asObservable();
  clearAction$ = this.clearSource.asObservable();

  constructor() { }

  notifyEnter() {
    this.enterSource.next();
  }

  notifyCancel() {
    this.cancelSource.next();
  }

  notifyClear() {
    this.clearSource.next();
  }
}
