import React from "react";
import { Link } from "react-router-dom";

import "../myRecipes/myRecipes.css";

export const MyRecipes = () => {
  return (
    <div>
      <p>Estás en mis recetas</p>
      <Link to="/recipes/create">
        <button className="btn btn-outline-primary btn-new-recipe">
          Crear receta
        </button>
      </Link>
    </div>
  );
};
