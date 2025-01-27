import json
import math
from flask_jwt_extended import get_jwt_identity

from sqlalchemy.exc import IntegrityError,InvalidRequestError

from api.utils import APIException

from api.models.index import db, Recipe, User, RecipeIngredient, Ingredient, MyRecipe


from logging import getLogger

logger = getLogger(__name__)

def create_recipe(body, url_img=None):

    if not body:
        raise APIException(status_code=400, payload={
            'error': {
                'message': 'missing body',
            }
        })
    recipe_info = {
        "photo":url_img,
        "title":body.get('title'),
        "description": body.get('description'),
        "private": (body.get('private')=="true"),
        "id_user": body.get('id_user'), 
               
    }

    if recipe_info['title'] is None:
        logger.error("missing title")
        raise APIException(status_code=400, payload={
            'error': {
                'message': 'missing title',
            }
        })

    if recipe_info['description'] is None:
        logger.error("missing description")
        raise APIException(status_code=400, payload={
            'error': {
                'message': 'missing description',
            }
        })

    try:
        new_recipe = Recipe(**recipe_info)
        db.session.add(new_recipe)
        db.session.flush()
        ingredient_list = []
        ingredient_list_raw = json.loads(body.get('ingredient_list')) if body.get('ingredient_list') else []
        for ingredient_raw in ingredient_list_raw:
            db.session.add(RecipeIngredient(id_ingredient=int(ingredient_raw['id']), id_recipe=new_recipe.id))

        db.session.commit()
        return new_recipe.serialize()
    except Exception as error:
        print("Error creating recipe:", error)
        db.session.rollback()
        return None

def save_in_my_recipe(body,recipe_id):
    my_recipe_info={
        "id_recipe":recipe_id,
        "id_user": body.get('id_user'), 
        "tag" :body.get('tag')
    }

    if my_recipe_info['tag'] is None:
        logger.error("missing tag")
        raise APIException(status_code=400, payload={
            'error': {
                'message': 'missing tag',
            }
        })    
    if my_recipe_info['id_user'] is None:
        logger.error("missing id_user")
        raise APIException(status_code=400, payload={
            'error': {
                'message': 'missing id_user',
            }
        })    
   
    try:
        my_new_recipe = MyRecipe(**my_recipe_info)
        db.session.add(my_new_recipe)
        db.session.commit()

    except Exception as error:
        print("Error saving recipe:", error)
        db.session.rollback()
        return None


def get_myRecipe(id_recipe, user_id):
    try:
        my_recipe = MyRecipe.query.filter(MyRecipe.id_user == user_id,
                                          MyRecipe.id_recipe == id_recipe).first()
        if not my_recipe:
            return None 
        return my_recipe.serialize()

    except Exception as error:
        logger.error("Error getting recipe")
        logger.exception(error)
        raise APIException(status_code=400, payload={
            'error': {
                'message': "Error getting tag",
            }
        })

def get_recipe(recipe_id, user_id=None):
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return None 
        
        ingredient_list = []
        recipe_ingredient_list = recipe.recipe_ingredients
        for recipe_ingredient in recipe_ingredient_list:
            ingredient_list.append(recipe_ingredient.ingredient.serialize())

        is_owner = False
        if user_id is not None and user_id == recipe.id_user:
            is_owner = True

        if recipe.private == True and is_owner == False:
            raise APIException(status_code= 403, payload={
                'error':{
                    'message': "This recipe is private, and belongs to another user"
                }
            })

        # Get myrecipe for this user and this recipe to read the tag
        my_rec = MyRecipe.query.filter_by(id_recipe=recipe_id,
                                          id_user=user_id).first()

        # If this is a public recipe and user_id is None, my_rec will be None too
        tag = my_rec and my_rec.tag

        return {
            **recipe.serialize(),
            'ingredient_list': ingredient_list,
            'is_owner': is_owner,
            'is_saved': bool(my_rec),
            'tag': tag
        }
    except APIException as e:
        # If an APIException was raised above, let it pass so the message gets
        # to the frontend
        raise
    except Exception as error:
        logger.error("Error getting recipe")
        logger.exception(error)
        raise APIException(status_code=400, payload={
            'error': {
                'message': "Error getting recipe",
            }
        })



def get_recipe_list(page=1, per_page=20, search=None):

    if not search :
        recipe_page = Recipe.query.filter(Recipe.private==False).paginate(page,per_page)
          
    else:
        recipe_page = Recipe.query.filter(Recipe.private==False).filter(Recipe.title.ilike(f'%{search}%')).paginate(page,per_page)
       

    recipe_list = [] 
    for recipe in recipe_page.items:
        recipe_list.append(recipe.serialize()) 

    return dict(
        items=recipe_list, 
        total_items=recipe_page.total, 
        current_page=recipe_page.page,
        total_pages =math.ceil(recipe_page.total/per_page)
    )

#get list recipies from my_recipe    
def get_myrecipe_list(user_id):
    
        my_recipe_list = MyRecipe.query.filter(MyRecipe.id_user==user_id)
       
        serialized_my_recipe_list = [] 
        for my_recipe in my_recipe_list:
            serialized_my_recipe_list.append(my_recipe.serialize()) 

        return serialized_my_recipe_list



def update_recipe(recipe_id, recipe_params):
    """
    Updates an existing recipe with new data

    :param recipe_id: id of the recipe to update
    :param recipe_params: a dict with the fields to update in the existing recipe
    """
    try:
        # Parse recipe params
        try:
            recipe_params['private'] = recipe_params['private'] == "true"
        except KeyError:
            pass
        # Update the ingredients list
        recipe_ingredients = json.loads(recipe_params["ingredient_list"])
        # Delete all existing ingredients
        recipe = Recipe.query.filter_by(id=recipe_id).first()
        RecipeIngredient.query.filter(RecipeIngredient.id_recipe == recipe.id).delete()
        for rec_ing in recipe_ingredients:
            ri = RecipeIngredient(id_recipe=recipe.id, id_ingredient=rec_ing["id"])
            db.session.add(ri)

        # Remove recipe_ingredients because these are relations from ingredients to recipe
        to_remove = ["ingredient_list", "is_owner", "is_saved","tag"]
        for param in to_remove:
            try:
                del(recipe_params[param])
            except KeyError:
                pass
        num_rows_updated = Recipe.query.filter_by(id=recipe_id).update(recipe_params)


        db.session.commit()
        return  Recipe.query.get(recipe_id)

    except InvalidRequestError as error:
        db.session.rollback()
        logger.error(error)
        invalid_key = str(error).split(' ')[-1]
        raise APIException(status_code=400, payload={
            'error': {
                'message': f"Error, invalid key {invalid_key}",
            }
        })

    except Exception as error:
        logger.error("Error updating recipe")
        logger.exception(error)
        raise APIException(status_code=400, payload={
            'error': {
                'message': "Error updating recipe",
            }
        })


    
  
