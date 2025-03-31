export interface Recipe {
  id: number | string;
  title: string;
  image?: string;
  description?: string;
  ingredients?: string[];
  usedIngredients?: string[];
  missedIngredients?: string[];
  instructions?: string;
}

export interface VegetableIdentificationResponse {
  vegetables: string[];
  imagePath: string;
}

export interface RecipeResponse {
  recipes: Recipe[];
}
