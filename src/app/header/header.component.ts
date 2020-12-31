import {Component, OnInit, Output} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() featureSelected = new EventEmitter<string>();
  collapsed = true;

  constructor() { }

  ngOnInit(): void {
  }

  onSelectRecipe(): void {
    this.featureSelected.emit('recipe');
  }

  onSelectShoppingList(): void {
    this.featureSelected.emit('shoppingList');
  }
}
