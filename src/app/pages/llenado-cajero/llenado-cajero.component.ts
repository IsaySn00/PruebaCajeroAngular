import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AtmKeypadService } from 'src/app/core/services/atm-keypad.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CajeroService } from 'src/app/core/services/cajero.service';
import { DenominacionService } from 'src/app/core/services/denominacion.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-llenado-cajero',
  templateUrl: './llenado-cajero.component.html',
  styleUrls: ['./llenado-cajero.component.css'],
})
export class LlenadoCajeroComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private denominacionService: DenominacionService,
    private cajeroService: CajeroService,
    private authService: AuthService,
    private keypadService: AtmKeypadService,
    private location: Location
  ) { }

  denominaciones: any[] = [];
  totalGeneral = 0;
  idCajero!: number;
  private enterSubscription: Subscription | undefined;
  private clearSubscription: Subscription | undefined;
  private cancelSubscription: Subscription | undefined;


  ngOnInit(): void {

    this.enterSubscription = this.keypadService.enterAction$.subscribe(() => {
      this.llenarCajero();
    });

    this.clearSubscription = this.keypadService.clearAction$.subscribe(() => {
      this.limpiar();
    });

    this.cancelSubscription = this.keypadService.cancelAction$.subscribe(() => {
      this.location.back();
    })
    this.idCajero = Number(this.route.snapshot.paramMap.get('idCajero'));
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

  llenarCajero(): void {
    const detalle = this.denominaciones.filter((d: any) => d.cantidad > 0);

    if (detalle.length === 0) {
      Swal.fire('Advertencia', 'No hay denominaciones ingresadas', 'warning');
      return;
    }

    const idUsuario = this.authService.getIdUsuario();

    const peticiones$ = detalle.map((d: any) => {
      const payload = {
        idUsuario,
        idCajero: this.idCajero,
        idDenominacion: d.idDenominacion,
        cantidad: d.cantidad
      };

      return this.cajeroService.llenarCajero(payload);
    });

    forkJoin(peticiones$).subscribe({
      next: (responses) => {

        const error = responses.find(r =>
          !r.correct || Number(r.SpStatus) === 0
        );

        if (error) {

          Swal.fire({
            title: 'Error en llenado',
            text: error.object || 'No se pudo llenar el cajero',
            icon: 'error',
            background: '#000',
            color: '#0f0'
          });
          return;
        }

        Swal.fire({
          title: 'Operación Exitosa',
          text: 'Cajero llenado correctamente',
          icon: 'success',
          background: '#000',
          color: '#0f0'
        });

        this.limpiar();
      },
      error: () => {
        Swal.fire(
          'Error',
          'Error al conectar con el servicio',
          'error'
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cancelSubscription) {
      this.cancelSubscription.unsubscribe();
    }
  }
}
