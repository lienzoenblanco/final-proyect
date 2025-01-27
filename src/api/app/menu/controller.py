from api.utils import APIException
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, or_
from datetime import datetime, timedelta
from random import randint
from api.models.index import db, Menu, MyRecipe, RecipeMenu
from flask_jwt_extended import get_jwt_identity
from logging import getLogger

logger = getLogger(__name__)

def find_menu_by_date(assignation_date):
    id_user = get_jwt_identity()['id']
    first_day_of_week = assignation_date - timedelta(days=assignation_date.weekday())
    last_day_of_week = first_day_of_week + timedelta(days=6)
    menu = Menu.query.filter(
        Menu.id_user==id_user,
        func.date(Menu.assignation_date) >= first_day_of_week.date(),
        func.date(Menu.assignation_date) <= last_day_of_week.date()).first()
    
    return menu

def get_menu(assignation_date):
    try:
        menu = find_menu_by_date(assignation_date)
        if not menu:
            return None

        menu_recipe_list = []
        recipe_menu_list = menu.recipe_menu
        for recipe_menu in recipe_menu_list:
            menu_recipe_list.append({
                "id": recipe_menu.id,
                "selected_tag": recipe_menu.selected_tag,
                "selected_date": recipe_menu.selected_date.isoformat(),
                "recipe": {
                    "id":  recipe_menu.recipe.id,
                    "title": recipe_menu.recipe.title,
                    "photo": recipe_menu.recipe.photo,
                }
            })

        return {
            **menu.serialize(),
            'menu_recipe_list': menu_recipe_list
        }
    except Exception as error:
        logger.error("Error getting menu")
        logger.exception(error)
        raise APIException(status_code=400, payload={
            'error': {
                'message': "Error getting menu",
            }
        })

def generate_recipe_menu_random(user_id,menu_id,to_tag, first_day):
    my_recipe_list = MyRecipe.query.filter(
                        MyRecipe.id_user==user_id,
                        or_(
                            MyRecipe.tag==to_tag,
                            MyRecipe.tag==3,
                        )
                    )
    
    for n in range(7):
        current_date = first_day + timedelta(days=n)
        if my_recipe_list.count() == 0:
            raise APIException(status_code=400, payload={
                'error': {
                    'message': "insufficient recipes",
                }
            })
        number_of_my_recipe = randint(0, my_recipe_list.count())
        selected_recipe = my_recipe_list[number_of_my_recipe - 1].recipe
        new_recipe_menu = RecipeMenu(
            id_menu=menu_id,
            id_recipe=selected_recipe.id,
            selected_tag=to_tag,
            selected_date=current_date,
        )
        db.session.add(new_recipe_menu)


def generate_auto_menu(body):
    previous_menu = find_menu_by_date(body['assignation_date'])
    if previous_menu:
        get_menu(body['assignation_date'])

    new_menu = Menu(
        id_user=body['id_user'],
        create_at=datetime.now(),
        assignation_date=body['assignation_date'],
    )
    db.session.add(new_menu)
    db.session.flush()
    for tag in [1, 2]:
        first_day_of_week = body['assignation_date'] - timedelta(days=body['assignation_date'].weekday())
        generate_recipe_menu_random(
            user_id=body['id_user'],
            menu_id=new_menu.id,
            to_tag=tag,
            first_day=first_day_of_week,
        )

    db.session.commit()

    return get_menu(body['assignation_date'])
    

def change_recipe_menu(id_recipe_menu, recipe_id):
    recipe_menu = RecipeMenu.query.get(id_recipe_menu)
    recipe_menu.id_recipe = recipe_id
    db.session.commit()