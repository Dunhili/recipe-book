import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { ShoppingListService } from './shopping-list.service';
import { RouterModule } from '@angular/router';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent
  ],
  providers: [ShoppingListService],
  imports: [
    RouterModule,
    SharedModule,
    ShoppingListRoutingModule
  ]
})
export class ShoppingListModule {

}
