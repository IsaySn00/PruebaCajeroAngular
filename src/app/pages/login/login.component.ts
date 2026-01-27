import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AtmKeypadService } from 'src/app/core/services/atm-keypad.service';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;

  private enterSubscription: Subscription | undefined;
  private clearSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private keypadService: AtmKeypadService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      numeroCuenta: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      nip: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*$')]]
    });

    this.enterSubscription = this.keypadService.enterAction$.subscribe(() => {
      this.procesarLogin();
    });

    this.clearSubscription = this.keypadService.clearAction$.subscribe(() => {
      this.loginForm.reset();
    });
  }

  procesarLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        title: 'ERROR DE ACCESO',
        text: 'VERIFIQUE SUS CREDENCIALES',
        icon: 'error',
        background: '#000',
        color: '#fff',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const { numeroCuenta, nip } = this.loginForm.value;

    Swal.fire({
      title: 'VALIDANDO...',
      text: 'ESPERE POR FAVOR',
      allowOutsideClick: false,
      background: '#000',
      color: '#0f0',
      didOpen: () => Swal.showLoading()
    });

    this.authService.login(numeroCuenta, nip).subscribe({
      next: (res) => {
        if (res.correct && res.object) {
          this.authService.guardarToken(res.object);

          Swal.fire({
            title: 'ACCESO CONCEDIDO',
            icon: 'success',
            timer: 1200,
            showConfirmButton: false,
            background: '#000',
            color: '#0f0'
          }).then(() => {
            this.router.navigate(['/']);
          });

        } else {
          Swal.fire('ERROR', res.errorMessage || 'Credenciales inválidas', 'error');
        }
      },
      error: () => {
        Swal.fire({
          title: 'ERROR',
          text: 'NO SE PUDO CONECTAR AL SERVIDOR',
          icon: 'error',
          background: '#000',
          color: '#fff'
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.enterSubscription?.unsubscribe();
    this.clearSubscription?.unsubscribe();
  }
}
