from datetime import timedelta
import os
import calendar
import time
from urllib.request import Request, urlopen
import urllib.parse
import requests
from PIL import Image

from redis import Redis
from flask import Flask, render_template_string, request, session, redirect, url_for
from flask_session import Session


# Path for uploaded photos
UPLOAD_FOLDER = os.path.join('static', 'uploads')


# Create the Flask application
app = Flask(__name__)

# Details on the Secret Key: https://flask.palletsprojects.com/en/1.1.x/config/#SECRET_KEY
# NOTE: The secret key is used to cryptographically-sign the cookies used for storing
#       the session identifier.
app.secret_key = os.environ.get("SECRET_KEY")

# Configure Redis for storing the session data on the server-side
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = False
app.config['SESSION_REDIS'] = Redis(host='redis', port=6379)

# Configure the upload path
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create and initialize the Flask-Session object AFTER `app` has been configured
server_session = Session(app)


@app.route('/api/set_nickname', methods=['GET', 'POST'])
def set_nickname():
    if request.method == 'POST':

        # Save the form data to the session object
        nick = request.form['nickname_data']
        session['nickname'] = nick

        return redirect(url_for('show_nickname'))

    return """
        <form method="post" action="/api/set_nickname" enctype="multipart/form-data">
            <label for="nickname">Set your nickname:</label>
            <input type="text" id="nickname-image" name="nickname_data" required />
            <button type="submit">Submit</button
        </form>
        """


@app.route('/api/show_nickname')
def show_nickname():
    if session['nickname'] :
        return render_template_string("""
                    <p> {{ session['nickname'] }} </p>
                    <p> {{ session.sid }} </p>
            """)
    else:
        return render_template_string("""
                    <h1>Welcome! Please set your nickname <a href="{{ url_for('set_nickname') }}">here.</a></h1>
            """)


@app.route('/delete_nickname')
def delete_nickname():
    # Clear the nickname stored in the session object
    session.pop('nickname', default=None)
    return '<h1>Session deleted!</h1>'



if __name__ == '__main__':
    app.run( host="0.0.0.0" , port=5000 )