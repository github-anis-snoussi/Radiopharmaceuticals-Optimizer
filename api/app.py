import os
from flask import Flask


# Create the Flask application
app = Flask(__name__)

# Details on the Secret Key: https://flask.palletsprojects.com/en/1.1.x/config/#SECRET_KEY
# NOTE: The secret key is used to cryptographically-sign the cookies used for storing
#       the session identifier.
app.secret_key = os.environ.get("SECRET_KEY")


@app.route('/api/ping', methods=['GET'])
def ping_pong():
    return "pong"


if __name__ == '__main__':
    app.run( host="0.0.0.0" , port=5000 )