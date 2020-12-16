import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStartingPointsComponent } from './create-starting-points.component';

describe('StartingPointsComponent', () => {
  let component: CreateStartingPointsComponent;
  let fixture: ComponentFixture<CreateStartingPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStartingPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStartingPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
