import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core';
import {ShoppingListService} from '../shopping-list.service';
import {Ingredient} from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit {
  @ViewChild('nameInput', {static: true}) nameInput: ElementRef;
  @ViewChild('amountInput', {static: true}) amountInput: ElementRef;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
  }

  onAddSelected(): void {
    this.shoppingListService.addIngredient(new Ingredient(this.nameInput.nativeElement.value, this.amountInput.nativeElement.value));
  }
}
