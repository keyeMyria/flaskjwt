def new_user():
    user = User(username='mani')
    user.hash_password('mani')
    db.session.add(user)
    db.session.commit()
