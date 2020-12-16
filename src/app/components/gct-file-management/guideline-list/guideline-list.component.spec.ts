import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidelineListComponent } from './guideline-list.component';

describe('GuidelineListComponent', () => {
  let component: GuidelineListComponent;
  let fixture: ComponentFixture<GuidelineListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidelineListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidelineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
