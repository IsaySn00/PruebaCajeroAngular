import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlenadoCajeroComponent } from './llenado-cajero.component';

describe('LlenadoCajeroComponent', () => {
  let component: LlenadoCajeroComponent;
  let fixture: ComponentFixture<LlenadoCajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LlenadoCajeroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlenadoCajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
