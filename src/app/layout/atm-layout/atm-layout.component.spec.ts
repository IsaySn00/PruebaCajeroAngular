import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmLayoutComponent } from './atm-layout.component';

describe('AtmLayoutComponent', () => {
  let component: AtmLayoutComponent;
  let fixture: ComponentFixture<AtmLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtmLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtmLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
