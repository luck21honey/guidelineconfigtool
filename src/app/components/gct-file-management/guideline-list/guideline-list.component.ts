import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { detailExpand, detailExpandArrow } from 'src/app/shared/animations/animations';
import { State } from 'src/app/store/guideline-store/guideline.reducer';
import { loadAll, deleteGuidelineVersion } from 'src/app/store/guideline-store/guideline.actions';
import { selectGuidelineIsLoading, selectGuidelineListData } from 'src/app/store/guideline-store/guideline.selectors';
import { Observable, Subscription } from 'rxjs';
import { GuidelineListData } from 'src/app/models/business/guideline-list-data';
import { CreateGuidelineDialogComponent } from '../../gct-file-management/create-guideline/create-guideline.component';
import { MatDialog } from '@angular/material/dialog';
import { GuidelineType } from 'src/app/models/dto/guideline-type';
import { Router } from '@angular/router';
import { DELETE_GUIDELINE_CONFIRMATION, confirmationDialogConfig } from 'src/app/constants';
import { ConfirmationDialogComponent, DialogData } from '../../confirmation-dialog/confirmation-dialog.component';
import { AlertType } from 'src/app/models/enums/alert-type';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-guideline-list',
  templateUrl: './guideline-list.component.html',
  styleUrls: ['./guideline-list.component.scss'],
  animations: [detailExpand, detailExpandArrow],
})
export class GuidelineListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<GuidelineListData> = new MatTableDataSource([]);
  guidelinesData$: Subscription;
  isLoading$: Observable<boolean>;
  columnsToDisplay = ['arrow', 'cancerType', 'version', 'modified', 'created', 'actions'];
  expandedElement: GuidelineListData | null;

  constructor(private store: Store<State>, public dialog: MatDialog, private _router: Router) {
    this.guidelinesData$ = this.store.select(selectGuidelineListData).subscribe((data) => this.dataSource.data = data);
    this.isLoading$ = this.store.select(selectGuidelineIsLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadAll());
    this.configureTable();
  }

  ngOnDestroy(): void {
    this.guidelinesData$.unsubscribe();
  }

  configureTable(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (element: GuidelineListData, property) => {
      switch (property) {
        case 'cancerType': return element.guidelineType.name;
        default: return element[property];
      }
    };
  }

  handleExpand(element: GuidelineListData): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  openCreateDialog(guidelineType: GuidelineType): void {
    this.dialog.open(CreateGuidelineDialogComponent, { width: '854px', height: '495px', data: guidelineType });
  }

  openDeleteDialog(guidelineVersionId: number): void {
    const data: DialogData = {
      title: 'Delete Confirmation',
      content: DELETE_GUIDELINE_CONFIRMATION,
      type: AlertType.Warning,
      acceptText: 'Confirm',
      declineText: 'Cancel'
    };

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        ...confirmationDialogConfig,
        data,
        panelClass: 'confirmation-dialog'
      }
    );

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.delete(guidelineVersionId);
      }
    });
  }

  delete(guidelineVersionId: number): void {
    this.store.dispatch(deleteGuidelineVersion({ guidelineVersionId }));
  }

  navigateToEditor(id: number, guidelineType: string, version: string): void {
    const typeAndVersion = `${guidelineType}_${version}`;
    this._router.navigate([`/editor/${typeAndVersion}/${id}`] );
  }
}
