import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRecipe } from "../../service/recipe";

import "../viewRecipe/viewRecipe.css";

export const ViewRecipe = () => {
  const { recipe_id } = useParams();
  const [recipe, setRecipe] = useState([]);
  useEffect(() => {
    getRecipe(recipe_id)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <h3 className="display-5">{recipe.title}</h3>
      <div className="row">
        <div className="col"></div>
        <div className="col">
          <img src={recipe.photo} className="img-fluid" alt="..." />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <p className="text-break">{recipe.description}</p>
        </div>
      </div>
    </div>
  );
};
