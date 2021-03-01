import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Ingredient } from './ingredient.model';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  baseUrl = 'https://ng-course-recipe-book-a8339-default-rtdb.firebaseio.com/';

  constructor(private http: HttpClient, private recipesService: RecipeService, private authService: AuthService) {}

  fetchRecipes(): Observable<{ imagePath: string; name: string; description: string; ingredients: Ingredient[] }[]> {
    return this.http
      .get<Recipe[]>(this.baseUrl + '/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        tap(recipes => {
          this.recipesService.setRecipes(recipes);
        })
      );
  }

  storeRecipes(): void {
    const recipes = this.recipesService.getRecipes();
    this.http.put(this.baseUrl + '/recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }
}
