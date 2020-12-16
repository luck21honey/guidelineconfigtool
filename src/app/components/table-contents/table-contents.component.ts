import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TableItem } from 'src/app/models/dto/table-item';
import { State } from 'src/app/store/table-item-store/table-item.reducer';
import { selectTableItems } from 'src/app/store/table-item-store/table-item.selectors';

@Component({
  selector: 'app-table-contents',
  templateUrl: './table-contents.component.html',
  styleUrls: ['./table-contents.component.scss']
})
export class TableContentsComponent implements OnInit {

  startingPoints$: Observable<TableItem[]>;
  isEditMode = false;

  @Input() isPreviewMode: boolean;

  @Output() closeEvent = new EventEmitter();

  constructor(private store: Store<State>) {
    this.startingPoints$ = this.store.select(selectTableItems);
  }

  ngOnInit(): void { }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  close(): void {
    this.isEditMode = false;
    this.closeEvent.emit();
  }
}
