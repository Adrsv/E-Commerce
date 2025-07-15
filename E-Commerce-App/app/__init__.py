from flask import Flask
from .home import home_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(home_bp, url_prefix='/home')

    return app