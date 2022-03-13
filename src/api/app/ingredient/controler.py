from sqlalchemy.exc import IntegrityError

from api.utils import APIException
from api.models.index import db, Ingredient

from logging import getLogger

logger = getLogger(__name__)


def list_ingredient():
    ingredient_page = Ingredient.query.all()
    
    ingredient_list = [] 
    for ingredient in ingredient_page:
        ingredient_list.append(ingredient.serialize()) 

    return dict(
        items=ingredient_list, 
        total=len(ingredient_page), 
    )


def create_ingredient(body):
    try:
        if not body:
            return False
        
        ingredient_info = {
            "name": body.get('name'),
        }
        
        if ingredient_info['name'] is None:
            return False

        new_ingredient = Ingredient(**ingredient_info)
        db.session.add(new_ingredient)
        db.session.commit()
        return new_ingredient.serialize()
    except IntegrityError as err:
        logger.exception('[ERROR CREATE INGREDIENT]: INGREDIENT DUPLICATED ')
        raise APIException(status_code=401, payload={
            'error': {
                'message': 'Ya existe este ingrediente',
            }
        })
    except Exception as err:
        db.session.rollback()
        logger.exception('[ERROR CREATE INGREDIENT]: Unexepcted')
        return None


