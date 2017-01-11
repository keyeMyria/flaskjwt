from apps import *


def create_db():
    """Creates the db tables."""
    db.create_all()


# def drop_db():
#     """Drops the db tables."""
#     db.drop_all()


def new_user():
    username = raw_input("Enter the username:")
    password = raw_input("Enter the password:")
    user = User(username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    print "Successfully created username password"

create_db()
new_user()

