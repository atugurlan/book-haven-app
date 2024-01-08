import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDiscountsComponent } from './set-discounts.component';

describe('SetDiscountsComponent', () => {
  let component: SetDiscountsComponent;
  let fixture: ComponentFixture<SetDiscountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetDiscountsComponent]
    });
    fixture = TestBed.createComponent(SetDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
