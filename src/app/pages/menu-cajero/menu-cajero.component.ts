import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AtmKeypadService } from 'src/app/core/services/atm-keypad.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CajeroService } from 'src/app/core/services/cajero.service';
import { Cajero } from 'src/app/models/cajero.model';

@Component({
  selector: 'app-menu-cajero',
  templateUrl: './menu-cajero.component.html',
  styleUrls: ['./menu-cajero.component.css'],
})
export class MenuCajeroComponent implements OnDestroy{

  cajeros: Cajero[] = [];
  selectedCajero?: Cajero;
  isAdmin = false;
  private cancelSubscription: Subscription | undefined;

  constructor(
    private cajeroService: CajeroService, 
    private router: Router, 
    private authService :  AuthService,
    private keypadService :  AtmKeypadService
  ) {}

  ngOnInit(): void {
    this.cargarCajeros();
    this.isAdmin = this.authService.isAdmin();

    this.cancelSubscription = this.keypadService.cancelAction$.subscribe(() => {
      this.cerrarSesion();
    })
  }

  cargarCajeros(): void {
    this.cajeroService.getCajeros().subscribe({
      next: (res) => {
        if (res.correct && res.object) {
          this.cajeros = res.object;
        }
      },
      error: () => {
        alert('Error al cargar los cajeros');
      },
    });
  }

  seleccionarCajero(cajero: Cajero): void {
    this.router.navigate(['/retiro', cajero.idCajero]); 
  }

  irLlenado(cajero: Cajero){
    this.router.navigate(['admin/llenado', cajero.idCajero]);
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.limpiarSesion();
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cancelSubscription) {
      this.cancelSubscription.unsubscribe();
    }
  }
}
