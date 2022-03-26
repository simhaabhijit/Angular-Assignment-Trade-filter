import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ItemsListComponent } from './items-list/items-list.component';
import { TradeItemsRoutingModule } from './trade-items-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    ItemsListComponent
  ],
  imports: [
    SharedModule,
    TradeItemsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule
  ]
})
export class TradeItemsModule { }
