import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContentsListComponent } from './table-contents-list.component';

describe('TableContentsListComponent', () => {
  let component: TableContentsListComponent;
  let fixture: ComponentFixture<TableContentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableContentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableContentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
