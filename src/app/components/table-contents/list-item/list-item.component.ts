import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { TableItem } from 'src/app/models/dto/table-item';
import { selectNodesByIds } from 'src/app/store/node-store/node.selectors';
import { State } from 'src/app/store/node-store/node.reducer';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

  @Input() item: TableItem;
  @Input() isEditMode: boolean;
  @Output() updateTableItemEvent = new EventEmitter<TableItem>();
  @Output() deleteEvent = new EventEmitter<number>();

  currentName: string;
  isFocused = false;

  constructor( private store: Store<State>) { }

  ngOnInit(): void {
    const { name } = this.item;
    this.currentName = name;
  }

  toggleFocus(focused: boolean): void {
    if (this.shouldUpdate(!focused)) {
      this.updateOnBlur();
    }
    this.isFocused = focused;
  }

  updateOnBlur(): void {
    const newTableItem = { ...this.item, name: this.currentName };
    this.updateTableItemEvent.emit(newTableItem);
  }

  delete(): void {
    this.deleteEvent.emit(this.item.id);
  }

  shouldUpdate(isBlurEvent: boolean): boolean {
    return isBlurEvent && this.currentName !== this.item.name;
  }

}
