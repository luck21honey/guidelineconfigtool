import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableItem } from 'src/app/models/dto/table-item';


interface CreateStartingPointDialogData {
  guidelineId: number;
  nodeId?: number;
}


@Component({
  selector: 'app-create-starting-points-dialog',
  templateUrl: './create-starting-points-dialog.component.html',
  styleUrls: ['./create-starting-points-dialog.component.scss']
})
export class CreateStartingPointsDialogComponent implements OnInit {

  name = '';

  constructor(
    private dialogRef: MatDialogRef<CreateStartingPointsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateStartingPointDialogData
  ) { }

  ngOnInit(): void { }

  generateNewStartingPoint(): TableItem {
    return {
      id: null,
      name: this.name,
      code: this.name,
      pageNumber: 2, // need to pass non null page number to backend but any number will do, backend handles calc of next page number
      nodeIds: this.data.nodeId ? [this.data.nodeId] : [],
      guideline: { // only id is needed for this call
        id: this.data.guidelineId,
        createdDate: null,
        guidelineVersion: null,
        tableItems: null,
        removed: false
      },
      startingPoint: true
    };
  }

  save(): void {
    this.dialogRef.close(this.generateNewStartingPoint());
  }

}


