import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const GCTFileManagementModule = () => import('./components/gct-file-management/gct-file-management.module').then(x => x.GCTFileManagementModule);
const GCTEditorModule = () => import('./components/gct-editor/gct-editor.module').then(x => x.GCTEditorModule);
const routes: Routes = [
 
  { path: '', loadChildren: GCTFileManagementModule},
  { path: 'editor', loadChildren: GCTEditorModule},
  { path: 'editor/:guidelineType/:id', loadChildren: GCTEditorModule},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
