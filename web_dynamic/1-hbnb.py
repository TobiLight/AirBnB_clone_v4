#!/usr/bin/python3
"""
starts a Flask web application
"""

from flask import Flask, render_template
from models import *
from models import storage
from uuid import uuid4

app = Flask(__name__)


@app.route('/1-hbnb/', strict_slashes=False)
def amenities():
    """display the states and cities listed in alphabetical order"""
    states = storage.all('State').values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all('Amenity').values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all('Place').values()
    places = sorted(places, key=lambda k: k.name)

    return render_template('1-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid4())


@app.teardown_appcontext
def teardown_db(exception):
    """closes the storage on teardown"""
    storage.close()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)
