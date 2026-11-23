
from dotenv import load_dotenv
import os
from flask import Flask, render_template, request, redirect, url_for, session
from flask_pymongo import PyMongo

# ------------------------------------
# LOAD ENVIRONMENT VARIABLES
# ------------------------------------

load_dotenv()

db_user = os.getenv("MONGODB_USERNAME")
db_pass = os.getenv("MONGODB_PASSWORD")
uri = os.getenv("MONGODB_URI")
db_name = os.getenv("DATABASE_NAME")

# Add database name to MongoDB URI
uri = uri.rstrip("/") + f"/{db_name}?retryWrites=true&w=majority"


# ------------------------------------
# SET UP FLASK AND MONGODB
# ------------------------------------

app = Flask(__name__)
app.secret_key = os.urandom(24)

app.config["MONGO_URI"] = uri
mongo = PyMongo(app)

# Test connection
try:
    mongo.cx.admin.command("ping")
    print("Database:", mongo.db.name)
    print("Collection:", mongo.db.plantRepo.name)
    print("You successfully connected to MongoDB!")
except Exception as e:
    print("Connection failed:", type(e).__name__)


# ------------------------------------
# HOME PAGE
# ------------------------------------

@app.route('/')
def index():
    return render_template("index.html")


# ------------------------------------
# TEST INSERT PAGE
# ------------------------------------

@app.route('/insertTestPage')
def insertTest():
    session.pop('ids', None)
    return render_template("testInsert.html")


# ------------------------------------
# INSERT MULTIPLE PLANTS
# ------------------------------------

@app.route('/insertMany')
def insertMany():

    data = [
        {
            'owner_name': 'Sarah',
            'plant_name': 'Snake Plant',
            'birthDate': '2002-06-12',
            'geoLoc': 'Montreal',
            'descript': 'Description for the plant',
            'imagePath': 'images/one.png'
        },
        {
            'owner_name': 'Sarah',
            'plant_name': 'Cactus',
            'birthDate': '2005-06-13',
            'geoLoc': 'Toronto',
            'descript': 'Description for the plant',
            'imagePath': 'images/seven.png'
        },
        {
            'owner_name': 'Sarah',
            'plant_name': 'Agapanthus',
            'birthDate': '2003-03-19',
            'geoLoc': 'Halifax',
            'descript': 'Description for the plant',
            'imagePath': 'images/seventeen.png'
        },
        {
            'owner_name': 'Stephen',
            'plant_name': 'Baby Rubber Plant',
            'birthDate': '1999-07-18',
            'geoLoc': 'Edinborough',
            'descript': 'Description for the plant',
            'imagePath': 'images/ten.png'
        },
        {
            'owner_name': 'Stephen',
            'plant_name': 'Dahlia',
            'birthDate': '2000-05-06',
            'geoLoc': 'London',
            'descript': 'Description for the plant',
            'imagePath': 'images/thirteen.png'
        },
        {
            'owner_name': 'Harold',
            'plant_name': 'Daphne',
            'birthDate': '2012-10-21',
            'geoLoc': 'New York',
            'descript': 'Description for the plant',
            'imagePath': 'images/three.png'
        },
        {
            'owner_name': 'Martha',
            'plant_name': 'Daylily',
            'birthDate': '2017-08-21',
            'geoLoc': 'Paris',
            'descript': 'Description for the plant',
            'imagePath': 'images/nine.png'
        }
    ]

    try:
        result = mongo.db.plantRepo.insert_many(data)

        session['ids'] = [str(item) for item in result.inserted_ids]

        return redirect(url_for('testIds'))

    except Exception as e:
        print(e)
        return "Database insertion failed", 500


# ------------------------------------
# DISPLAY INSERTED DOCUMENT IDS
# ------------------------------------

@app.route('/testIds')
def testIds():
    print(session.get('ids', []))
    return render_template("testIds.html")


# ------------------------------------
# VIEW ALL DATABASE RESULTS
# ------------------------------------

@app.route('/viewResults')
def viewResults():
    result = mongo.db.plantRepo.find()
    return render_template("viewResults.html", result=result)


# ------------------------------------
# UPDATE ONE PLANT
# ------------------------------------

@app.route('/updateOne')
def updateOne():
    try:
        mongo.db.plantRepo.find_one_and_update(
            {'plant_name': 'Agapanthus'},
            {'$set': {'descript': 'a more precise description'}}
        )

        return redirect(url_for("insertTest"))

    except Exception as e:
        print(e)
        return "Update failed", 500


# ------------------------------------
# RUN FLASK
# ------------------------------------


@app.route('/updatePoints')
def updatePoints():
    try:
        mongo.db.plantRepo.find_one_and_update(
            {'user': 'maria'},
            {'$inc': {'points': 2}}
        )
        return redirect(url_for("insertTest"))
    except Exception as e:
        print(e)
        return "Update failed", 500


@app.route('/updateOneRepeat')
def updateOneRepeat():
    try:
        mongo.db.plantRepo.find_one_and_update(
            {'owner_name': 'Sarah'},
            {'$set': {
                'descript': 'a more precise description for all sarahs',
                'title': 'test123'
            }}
        )
        return redirect(url_for("insertTest"))
    except Exception as e:
        print(e)
        return "Update failed", 500


if __name__ == "__main__":
    app.run(debug=True)
