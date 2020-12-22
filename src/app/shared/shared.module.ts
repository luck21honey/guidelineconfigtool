import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { NavbarComponent } from '../components/layout/navbar/navbar.component';
import { SidebarComponent } from '../components/layout/sidebar/sidebar.component';
import { GraphComponent } from '../components/graph/graph.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { AlertComponent } from '../components/alert/alert.component';
import { TextEditorComponent } from '../components/gct-editor/text-editor/text-editor.component';
import { TableContentsComponent } from 'src/app/components/table-contents/table-contents.component';
import { TINYMCE_SCRIPT_SRC, EditorModule } from '@tinymce/tinymce-angular';
import { ListItemComponent } from 'src/app/components/table-contents/list-item/list-item.component';
import { TableContentsListComponent } from 'src/app/components/table-contents/table-contents-list/table-contents-list.component';
import { CreateStartingPointsComponent } from 'src/app/components/table-contents/create-starting-points/create-starting-points.component';
import { CreateStartingPointsDialogComponent } from 'src/app/components/table-contents/create-starting-points/create-starting-points-dialog/create-starting-points-dialog.component';
import { StartingPointComponent } from 'src/app/components/table-contents/list-item/starting-point/starting-point.component';
import { StartingPointsComponent } from 'src/app/components/table-contents/list-item/starting-points/starting-points.component';
import { AlertService } from '../services/alert.service';
import { FooterComponent } from '../components/layout/footer/footer.component';


// TODO: Bring Table of Contents into its own feature module
const components = [
  NavbarComponent,
  SidebarComponent,
  FooterComponent,
  GraphComponent,
  TextEditorComponent,
  ConfirmationDialogComponent,
  TableContentsComponent,
  TableContentsListComponent,
  ListItemComponent,
  CreateStartingPointsComponent,
  CreateStartingPointsDialogComponent,
  StartingPointComponent,
  StartingPointsComponent,
  AlertComponent
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule
  ],
  providers: [
    AlertService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ...components
  ]
})
export class SharedModule { }
