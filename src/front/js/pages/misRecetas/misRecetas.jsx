import React from "react";

import "../misRecetas/misRecetas.css";

export const MisRecetas = () => {
  return (
    <div>
      <p>Estás en mis recetas</p>
      <Link to="/recipes/create">
        <button className="btn btn-outline-primary btn-register">
          Crear receta
        </button>
      </Link>
    </div>
  );
};
