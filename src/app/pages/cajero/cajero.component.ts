import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CajeroService } from 'src/app/core/services/cajero.service';
import { CuentaService } from 'src/app/core/services/cuenta.service';
import { RetiroDTO } from 'src/app/models/retiro.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cajero',
  templateUrl: './cajero.component.html',
  styleUrls: ['./cajero.component.css'],
})
export class CajeroComponent implements OnInit {

  retiroForm!: FormGroup;
  saldoDisponible: number = 0;

  constructor(
    private fb: FormBuilder,
    private cajeroService: CajeroService,
    private cuentaService: CuentaService
  ) { }

  ngOnInit(): void {
    this.retiroForm = this.fb.group({
      monto: [null,
        [Validators.required,
        Validators.min(50)]
      ]
    });
    this.consultarSaldo();
  }

  setAmount(amount: number): void {
    this.retiroForm.patchValue({ monto: amount });
  }

  confirmarRetiro(): void {
    if (this.retiroForm.invalid) {
      this.retiroForm.markAllAsTouched();
      return
    }

    const retiroDTO: RetiroDTO = {
      idUsuario: 1,
      idCajero: 2,
      monto: this.retiroForm.value.monto
    };

    this.cajeroService.retirarDinero(retiroDTO)
      .subscribe({
        next: (response) => {
          if (response.correct) {
            Swal.fire('Operación exitosa', response.object, 'success');
            this.retiroForm.reset();
            this.consultarSaldo();
          } else {
            Swal.fire('Error', response.object, 'error');
          }
        },
        error: () => {
          Swal.fire('Error', 'Error al conectar con el servicio', 'error');
        }
      });

  }

  private consultarSaldo() {
    this.cuentaService.getMontoCuentaUsuario(1)
      .subscribe({
        next: (response) => {
          this.saldoDisponible = response.object;
        },
        error: () => {
          alert("Error al obtener el saldo del usuario")
        }
      })
  }

}
