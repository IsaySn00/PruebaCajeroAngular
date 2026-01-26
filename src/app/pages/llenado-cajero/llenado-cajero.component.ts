import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DenominacionService } from 'src/app/core/services/denominacion.service';
import { Denominacion } from 'src/app/models/denominacion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-llenado-cajero',
  templateUrl: './llenado-cajero.component.html',
  styleUrls: ['./llenado-cajero.component.css'],
})
export class LlenadoCajeroComponent implements OnInit{
  
  form!: FormGroup;
  totalGeneral = 0;
  idCajero = 1; 

  get denominaciones(): FormArray {
    return this.form.get('denominaciones') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private denominacionService: DenominacionService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      denominaciones: this.fb.array([]),
    });

    this.cargarDenominaciones();
  }

  cargarDenominaciones(): void {
    this.denominacionService.getDenominaciones().subscribe({
      next: (res) => {
        if (res.correct && res.object) {
          res.object.forEach((d) => this.agregarDenominacion(d));
        }
      },
      error: () =>
        Swal.fire('Error', 'No se pudieron cargar denominaciones', 'error'),
    });
  }

  agregarDenominacion(den: Denominacion): void {
    const group = this.fb.group({
      idDenominacion: [den.idDenominacion],
      monto: [den.montoDenominacion],
      cantidad: [0],
      subtotal: [0],
    });

    group.get('cantidad')?.valueChanges.subscribe((qty:any) => {
      const subtotal = qty * den.montoDenominacion;
      group.get('subtotal')?.setValue(subtotal, { emitEvent: false });
      this.calcularTotal();
    });

    this.denominaciones.push(group);
  }

  calcularTotal(): void {
    this.totalGeneral = this.denominaciones.controls.reduce(
      (sum, g) => sum + g.get('subtotal')!.value,
      0
    );
  }

  limpiar(): void {
    this.denominaciones.controls.forEach((g) => {
      g.patchValue({ cantidad: 0, subtotal: 0 });
    });
    this.totalGeneral = 0;
  }

  guardar(): void {
    if (this.totalGeneral <= 0) {
      Swal.fire(
        'Advertencia',
        'Debe ingresar al menos una cantidad',
        'warning'
      );
      return;
    }

    const payload = {
      idCajero: this.idCajero,
      detalle: this.denominaciones.value.filter((d:any) => d.cantidad > 0),
    };

    console.log('Payload a enviar:', payload);

    Swal.fire('Éxito', 'Cajero cargado correctamente', 'success');
  }
}
