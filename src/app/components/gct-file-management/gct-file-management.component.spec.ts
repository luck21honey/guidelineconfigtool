import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GCTFileManagementComponent } from './gct-file-management.component';

describe('GCTFileManagementComponent', () => {
  let component: GCTFileManagementComponent;
  let fixture: ComponentFixture<GCTFileManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GCTFileManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GCTFileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
