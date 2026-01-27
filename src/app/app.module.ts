import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CajeroComponent } from './pages/cajero/cajero.component';
import { SeleccionarCajeroComponent } from './pages/seleccionar-cajero/seleccionar-cajero.component';
import { MenuCajeroComponent } from './pages/menu-cajero/menu-cajero.component';
import { LlenadoCajeroComponent } from './pages/llenado-cajero/llenado-cajero.component';
import { AtmLayoutComponent } from './layout/atm-layout/atm-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CajeroComponent,
    SeleccionarCajeroComponent,
    MenuCajeroComponent,
    LlenadoCajeroComponent,
    AtmLayoutComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent, CajeroComponent]
})
export class AppModule { }
