import { BaseUrl } from "./base.js";

export const createRecipe = (payload) => {
  const formData = new FormData();

  for (const key in payload) {
    formData.append(key, payload[key]);
  }

  return fetch(`${BaseUrl}/recipe/create`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
