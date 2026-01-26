import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AtmKeypadService } from 'src/app/core/services/atm-keypad.service';
import { CajeroService } from 'src/app/core/services/cajero.service';
import { CuentaService } from 'src/app/core/services/cuenta.service';
import { RetiroDTO } from 'src/app/models/retiro.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cajero',
  templateUrl: './cajero.component.html',
  styleUrls: ['./cajero.component.css'],
})
export class CajeroComponent implements OnInit, OnDestroy {

  retiroForm!: FormGroup;
  saldoDisponible: number = 0;
  idCajero!: number;
  private enterSubscription: Subscription | undefined;
  private clearSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cajeroService: CajeroService,
    private cuentaService: CuentaService,
    private keypadService: AtmKeypadService
  ) { }

  ngOnInit(): void {

    this.idCajero = Number(this.route.snapshot.paramMap.get('idCajero'));

    this.retiroForm = this.fb.group({
      monto: [null,
        [Validators.required,
        Validators.min(50)]
      ]
    });
    this.consultarSaldo();

    this.enterSubscription = this.keypadService.enterAction$.subscribe(() => {
      this.confirmarRetiro();
    });

    this.clearSubscription = this.keypadService.clearAction$.subscribe(() => {
      this.retiroForm.reset();
    });
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
      idCajero: this.idCajero,
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

  ngOnDestroy() {
    if (this.enterSubscription) {
      this.enterSubscription.unsubscribe();
    }
    if (this.clearSubscription) {
      this.clearSubscription.unsubscribe();
    }
  }

}
