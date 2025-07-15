from flask import Blueprint, render_template, request, redirect, url_for

register = Blueprint('register', __name__)

@register.route('/register', methods=['GET', 'POST'])
def register_user():
    return render_template('register.html')