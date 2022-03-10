import React, { useState } from "react";
import { createRecipe } from "../../service/recipe";

import "../subirRecetas/subirRecetas.css";

export const SubirRecetas = () => {
  const [ingredientList, setIngredientList] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [img, setImg] = useState();
  const [isPrivate, setIsPrivate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = () => {
    if (title.length == 0) {
      setErrorMessage("Falta el título");
      return false;
    }
    if (tag == 0) {
      setErrorMessage("Tienes que indicar si es comida o cena");
      return false;
    }
    if (img == undefined) {
      setErrorMessage("Falta la imagen");
      return false;
    }
    if (description.length == 0) {
      setErrorMessage("Falta la descripción");
      return false;
    }
    return true;
  };

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleChangeTag = (event) => {
    setTag(event.target.value);
  };

  const handleChangeImg = (e) => {
    if (e.target.files) {
      console.log(e.target.files);
      setImg(e.target.files[0]);

      // const reader = new FileReader();
      // reader.onload = (e) => {
      // 	if (reader.readyState === 2) {
      // 		setFileUrl(reader.result);
      // 	}
      // };
      // reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleChangeIsPrivate = (event) => {
    setIsPrivate(event.target.checked);
  };

  const handleChangeIngredient = (event) => {
    setIngredient(event.target.value);
  };

  const addNewIngredient = (event) => {
    event.preventDefault();
    if (ingredient.trim().length !== 0) {
      setIngredientList([...ingredientList, ingredient]);
    }
    setIngredient("");
  };

  const remove = (event, position) => {
    event.preventDefault();
    setIngredientList(
      ingredientList.filter((item, i) => {
        return i != position;
      })
    );
  };

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const submit = () => {
    if (!isFormValid()) {
      return;
    }
    const payload = {
      title: title,
      description: description,
      tag: tag,
      img: img,
      private: isPrivate,
      // TODO: no enviar el id_user lo tiene que sacar del jwt el backend
      id_user: 1,
    };
    console.log(payload);
    createRecipe(payload)
      .then((resp) => resp.json())
      .then((data) => {
        alert("WIP:Receta creada");
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <h3>Crear nueva receta</h3>
      <div className="row input-group mb-3">
        <input
          onChange={handleChangeTitle}
          type="text"
          className="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          placeholder="Título de la receta"
        />
      </div>
      <div className="row input-group mb-3">
        <select
          className="form-select"
          aria-label="Default select example"
          onChange={handleChangeTag}
        >
          <option value="0">¿Es una comida, una cena o ambas?</option>
          <option value="1">Comida</option>
          <option value="2">Cena</option>
          <option value="3">Ambas</option>
        </select>
        <div className="form-check">
          <input
            onChange={handleChangeIsPrivate}
            className="form-check-input"
            type="checkbox"
            value={isPrivate}
            id="flexCheckDefault"
          />
          <label className="form-check-label" for="flexCheckDefault">
            Esta receta es privada
          </label>
        </div>
      </div>
      <div className="row">
        <div className="input-group mb-3">
          <input
            onChange={handleChangeImg}
            id="input-b1"
            name="input-b1"
            type="file"
            className="file"
            data-browse-on-zone-click="true"
          />
        </div>
      </div>
      <div className="row">
        <form onSubmit={addNewIngredient} onChange={handleChangeIngredient}>
          <p>Ingredientes:</p>
          <input
            type="text"
            value={ingredient}
            className="form-control ingredients"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
          />
          <ul>
            {ingredientList.map((ingredientPrint, index) => {
              return (
                <li key={index}>
                  {ingredientPrint}
                  <a
                    className="icon"
                    href=""
                    onClick={(event) => {
                      remove(event, index);
                    }}
                  >
                    X
                  </a>
                </li>
              );
            })}
          </ul>
        </form>
      </div>

      <div className="row">
        <div className="form-floating">
          <p>Descripción:</p>
          <textarea
            onChange={handleChangeDescription}
            className="form-control"
            placeholder="Leave a comment here"
            id="floatingTextarea"
          ></textarea>
        </div>
        <button type="button" className="btn btn-primary" onClick={submit}>
          Crear receta
        </button>
      </div>
    </div>
  );
};
