import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";
import { get_myrecipe, listRecipe } from "../../service/recipe";
import Card from "../../component/Card/card.jsx";
import Spinner from "../../component/Spinner/spinner.jsx";

import "../myRecipes/myRecipes.css";

export const MyRecipes = () => {
  const { store, actions } = useContext(Context);
  const [recipeList, setRecipeList] = useState([]);

  const [loading, setLoading] = useState(false);

  const recipes = async () => {
    try {
      setLoading(true);
      const res = await listRecipe();
      const data = await res.json();
      setRecipeList(data.items);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recipes();
  }, []);

  return (
    <div className="container">
      {store.successMessage && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {store.successMessage}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => actions.cleanSuccessMessage()}
          ></button>
        </div>
      )}

      <section className="up">
        <Link to="/recipes/create">
          <button className="btn btn-primary">Crear receta</button>
        </Link>
        <div className="search col-md-3">
          <div className="input-group mb-3">
            {" "}
            <input
              type="text"
              className="form-control input-text"
              placeholder="Buscar receta..."
            />
            <div className="input-group-append">
              {" "}
              <button className="btn btn-success" type="button">
                <i className="fa fa-search"></i>
              </button>{" "}
            </div>
          </div>
        </div>
      </section>
      <div className="row cards">
        {loading ? (
          <Spinner />
        ) : (
          recipeList.map((recipe) => (
            <Card
              key={recipe.id}
              title={recipe.recipe.title}
              img={recipe.recipe.photo}
              id = {recipe.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
