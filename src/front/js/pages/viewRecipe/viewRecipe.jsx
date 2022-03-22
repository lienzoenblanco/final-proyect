import React, { useState, useContext, useEffect } from "react";
import { flushSync } from "react-dom";
import { useParams } from "react-router-dom";
import { getRecipe, deleteRecipe } from "../../service/recipe";

import "../viewRecipe/viewRecipe.css";

export const ViewRecipe = () => {
  const { recipe_id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [ingredientList, setIngredientList] = useState([]);

  useEffect(() => {
    getRecipe(recipe_id)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
        setIngredientList(data.ingredient_list);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const token = localStorage.getItem("token");
  // console.log(token);
  const isDisable = () => {
    if (token) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="container">
      <h3 className="display-6">{recipe.title}</h3>
      <div className="row">
        <div className="col">
          <label className="form-label">Ingredientes</label>
          <ul className="list-group list-group-flush">
            {ingredientList.map((ingredient) => {
              return (
                <li className="list-group-item" key={ingredient.id}>
                  {ingredient.name}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col">
          <img src={recipe.photo} className="img-fluid" alt="..." />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <label className="form-label">Descripción</label>
          <p className="text-break">{recipe.description}</p>
        </div>
      </div>

      <div className="extraButtons">
        <button
          type="button"
          className="btn btn-success btnUpdate"
          {...isDisable()}
        >
          Actualizar
        </button>
        <button
          type="button"
          className="btn btn-success btnDelete"
          onClick={deleteRecipe(recipe_id)}
          {...isDisable()}
        >
          Borrar
        </button>
      </div>
    </div>
  );
};
