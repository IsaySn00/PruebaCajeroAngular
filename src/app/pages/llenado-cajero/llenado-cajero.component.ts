import { Component, OnInit } from '@angular/core';
import { CajeroService } from 'src/app/core/services/cajero.service';
import { DenominacionService } from 'src/app/core/services/denominacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-llenado-cajero',
  templateUrl: './llenado-cajero.component.html',
  styleUrls: ['./llenado-cajero.component.css'],
})
export class LlenadoCajeroComponent implements OnInit {


  denominaciones: any[] = [];
  totalGeneral = 0;
  idCajero = 1;


  constructor(
    private denominacionService: DenominacionService,
    private cajeroService : CajeroService
  ) { }

  ngOnInit(): void {
    this.cargarDenominaciones();
  }

  cargarDenominaciones(): void {
    this.denominacionService.getDenominaciones().subscribe({
      next: (res) => {
        if (res.correct && res.object) {
          this.denominaciones = res.object
            .sort((a: any, b: any) => b.montoDenominacion - a.montoDenominacion)
            .map((d: any) => ({
              idDenominacion: d.idDenominacion,
              monto: d.montoDenominacion,
              cantidad: 0,
              subtotal: 0
            }));
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar denominaciones', 'error');
      }
    });
  }

  onCantidadChange(item: any): void {
    item.cantidad = Number(item.cantidad) || 0;
    item.subtotal = item.cantidad * item.monto;
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.totalGeneral = this.denominaciones.reduce(
      (sum, d) => sum + d.subtotal,
      0
    );
  }

  limpiar(): void {
    this.denominaciones.forEach(d => {
      d.cantidad = 0;
      d.subtotal = 0;
    });
    this.totalGeneral = 0;
  }

  guardar(): void {
    const detalle = this.denominaciones.filter(d => d.cantidad > 0);

    if (detalle.length === 0) {
      Swal.fire(
        'Advertencia',
        'Debe ingresar al menos una cantidad',
        'warning'
      );
      return;
    }

    const peticiones = detalle.map(d => {
      const payload = {
        idUsuario: 1,
        idCajero: this.idCajero,
        idDenominacion: d.idDenominacion,
        cantidad: d.cantidad
      };

      console.log('Enviando:', payload);

      return this.cajeroService.llenarCajero(payload);
    });

    Promise.all(peticiones.map(p => p.toPromise()))
      .then(() => {
        Swal.fire(
          'Éxito',
          'Cajero llenado correctamente',
          'success'
        );
        this.limpiar();
      })
      .catch(() => {
        Swal.fire(
          'Error',
          'Error al llenar el cajero',
          'error'
        );
      });
  }
}
