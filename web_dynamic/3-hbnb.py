#!/usr/bin/python3
"""
starts a Flask web application
"""

from flask import Flask, render_template
from models import *
from models import storage
from uuid import uuid4

app = Flask(__name__)


@app.route('/3-hbnb/', strict_slashes=False)
def places_search():
    """display the states and cities listed in alphabetical order"""
    states = storage.all('State').values()
    states = sorted(states, key=lambda k: k.name)
    state_city = []

    for state in states:
        state_city.append([state.to_dict(), sorted(
            state.cities, key=lambda k: k.name)])

    amenities = storage.all('Amenity').values()
    amenities = [amenity.to_dict() for amenity in amenities]

    places = storage.all('Place').values()
    places = sorted(places, key=lambda k: k.name)

    return render_template('3-hbnb.html',
                           states=states,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid4())


@app.teardown_appcontext
def teardown_db(exception):
    """closes the storage on teardown"""
    storage.close()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)
