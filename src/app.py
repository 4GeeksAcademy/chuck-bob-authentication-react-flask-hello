"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')

app = Flask(__name__)
app.url_map.strict_slashes = False

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this "super secret" to something else!
jwt = JWTManager(app)


# Allow CORS requests to this API
CORS(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

###############################################################################


@app.route('/user', methods=['GET'])                        #USER GET
def handle_hello_user():
    users = User.query.all()        # Query all users from the database
    response_body = [               # Format users into a list of dictionaries
        {"id": user.id, 
         "email": user.email, 
         "is_active": user.is_active}
        for user in users
    ]
    return jsonify(response_body), 200  # Return the response



@app.route('/user', methods=['POST'])                  #USER POST
def add_new_user():
    request_body = request.json
    email = request_body.get("email")
    password = request_body.get("password")
    is_active = request_body.get("is_active", True) 
    user = User(email=email, password=password, is_active=is_active)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User added successfully", "user": {"email": email, "is_active": is_active}}), 201



@app.route('/user/<int:user_id>', methods=['DELETE'])  #USER DELETE    
def delete_user(user_id):
    user = User.query.get(user_id)                  # Fetch the user by ID
    db.session.delete(user)                         # Delete the user from the database
    db.session.commit()                             # Commit the deletion
    return jsonify([{"id": user.id, "email": user.email} for user in User.query.all()]), 200  # Return the updated list of users

##########################

#CREATE TOKEN POST METHOD
@app.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)  # Use email instead of username
    password = request.json.get("password", None)

    # Query your database for email and password
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        # The user was not found in the database
        return jsonify({"msg": "Bad email or password"}), 401
    
    # Create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id })



# Add this route in your `app.py` after user-related routes
@app.route("/protected", methods=["GET"])
@jwt_required()  # Ensures this route is protected and requires a valid JWT
def protected():
    # Get the identity of the currently authenticated user
    current_user_id = get_jwt_identity()

    # Query the database for the user
    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({"id": user.id, "email": user.email}), 200













##############################################################################

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
