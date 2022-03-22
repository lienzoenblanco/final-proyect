import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";

import "../navbar/navbar.css";

export const Navbar = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      actions.changeLogged(true);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    actions.changeLogged(false);
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container-logo">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">
            <img
              className="logo"
              src="https://res.cloudinary.com/dw4npwftd/image/upload/w_700,h_700,c_fill/v1645953196/logo2_s3josi.png"
            />
          </span>
        </Link>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        {!store.isLogged ? (
          <ul className="navbar-nav">
            <Link to="/register">
              <li className="nav-item">Registro</li>
            </Link>
            <Link to="/login">
              <li className="nav-item">Login</li>
            </Link>
          </ul>
        ) : (
          <ul className="navbar-nav">
            <Link to="/recipes/">
              <li className="nav-item">Recetas</li>
            </Link>
            <Link to="/my-recipes">
              <li className="nav-item">Mis recetas</li>
            </Link>
            <Link to="/my-menus">
              <li className="nav-item">Mis menús</li>
            </Link>
            <Link to="/">
              <li className="nav-item" onClick={logout}>
                Salir
              </li>
            </Link>
          </ul>
        )}
      </div>
    </nav>

    // <nav className="navbar navbar-light">
    //   <div className="container-logo">
    //     <Link to="/">
    //       <span className="navbar-brand mb-0 h1">
    //         <img
    //           className="logo"
    //           src="https://res.cloudinary.com/dw4npwftd/image/upload/w_700,h_700,c_fill/v1645953196/logo2_s3josi.png"
    //         />
    //       </span>
    //     </Link>
    //   </div>
    //   {!store.isLogged ? (
    //     <div className="container-buttons">
    //       <Link to="/register">
    //         <button className="btn btn-primary">Registro</button>
    //       </Link>
    //       <Link to="/login">
    //         <button className="btn btn-primary">Login</button>
    //       </Link>
    //     </div>
    //   ) : (
    //     <div className="container-buttons menu">
    //       <Link to="/recipes/">
    //         <button className="btn btn-primary">Recetas</button>
    //       </Link>
    //       <Link to="/my-recipes">
    //         <button className="btn btn-primary">Mis recetas</button>
    //       </Link>
    //       <Link to="/my-menus">
    //         <button className="btn btn-primary">Mis menús</button>
    //       </Link>
    //       <Link to="/">
    //         <button className="btn btn-primary" onClick={logout}>
    //           Salir
    //         </button>
    //       </Link>
    //     </div>
    //   )}
    // </nav>
  );
};
