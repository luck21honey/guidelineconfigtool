import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { NodeMap } from 'src/app/models/dto/node';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/table-item-store/table-item.reducer';
import { selectAllStartingPointNodeIds } from 'src/app/store/table-item-store/table-item.selectors';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnChanges {

  @ViewChild('drawer') drawer: MatSidenav;
  @Input() isOpen: boolean;
  @Input() isPreviewMode: boolean;
  @Input() guidelineId: number;
  @Input() nodeMap: NodeMap;
  startingPointNodeIds$: Observable<any>;

  constructor( private store: Store<State>) { }

  ngOnInit(): void {
    this.startingPointNodeIds$ = this.store.select(selectAllStartingPointNodeIds);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isOpen && changes.isOpen.previousValue !== undefined && changes.isOpen.currentValue !== changes.isOpen.previousValue) {
      this.closeHandler();
    }
  }

  closeHandler(): void {
    this.drawer.toggle();
  }
}
