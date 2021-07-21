# Rp Optimizer

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

## Run a local Redis instance for testing

`docker run -d -p 6379:6379 redis`
