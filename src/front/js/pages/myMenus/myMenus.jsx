import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

import { getMenu, autoMenu, replaceRecipeMenu } from "../../service/menu";
import { listRecipe } from "../../service/recipe";

import "../myMenus/myMenus.css";

export const MyMenus = () => {
  const [menu, setMenu] = useState({});
  const [menuNotFound, setMenuNotFound] = useState(false);

  const [updateMenu, setUpdateMenu] = useState(false);

  const [lunchRecipeList, setLunchRecipeList] = useState([]);
  const [dinnerRecipeList, setDinnerRecipeList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [week, setWeek] = useState([]);

  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    loadMenu();
  }, [currentDate]);

  useEffect(() => {
    if (!updateMenu) {
      loadMenu();
    }
  }, [updateMenu]);

  const loadMenu = () => {
    setLoading(true);
    setWeek(calculateWeek(currentDate));
    getMenu(currentDate.toISOString())
      .then((response) => response.json())
      .then((data) => {
        if (data == "menu not found") {
          setLoading(false);
          setMenuNotFound(true);
        } else {
          setLoading(false);
          setMenuNotFound(false);
          setMenu(data);
        }
      });
  };

  const newMenu = () => {
    setLoading(true);
    autoMenu(currentDate.toISOString())
      .then((response) => response.json())
      .then((data) => {
        if (data.error?.message == "insufficient recipes") {
          setWarningMessage("No tienes recetas suficientes para crear un menú");
        } else {
          setMenu(data);
          setMenuNotFound(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
  };

  const getRecipeList = () => {
    listRecipe()
      .then((response) => response.json())
      .then((my_recipes) => {
        setLunchRecipeList(
          my_recipes
            .filter((my_recipe) => {
              return my_recipe.tag == 1 || my_recipe.tag == 3;
            })
            .map((my_recipe) => {
              return {
                value: my_recipe.recipe.id,
                label: my_recipe.recipe.title,
              };
            })
        );
        setDinnerRecipeList(
          my_recipes
            .filter((my_recipe) => {
              return my_recipe.tag == 2 || my_recipe.tag == 3;
            })
            .map((my_recipe) => {
              return {
                value: my_recipe.recipe.id,
                label: my_recipe.recipe.title,
              };
            })
        );
      });
  };

  const capitalize = (word) => {
    const lower = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lower.slice(1);
  };

  const getMonday = (date) => {
    date = new Date(date);
    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const calculateWeek = (date) => {
    const monday = getMonday(date);
    let week = [monday];
    for (let index = 1; index < 7; index++) {
      week.push(
        new Date(
          monday.getFullYear(),
          monday.getMonth(),
          monday.getDate() + index
        )
      );
    }
    return week;
  };

  const previousWeek = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7
      )
    );
  };

  const nextWeek = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 7
      )
    );
  };

  const changeMenu = () => {
    setUpdateMenu(!updateMenu);
    getRecipeList();
  };

  const handleChangeMenu = (new_recipe, menu_recipe_id) => {
    replaceRecipeMenu(menu_recipe_id, new_recipe.value)
      .then((response) => response.json())
      .then((data) => {
        let menu_recipe_list = menu.menu_recipe_list.map((menu_recipe) => {
          if (menu_recipe.id == menu_recipe_id) {
            menu_recipe.recipe.id = new_recipe.value;
            menu_recipe.recipe.title = new_recipe.label;
          }
          return menu_recipe;
        });
        setMenu({ ...menu, menu_recipe_list: menu_recipe_list });
      });
  };

  const getLunchList = () => {
    let lunchList = [];
    if ("menu_recipe_list" in menu) {
      lunchList = menu.menu_recipe_list.filter((menu_recipe) => {
        return menu_recipe.selected_tag == 1;
      });
    }
    return lunchList;
  };

  const getDinnerList = () => {
    let dinnerList = [];
    if ("menu_recipe_list" in menu) {
      dinnerList = menu.menu_recipe_list.filter((menu_recipe) => {
        return menu_recipe.selected_tag == 2;
      });
    }
    return dinnerList;
  };

  return (
    <div className="container">
      {warningMessage && (
        <div className="alert alert-warning" role="alert">
          No tienes recetas suficientes para crear un menú.
        </div>
      )}
      <section className="move-weeks row">
        <span className="col-1" onClick={previousWeek}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
        </span>
        <span className="col-1" onClick={nextWeek}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
            />
          </svg>
        </span>

        <span className="month col-6">
          {capitalize(
            currentDate.toLocaleDateString("es-es", {
              month: "long",
              year: "numeric",
            })
          )}
        </span>
        <span className="col">
          {!menuNotFound && (
            <button className="btn btn-primary" onClick={changeMenu}>
              {!updateMenu ? "Modificar menú" : "Guardar cambios"}
            </button>
          )}
        </span>
      </section>
      {menuNotFound ? (
        <section className="new-menu">
          <button className="btn btn-primary" onClick={newMenu}>
            Generar menú
          </button>
          <div className="alert alert-light" role="alert">
            No tienes menú asignado para esta semana. Clicka en Generar menú
            para crearlo.
          </div>
        </section>
      ) : (
        <div>
          <div className="table-responsive-lg">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  {week.map((day, i) => {
                    return (
                      <th key={i}>
                        {capitalize(
                          day.toLocaleDateString("es-es", {
                            weekday: "long",
                            day: "numeric",
                          })
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Comida</th>
                  {getLunchList().map((menu_recipe) => {
                    return (
                      <td key={menu_recipe.id}>
                        {!updateMenu ? (
                          <Link
                            to={`/recipes/${menu_recipe.recipe.id}`}
                            className="link d-flex flex-column"
                          >
                            {menu_recipe.recipe.title}
                            {menu_recipe.recipe.photo && (
                              <img
                                src={menu_recipe.recipe.photo}
                                className="image-menu "
                                width="170"
                                height="100"
                              />
                            )}
                          </Link>
                        ) : (
                          <Select
                            className="basic-single"
                            options={lunchRecipeList}
                            onChange={(new_id_recipe) => {
                              handleChangeMenu(new_id_recipe, menu_recipe.id);
                            }}
                            value={{
                              label: menu_recipe.recipe.title,
                              value: menu_recipe.recipe.id,
                            }}
                            isSearchable={true}
                            isClearable={false}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <th>Cena</th>
                  {getDinnerList().map((menu_recipe) => {
                    return (
                      <td key={menu_recipe.id}>
                        {!updateMenu ? (
                          <Link
                            to={`/recipes/${menu_recipe.recipe.id}`}
                            className="link d-flex flex-column"
                          >
                            {menu_recipe.recipe.title}
                            {menu_recipe.recipe.photo && (
                              <img
                                src={menu_recipe.recipe.photo}
                                className="image-menu"
                                width="170"
                                height="100"
                              />
                            )}
                          </Link>
                        ) : (
                          <Select
                            className="basic-single"
                            options={dinnerRecipeList}
                            onChange={(new_id_recipe) => {
                              handleChangeMenu(new_id_recipe, menu_recipe.id);
                            }}
                            value={{
                              label: menu_recipe.recipe.title,
                              value: menu_recipe.recipe.id,
                            }}
                            isSearchable={true}
                            isClearable={false}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
