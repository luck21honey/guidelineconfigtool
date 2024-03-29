import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GuidelineVersion } from 'src/app/models/dto/guideline-version';

@Component({
  selector: 'app-guideline-version-list',
  templateUrl: './guideline-version-list.component.html',
  styleUrls: ['../guideline-list.component.scss']
})
export class GuidelineVersionListComponent implements OnInit {

  @Input() set data(newData: GuidelineVersion[]) { this.dataSource.data = newData; }
  @Input() latestVersionId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<GuidelineVersion> = new MatTableDataSource([]);
  columnsToDisplay = [
    'innerArrow',
    'innerCancerType',
    'innerVersion',
    'innerModified',
    'innerCreator',
    'innerCreated',
    'innerActions'
  ];

  constructor() { }

  ngOnInit(): void {
    this.configureTable();
  }

  configureTable(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (element: GuidelineVersion, property) => {
      switch (property) {
        case 'innerVersion': return element.providerGuidelineVersion;
        case 'innerModified': return element.lastModifiedDate;
        case 'innerCreated': return new Date(element.createdDate);
        // case 'innerCreator': return element.createdBy;
        default: return element[property];
      }
    };
  }

}
