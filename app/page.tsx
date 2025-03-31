'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [identifiedVegetables, setIdentifiedVegetables] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setRecipes([]);
      setIdentifiedVegetables([]);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      // First, identify vegetables in the image
      const vegetablesResponse = await fetch('/api/identify-vegetables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      if (!vegetablesResponse.ok) {
        throw new Error('Failed to identify vegetables');
      }

      const { vegetables } = await vegetablesResponse.json();
      setIdentifiedVegetables(vegetables);

      // Then, get recipe suggestions
      const recipesResponse = await fetch('/api/get-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vegetables }),
      });

      if (!recipesResponse.ok) {
        throw new Error('Failed to get recipe suggestions');
      }

      const { recipes } = await recipesResponse.json();
      setRecipes(recipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="header">
        <h1 className="title">Leftover Recipe Suggester</h1>
        <p className="subtitle">Upload a photo of your leftover vegetables and get recipe suggestions!</p>
      </div>

      <div className="upload-section">
        <label className="upload-button">
          Choose image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="input-upload"
          />
        </label>
        <div className="button-container">
          <button
            onClick={handleUpload}
            disabled={!selectedImage || loading}
            className="btn-primary"
          >
            {loading ? 'Processing...' : 'Get Recipes'}
          </button>
        </div>
      </div>

      {selectedImage && (
        <div className="image-preview">
          <Image
            src={selectedImage}
            alt="Selected vegetables"
            width={400}
            height={300}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {identifiedVegetables.length > 0 && (
        <div className="vegetable-list">
          {identifiedVegetables.map((vegetable, index) => (
            <span key={index} className="vegetable-item">
              {vegetable}
            </span>
          ))}
        </div>
      )}

      {recipes.length > 0 && (
        <div className="recipe-grid">
          {recipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <h3 className="recipe-title">{recipe.title}</h3>
              <p className="recipe-description">{recipe.description}</p>
              <div className="recipe-section">
                <h3>Ingredients:</h3>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="recipe-section">
                <h3>Instructions:</h3>
                <p>{recipe.instructions}</p>
              </div>
              <div className="recipe-section">
                <h3>Calories:</h3>
                <p>{recipe.calories}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 