import os
import datetime
from redis import Redis
from flask import Flask, render_template_string, request, session, redirect, url_for
from flask_session import Session

# THIS IS THE LOGIC BEHIN THIS APP:
from app_logic import sorting_after_every_injection, first_sorting, second_sorting

# Create the Flask application
app = Flask(__name__)

# Details on the Secret Key: https://flask.palletsprojects.com/en/1.1.x/config/#SECRET_KEY
# NOTE: The secret key is used to cryptographically-sign the cookies used for storing
#       the session identifier.
app.secret_key = os.environ.get("SECRET_KEY")

# Configure Redis for storing the session data on the server-side
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = Redis(host=os.environ.get("REDIS_HOST"), port=6379)


# Create and initialize the Flask-Session object AFTER `app` has been configured
server_session = Session(app)


@app.route('/api/ping')
def ping_pong():
    return 'pong'


@app.route('/api/session', methods=['GET', 'POST', 'DELETE'])
def session_utils():
    if request.method == 'POST':
        try:
            rp_settings = request.get_json()

            session["rp_activity"] = rp_settings['rp_activity']
            session["rp_half_life"] = rp_settings['rp_half_life']
            session["mesure_time"] = rp_settings['mesure_time']
            session["first_inj_time"] = rp_settings['first_inj_time']
            session["rp_vol"] = rp_settings['rp_vol']
            session["wasted_vol"] = rp_settings['wasted_vol']
            session["unextractable_vol"] = rp_settings['unextractable_vol']

            return 'Session initialised.'

        except Exception as e:
            #Clear the session
            session.pop('rp_activity', default=None)
            session.pop('rp_half_life', default=None)
            session.pop('mesure_time', default=None)
            session.pop('first_inj_time', default=None)
            session.pop('rp_vol', default=None)
            session.pop('wasted_vol', default=None)
            session.pop('unextractable_vol', default=None)

            return 'yo! be careful.'

    elif request.method == 'DELETE':
        
        session.pop('rp_activity', default=None)
        session.pop('rp_half_life', default=None)
        session.pop('mesure_time', default=None)
        session.pop('first_inj_time', default=None)
        session.pop('rp_vol', default=None)
        session.pop('wasted_vol', default=None)
        session.pop('unextractable_vol', default=None)

        return 'Session deleted.'


    else :
        # check if session is set
        if not session.get('mesure_time') :
            return 'Please initialise the session.'
        
        # Session is set, so we return measure time.
        mesure_time = session["mesure_time"]
        date = datetime.datetime.fromtimestamp(mesure_time / 1e3)

        # return the measure time for this session
        return "Current measure time : {}".format(str(date))



# input <= patient_list : array[]
# output => sorted_list : array[]
@app.route('/api/sort', methods=['POST'])
def sort_patients_list():

    # We check if the session is set
    if not session.get('mesure_time') :
        return 'Please initialise the session.'

    try:
        # This the patients list the way we received it
        received_patient_list = request.get_json()['patient_list']
        # this will hold the formated patients list
        patient_list = []

        # we format the received patients list the way we want it
        for p in received_patient_list:
            if p['injected']:
                    patient_list.append({ **p, 'inj_time' : datetime.datetime.fromtimestamp(p['inj_time'] / 1e3)})
            else:
                    patient_list.append({ **p, 'inj_time' : datetime.datetime.max})

        # this is the app settings saved in the session
        rp_settings = {
            "rp_activity" : session["rp_activity"],
            "rp_half_life" : session["rp_half_life"],
            "mesure_time" : datetime.datetime.fromtimestamp(session["mesure_time"] / 1e3),
            "first_inj_time" : datetime.datetime.fromtimestamp(session["first_inj_time"] / 1e3),
            "rp_vol" : session["rp_vol"],
            "wasted_vol" : session["wasted_vol"],
            "unextractable_vol" : session["unextractable_vol"]
        }

        sorting_after_every_injection(patient_list)
        first_sorting(patient_list)
        second_sorting (patient_list, rp_settings)

        reforamed_patient_list = []

        for patient in patient_list:
            if (patient['inj_time'].year == 9999):
                reforamed_patient_list.append({**patient, 'inj_time' : None})
            else:
                reforamed_patient_list.append({**patient, 'inj_time' : int(patient['inj_time'].strftime("%s")) * 1000  })

        return { 'sorted_list': reforamed_patient_list }
    
    except Exception as e:
        return {'error' : str(e)}





if __name__ == '__main__':
    app.run( host="0.0.0.0" , port=5000 )