import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuCajeroComponent } from './pages/menu-cajero/menu-cajero.component';
import { CajeroComponent } from './pages/cajero/cajero.component';
import { LlenadoCajeroComponent } from './pages/llenado-cajero/llenado-cajero.component';
import { AtmLayoutComponent } from './layout/atm-layout/atm-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AtmLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },

      {
        path: '',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: MenuCajeroComponent },
          { path: 'retiro/:idCajero', component: CajeroComponent },
          { path: 'admin/llenado/:idCajero', component: LlenadoCajeroComponent },
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
