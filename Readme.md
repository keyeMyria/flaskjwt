Token Based Authentication - Flask - Angular js
=================================================

Token Based authentication using Flask and login with angular js.

## Install

```elixir

# Global Installation

sudo apt-get install python-setuptools
sudo apt-get install python-pip
sudo pip install Flask==0.12
sudo pip install Flask-JWT==0.3.2
sudo pip install Flask-Login==0.4.0
sudo pip install passlib==1.7.0
sudo pip install Flask-SQLAlchemy==2.1
```

```elixir

# if using virtual environment python

virtualenv flaskenv
source flaskenv/bin/activate
pip install -r requirement.txt
```

## Run code here
```elixir
git clone https://github.com/manioftony/flaskjwt
cd flaskjwt
python app.py

http://127.0.0.1:5000/
```

## culr command

-------------curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"username": "mani", "password": "mani"}' http://localhost:5001/auth

result:
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6MSwiaWF0IjoxNDg0MTIzNjM0LCJuYmYiOjE0ODQxMjM2MzQsImV4cCI6MTQ4NDEyMzkzNH0.KAw_HPFN4Urmq8keLtzU_KiQtmOu0ibrxGVkUxq_i9A"
    }

-------------curl -X POST -i -H "Content-Type: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6MSwiaWF0IjoxNDg0MTIzNjM0LCJuYmYiOjE0ODQxMjM2MzQsImV4cCI6MTQ4NDEyMzkzNH0.KAw_HPFN4Urmq8keLtzU_KiQtmOu0ibrxGVkUxq_i9A" http://localhost:5001/diabetic_retinopathy/predictions

result :
        {
          "manikandan": "nbmnbmbmn"
        }


## Using python requests

sudo pip install requests
    or 
pip install requests

r = requests.post('http://127.0.0.1:5001/auth', data=json.dumps({'username':'mani',     
                            'password':'mani'}), headers={'content-type': 'application/json'})

obj = r.json()
obj_token = r.json()['access_token']

r = requests.post('http://localhost:5001/diabetic_retinopathy/predictions', 
                            headers={'Authorization': 'JWT %s'%(obj_token)})

r.json()


## Info

Just run the python file in terminal it will generate the live Nifty 50 details in the CSV format.
