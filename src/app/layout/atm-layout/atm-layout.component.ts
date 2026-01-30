import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AtmKeypadService } from 'src/app/core/services/atm-keypad.service';

@Component({
  selector: 'app-atm-layout',
  templateUrl: './atm-layout.component.html',
  styleUrls: ['./atm-layout.component.css'],
})
export class AtmLayoutComponent {

  constructor(private router: Router, private keypadService: AtmKeypadService) {}

  aceptar() {
    this.keypadService.notifyEnter();
  }

  cancelar() {

    this.keypadService.notifyCancel();
  }

  corregir() {
    this.keypadService.notifyClear();
  }
  
  activarAdmin() {
     this.router.navigate(['/admin-login']);
  }
}
