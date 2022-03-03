  
import os
from flask_admin import Admin
from api.models.index import User, Recipe, Comment, Favourite, Ingredient, Menu, Recipe_ingredient, Recipe_menu
from api.models.db import db
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Recipe, db.session))
    admin.add_view(ModelView(Comment, db.session))
    admin.add_view(ModelView(Favourite, db.session))
    admin.add_view(ModelView(Ingredient, db.session))
    admin.add_view(ModelView(Menu, db.session))
    admin.add_view(ModelView(Recipe_ingredient, db.session))
    admin.add_view(ModelView(Recipe_menu, db.session))
    

   

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))