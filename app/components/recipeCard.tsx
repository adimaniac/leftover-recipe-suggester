import React from 'react';
import { Recipe } from '../libs/types';
import Image from 'next/image';

interface RecipeCardProps {
  recipe: Recipe;
  isLast: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isLast }) => {
  return (
    <div className={`flex flex-col md:flex-row ${isLast ? '' : 'border-b pb-6 mb-6'}`}>
      <div className="md:w-1/3 flex-shrink-0 mb-4 md:mb-0 md:pr-4">
        <div className="relative w-full h-40">
          <Image 
            src={recipe.image || '/images/placeholder.jpg'} 
            alt={recipe.title} 
            fill
            className="object-cover rounded-lg shadow-sm"
          />
        </div>
      </div>
      <div className="md:w-2/3">
        <h3 className="text-lg font-medium text-gray-800 mb-2">{recipe.title}</h3>

        {recipe.description && (
          <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
        )}

        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Ingredients:</h4>
          <div className="flex flex-wrap gap-1">
            {(recipe.ingredients || recipe.usedIngredients || []).map((ing, index) => (
              <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {ing}
              </span>
            ))}

            {recipe.missedIngredients && recipe.missedIngredients.length > 0 && 
              recipe.missedIngredients.map((ing, index) => (
                <span key={`missed-${index}`} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  {ing} (needed)
                </span>
              ))
            }
          </div>
        </div>

        {recipe.instructions && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Instructions:</h4>
            <p className="text-gray-600 text-sm">{recipe.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;