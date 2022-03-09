import React, { useState } from "react";

import "../subirRecetas/subirRecetas.css";

export const SubirRecetas = () => {
  const [ingredientList, setIngredientList] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [title, setTitle] = useState("");
  const [preparation, setPreparation] = useState("");
  const [tag, setTag] = useState("");
  const [img, setImg] = useState();

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

  const handleChangePreparation = (event) => {
    setPreparation(event.target.value);
  };

  const submit = () => {
    console.log("title", title);
    console.log("preparation", preparation);
    console.log("tag", tag);
    console.log("img", img);
  };

  return (
    <div className="container">
      <div className="row justify-content-evenly">
        <div className="col-4">
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
        <div className="col-4">
          <div className="input-group mb-3">
            <input
              onChange={handleChangeTitle}
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Título de la receta"
            />
          </div>
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={handleChangeTag}
          >
            <option value="null">¿Es una comida, una cena o ambas?</option>
            <option value="1">Comida</option>
            <option value="2">Cena</option>
            <option value="3">Ambas</option>
          </select>
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
                    href=""
                    onClick={(event) => {
                      remove(event, index);
                    }}
                  >
                    🗑
                  </a>
                </li>
              );
            })}
          </ul>
        </form>
        <div className="form-floating">
          <p>Preparación:</p>
          <textarea
            onChange={handleChangePreparation}
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
