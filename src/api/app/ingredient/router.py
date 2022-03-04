from flask import Flask, request, jsonify, url_for, Blueprint
from api.app.ingredient.controler import create_ingredient, list_ingredient


ingredients = Blueprint('ingredients', __name__)

@ingredients.route('/create', methods=['POST'])
def add_ingredient():
    body = request.get_json()

    new_ingredient = create_ingredient(body)
    if new_ingredient is None:
        return jsonify('Internal server error'), 500
    elif new_ingredient == False:
        return jsonify('Bad Request'), 400
    else:
        return jsonify(new_ingredient), 201

@ingredients.route('/', methods=['GET'])
def get_ingredient_list():
    page = int(request.args.get('page', 1))
    search = request.args.get('search')
    ingredient_list = list_ingredient(page=page, search=search)

    return jsonify(ingredient_list), 200