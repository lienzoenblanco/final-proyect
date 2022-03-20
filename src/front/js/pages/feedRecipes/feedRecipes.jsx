import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";
import { feedListRecipe } from "../../service/recipe";
import Card from "../../component/Card/card.jsx";
import Spinner from "../../component/Spinner/spinner.jsx";


import "../feedRecipes/feedRecipes.css";

export const FeedRecipes = () => {
  const { store, actions } = useContext(Context);
  const [recipeList, setRecipeList] = useState([]);
  const [currentPage, setCurrentPage] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
 
 
  const [loading, setLoading] = useState(false);

  const recipes = async (search=null) => {
    try {
      setLoading(true);
      const res = await feedListRecipe(search);
      const data = await res.json();
      setRecipeList(data.items);
      setCurrentPage(data.current_page)
      setTotalPages(data.total)
      recalcularPag()
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recipes();  
     }, []);

  useEffect(() => {
    
    }, [totalPages,currentPage]);

  console.log(recipeList,"recipeList");
  // console.log(copyRecipeList,"copyrecipeList");

  const handleChange = async(e) => { 
    recipes(e.target.value)  
  }
 
       
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
           
      <div className="search col-md-3">
        <form className="d-flex mb-3" onChange={handleChange}>           
          <input
            aria-label="Search"              
            type="search"
            className="form-control me-2"
            placeholder="Buscar receta..."
          />                         
        </form>        
      </div> 

      <div className="row cards">
        {loading ? (
          <Spinner />
        ) : (
          recipeList.map((recipe) => (
            <Card
              key={recipe.id}
              title={recipe.title}
              img={recipe.photo}
              id = {recipe.id}
            />
          ))
        )}
      </div>

      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li className="page-item"><a className="page-link" href="#"></a></li>
          
       
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
