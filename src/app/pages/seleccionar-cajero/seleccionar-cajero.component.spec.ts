import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarCajeroComponent } from './seleccionar-cajero.component';

describe('SeleccionarCajeroComponent', () => {
  let component: SeleccionarCajeroComponent;
  let fixture: ComponentFixture<SeleccionarCajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionarCajeroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarCajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
