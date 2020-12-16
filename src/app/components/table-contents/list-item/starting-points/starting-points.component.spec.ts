import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingPointsComponent } from './starting-points.component';

describe('StartingPointsComponent', () => {
  let component: StartingPointsComponent;
  let fixture: ComponentFixture<StartingPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
