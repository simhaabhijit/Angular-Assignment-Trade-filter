import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsListComponent } from './trade-items/items-list/items-list.component';

const routes: Routes = [
  { path: 'items-list', loadChildren: () => import('./trade-items/trade-items.module').then(m => m.TradeItemsModule) },
  { path: '**', redirectTo: 'items-list' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
