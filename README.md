# Rp Optimizer

## Test the python API only

1. Run a local Redis instance for testing
   `docker run -d -p 6379:6379 redis`
2. Create a virtualenv and install dependencies
3. Start the flask app
   `source '.env' && python 'app.py'`

## Working in a virtualenv

make one :
`virtualenv venv`

connect to it :
`source venv/bin/activate`

install from requirements file :
`pip install -r requirements.txt`

generate requirements file :
`pip freeze —local > requirements.txt`

disconnect from it :
`deactivate`
