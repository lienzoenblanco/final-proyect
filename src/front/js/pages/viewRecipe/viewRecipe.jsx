import React, { useState, useContext, useEffect } from "react";
import { flushSync } from "react-dom";
import { useParams } from "react-router-dom";
import {
  getRecipe,
  deleteRecipe,
  getTag,
  updateTag,
} from "../../service/recipe";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Context } from "../../store/appContext";

import "../viewRecipe/viewRecipe.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export const ViewRecipe = () => {
  const { actions } = useContext(Context);
  const { recipe_id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [tag, setTag] = useState();
  const [ingredientList, setIngredientList] = useState([]);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getTag(recipe_id)
      .then((response) => response.json())
      .then((data) => {
        setTag(data.tag);
      })
      .catch((error) => {
        console.log(error);
      });

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
      return "";
    } else {
      return "disabled";
    }
  };

  const handleChangeTag = (event) => {
    setTag(event.target.value);
    updateTag(recipe_id, tag)
      .then((resp) => resp.json())
      .then((data) => {
        if (data["msg"]) {
          alert("error", data["msg"]);
        } else {
          actions.showSuccessMessage("Tu receta ha sido actualizada");
          history.push("/my-recipes");
        }
      })
      .catch((err) => console.log(err));
  };
  const editRecipe = () => {
    if (recipe.is_owner == true) {
      history.push(`/recipes/update/${recipe.id}`);
    } else {
      setShowModal(true);
    }
  };

  const onDeleteRecipe = () => {
    deleteRecipe(recipe.id);
    history.push("/my-recipes");
  };

  const tag_option = () => {
    if (tag == 1) {
      return "Comida";
    } else if (tag == 2) {
      return "Cena";
    } else if (tag == 3) {
      return "Ambas";
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

      <div>
        <p>Etiquetado como: {tag_option()} </p>
      </div>

      <div className="extraButtons">
        <button
          type="button"
          className="btn btn-success btnUpdate"
          onClick={editRecipe}          
          {...isDisable()}
        >
          Editar
        </button>

        <button
          type="button"
          className="btn btn-success btnDelete"
          onClick={onDeleteRecipe}
          {...isDisable()}
        >
          Borrar
        </button>
      </div>
      <div
        className="modal update"
        tabIndex="-1"
        role="dialog"
        data-show={showModal}
      >
        <Modal show={showModal}>
          <Modal.Body>
            <label className="form-label">
              ¿Es una comida, una cena o ambas?
            </label>
            <select className="form-select" aria-label="Default select example">
              <option value="0">---</option>
              <option value="1">Comida</option>
              <option value="2">Cena</option>
              <option value="3">Ambas</option>
            </select>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleChangeTag}
            >
              Cambiar
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
