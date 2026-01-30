import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AtmKeypadService } from 'src/app/core/services/atm-keypad.service';
import { AuthService } from 'src/app/core/services/auth.service';
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
  idUsuario = this.authService.getIdUsuario();
  private enterSubscription: Subscription | undefined;
  private clearSubscription: Subscription | undefined;
  private cancelSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cajeroService: CajeroService,
    private cuentaService: CuentaService,
    private keypadService: AtmKeypadService,
    private authService: AuthService,
    private location: Location
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

    this.cancelSubscription = this.keypadService.cancelAction$.subscribe(() => {
      this.location.back();
    })
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
      idUsuario: this.idUsuario,
      idCajero: this.idCajero,
      monto: this.retiroForm.value.monto
    };

    this.cajeroService.retirarDinero(retiroDTO)
      .subscribe({
        next: (response) => {
          if (response.correct) {

            const iconModal = (response.SpStatus != 1) ? "error" : "success";
            const titleModal = (response.SpStatus != 1) ? "Error al realizar la operación" : "Operación Exitosa";
            console.log(response.SpStatus, typeof response.SpStatus);

            Swal.fire({
              title: titleModal,
              text: response.object,
              icon: iconModal,
              background: '#000',
              color: '#0f0',
            });
            this.retiroForm.reset();
            this.consultarSaldo();
          } else {
            Swal.fire({
              title: 'Error',
              text: response.object,
              icon: 'error',
              background: '#000',
              color: '#0f0'
            });
          }
        },
        error: () => {
          Swal.fire('Error', 'Error al conectar con el servicio', 'error');
        }
      });

  }

  private consultarSaldo() {
    this.cuentaService.getMontoCuentaUsuario(this.idUsuario)
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

    if (this.cancelSubscription) {
      this.cancelSubscription.unsubscribe();
    }
  }

}
