import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";

import { getMenu, autoMenu } from "../../service/menu";

import "../myMenus/myMenus.css";

export const MyMenus = () => {
  const { store, actions } = useContext(Context);
  const [menu, setMenu] = useState({});
  const [menuNotFound, setMenuNotFound] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    getMenu(currentDate.toISOString())
      .then((response) => response.json())
      .then((data) => {
        if (data == "menu not found") {
          setLoading(false);
          setMenuNotFound(true);
        } else {
          setMenu(data);
        }
        setMenu();
      });
  }, []);

  const newMenu = () => {
    setLoading(true);
    autoMenu(currentDate.toISOString())
      .then((response) => response.json())
      .then((data) => {
        setMenu(data);
      });
    setLoading(false);
  };

  return (
    <div className="container">
      {menuNotFound ? (
        <section className="new-menu">
          <button className="btn btn-primary" onClick={newMenu}>
            Generar menú
          </button>
          <div className="alert alert-light" role="alert">
            No tienes menú para esta semana. Clicka en Generar menú para
            crearlo.
          </div>
        </section>
      ) : (
        <div className="table-responsive-lg">
          <table className="table">
            <thead>
              <tr>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sábado</th>
                <th>Domingo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>Jacob</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>@fat</td>
                <td>@fat</td>
                <td>@fat</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
