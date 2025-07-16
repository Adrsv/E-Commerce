from flask import Flask
from app.home import home_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(home_bp, url_prefix='/home')

    return app