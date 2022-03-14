from flask import Flask, request, jsonify, url_for, Blueprint
from api.app.recipe import controller
from cloudinary.uploader import upload
import cloudinary
from api.utils import APIException
from flask_jwt_extended import jwt_required

from logging import getLogger

logger = getLogger(__name__)

recipes = Blueprint('recipes', __name__)

@recipes.route('/create', methods=["POST"])
@jwt_required()
def create_recipe():
    img = request.files.get('img')
    if img:
        try:
            img = upload(img)["url"] 
        except Exception as error:
            logger.error("Error uploading img to cloudinary")
            logger.exception(error)
            raise APIException(status_code=400, payload={
                'error': {
                    'message': 'Error uploading img to cloudinary',
                }
            })

    body = request.form.to_dict()
    
    new_recipe = controller.create_recipe(body, img)
    if new_recipe is None:
        return jsonify('Internal server error'), 500
    elif new_recipe == False:
        return jsonify('Bad Request'), 400
    else:
        return jsonify(new_recipe), 201


# get for private recipes needs token
@recipes.route('/get/<id>', methods = ['GET'])
@jwt_required()
def get_my_recipe(id):
       
    recipe = controller.get_recipe(id)

    try:
        return jsonify(recipe.serialize())

    except AttributeError as error:
        logger.error("Error getting recipe")
        raise APIException(status_code=400, payload={
            'error': {
                'message': "Error getting recipe",
            }
        })
   
# get for public recipes without token   
@recipes.route('/get/public/<id>', methods = ['GET'])
def get_public_recipe(id):
           
    recipe = controller.get_recipe(id)

    try:
        return jsonify(recipe.serialize())

    except AttributeError as error:
        logger.error("Error getting recipe")
        raise APIException(status_code=400, payload={
            'error': {
                'message': "Error getting recipe",
            }
        })
   

@recipes.route('/update/<id>', methods = ['PUT'])
@jwt_required()
def update_recipe(id):
    body = request.get_json()

    return jsonify(controller.update_recipe(id, body))


@recipes.route('/', methods=['GET'])
def get_recipe_list():
    page = int(request.args.get('page', 1))
    search = request.args.get('search')
    recipe_list =  controller.get_recipe_list(page=page, search=search)

    return jsonify(recipe_list), 200