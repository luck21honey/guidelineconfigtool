import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { effects } from './effects';
import { reducer as nodeReducer, nodeFeatureKey } from './node-store/node.reducer';
import { reducer as guidelineReducer, guidelineFeatureKey } from './guideline-store/guideline.reducer';
import { reducer as tableItemReducer, tableItemFeatureKey } from './table-item-store/table-item.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(nodeFeatureKey, nodeReducer),
    StoreModule.forFeature(guidelineFeatureKey, guidelineReducer),
    StoreModule.forFeature(tableItemFeatureKey, tableItemReducer),
    EffectsModule.forFeature(effects)
  ],
  exports: [StoreModule, EffectsModule],
  declarations: []
})
export class RootStoreModule { }

