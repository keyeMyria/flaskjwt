from flask import Flask,render_template,jsonify,session
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp

class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

users = [
    User(1, 'mani', 'mani'),
    User(2, 'user2', 'abcxyz'),
]

username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}

def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        session['logged_in'] = True
        return user

def identity(payload):
    user_id = payload['identity']
    return userid_table.get(user_id, None)

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'super-secret'

jwt = JWT(app, authenticate, identity)

@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity



@app.route('/diabetic_retinopathy/predictions',methods=['POST'])
@jwt_required()
def diabetic_retinopathy():
    return jsonify({'manikandan':"nbmnbmbmn"});



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
    # import ipdb;ipdb.set_trace()
    return app.send_static_file('index.html')
    # return render_template('index.html',**locals())










if __name__ == '__main__':
    app.run(port=5001)
    
    
    
    
    
    
    
    
    '''
    
    curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"username": "mani", "password": "mani"}' http://localhost:5000/auth
    
    
    curl -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6MSwiaWF0IjoxNDgzODcwNjMwLCJuYmYiOjE0ODM4NzA2MzAsImV4cCI6MTQ4Mzg3MDkzMH0.5c87xRTfcaFTzZ35i62s5uj24qng5S-6VkxTnHFOHcI" http://localhost:5000/protected
    
    curl -X POST -i -H "Content-Type: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6MSwiaWF0IjoxNDgzOTY4Njk3LCJuYmYiOjE0ODM5Njg2OTcsImV4cCI6MTQ4Mzk2ODk5N30.zgM-N63GAeisHwUjUi0Wg3s8beM1Y4FA_u5g8ugW5jQ" http://localhost:5001/diabetic_retinopathy/predictions


    
    '''
    
    
    
    
    
    
    
    
    
