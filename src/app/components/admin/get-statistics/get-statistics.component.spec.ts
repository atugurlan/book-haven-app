import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStatisticsComponent } from './get-statistics.component';

describe('GetStatisticsComponent', () => {
  let component: GetStatisticsComponent;
  let fixture: ComponentFixture<GetStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetStatisticsComponent]
    });
    fixture = TestBed.createComponent(GetStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
