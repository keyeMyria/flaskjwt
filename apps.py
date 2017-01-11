from flask import Flask, render_template, jsonify, session, g
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp
from flask_login import login_user, LoginManager, logout_user, login_required, logout_user
from flask_sqlalchemy import SQLAlchemy
from passlib.apps import custom_app_context as pwd_context

import os
app = Flask(__name__)
app.debug = True

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////%s/mani.db' % (os.getcwd())
app.config['SECRET_KEY'] = 'super-secret'
db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(128))

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)


login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    g.user = User.query.get(int(user_id))
    return User.query.get(int(user_id))


def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if not user or not user.verify_password(password):
        session['logged_in'] = False
        return False
    session['logged_in'] = True
    g.user = user
    return user


def identity(payload):
    user_id = payload['identity']
    return User.query.filter_by(id=user_id).first()

jwt = JWT(app, authenticate, identity)


@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity


@app.route('/diabetic_retinopathy/predictions', methods=['POST'])
@jwt_required()
def diabetic_retinopathy():
    return jsonify({'manikandan': "nbmnbmbmn"})


@app.route('/api/logout')
def logout():
    del session['logged_in']
    return jsonify({'result': 'success'})


@app.route('/api/status')
def status():
    if session.get('logged_in'):
        if session['logged_in']:
            return jsonify({'status': True})
    else:
        return jsonify({'status': False})


@app.route('/')
def home():
    return app.send_static_file('index.html')


def new_user():
    user = User(username='mani')
    user.hash_password('mani')
    db.session.add(user)
    db.session.commit()


if __name__ == '__main__':
    app.run(port=5001)

    '''
    
    curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"username": "mani", "password": "mani"}' http://localhost:5000/auth
    
    
    curl -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6MSwiaWF0IjoxNDgzODcwNjMwLCJuYmYiOjE0ODM4NzA2MzAsImV4cCI6MTQ4Mzg3MDkzMH0.5c87xRTfcaFTzZ35i62s5uj24qng5S-6VkxTnHFOHcI" http://localhost:5000/protected
    
    curl -X POST -i -H "Content-Type: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6MSwiaWF0IjoxNDg0MTE5NjI1LCJuYmYiOjE0ODQxMTk2MjUsImV4cCI6MTQ4NDExOTkyNX" http://localhost:5001/diabetic_retinopathy/predictions


    
    '''
