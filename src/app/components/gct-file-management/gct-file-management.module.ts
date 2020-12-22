import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';

import { CreateGuidelineComponent, CreateGuidelineDialogComponent } from './create-guideline/create-guideline.component';
import { GuidelineListComponent } from './guideline-list/guideline-list.component';
import { SharedModule } from '../../shared/shared.module';
import { GCTFileManagementComponent } from './gct-file-management.component';
import { GCTFileManagementRoutingModule } from './gct-file-management-routing.module';
import { GuidelineVersionListComponent } from './guideline-list/guideline-version-list/guideline-version-list.component';

const components = [
  CreateGuidelineComponent,
  CreateGuidelineDialogComponent,
  GuidelineListComponent,
  GCTFileManagementComponent,
  GuidelineVersionListComponent
];

@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatSortModule,
    GCTFileManagementRoutingModule
  ],
  exports: [
    ...components
  ]
})
export class GCTFileManagementModule { }
