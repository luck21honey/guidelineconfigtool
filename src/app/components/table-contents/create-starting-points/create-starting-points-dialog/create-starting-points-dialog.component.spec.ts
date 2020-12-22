import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStartingPointsDialogComponent } from './create-starting-points-dialog.component';

describe('CreateStartingPointsDialogComponent', () => {
  let component: CreateStartingPointsDialogComponent;
  let fixture: ComponentFixture<CreateStartingPointsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStartingPointsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStartingPointsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
