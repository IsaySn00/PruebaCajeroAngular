import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CajeroService } from 'src/app/core/services/cajero.service';
import { Cajero } from 'src/app/models/cajero.model';

@Component({
  selector: 'app-menu-cajero',
  templateUrl: './menu-cajero.component.html',
  styleUrls: ['./menu-cajero.component.css'],
})
export class MenuCajeroComponent {
  cajeros: Cajero[] = [];
  selectedCajero?: Cajero;

  constructor(private cajeroService: CajeroService, private router: Router) {}

  ngOnInit(): void {
    this.cargarCajeros();
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
}
