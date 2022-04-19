import { BaseUrl } from "./base.js";

export const getMenu = (assignation_date) => {
  return fetch(`${BaseUrl}/menu/${assignation_date}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const autoMenu = (assignation_date) => {
  return fetch(`${BaseUrl}/menu/auto`, {
    method: "POST",
    body: JSON.stringify({
      assignation_date: assignation_date,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const replaceRecipeMenu = (id_recipe_menu, new_id_recipe) => {
  return fetch(`${BaseUrl}/menu/recipe_menu/${id_recipe_menu}`, {
    method: "PUT",
    body: JSON.stringify({
      id_recipe: new_id_recipe,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
