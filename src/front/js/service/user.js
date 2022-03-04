import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { BaseUrl } from "./base.js";

export const loginUser = (email, password) => {
  return fetch(BaseUrl + "/user/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const registerService = (userInfo) => {
  return fetch(
    BaseUrl + "/user/register",
    {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
