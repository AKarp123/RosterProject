from flask import Flask, request, render_template
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from flask_cors import CORS
from bson import json_util, ObjectId

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"), serverSelectionTimeoutMS=1000)
db = client["rosterProject"]
app = Flask(
    __name__,
    static_folder="../../client/dist",
    static_url_path="/",
    template_folder="../../client/dist",
)
CORS(app)

# @app.route('/')
# def hello_world():
#     return 'Hello, World!'


@app.route("/")
def index():
    return render_template("index.html")


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")


@app.route("/api/helloworld")
def hello_world_api():
    return {"message": "Hello, World!"}


@app.route("/api/addStudent", methods=["POST"])
def add_student():
    data = request.get_json()

    # print(data)
    try:
        student = {
            "firstName": data["firstName"],
            "lastName": data["lastName"],
            "major": data["major"],
            "graduationYear": int(data["graduationYear"]),
        }
    except KeyError:
        print(KeyError)
        return {"success": False, "message": "Invalid data format"}

    try:
        db.students.insert_one(student)
    except:
        return {"success": False, "message": "Error adding student"}

    return {"success": True, "message": "Student added successfully"}


@app.route("/api/search", methods=["GET"])
def search_student():
    query = request.args.get("query")
    try:
        result = db.students.find(
            {
                "$or": [
                    {"firstName": {"$regex": query, "$options": "i"}},
                    {"lastName": {"$regex": query, "$options": "i"}},
                ]
            }
        )
    except:
        return {"success": False, "message": "Error searching student"}

    return {"success": True, "results": json_util.dumps(result)}


@app.route("/api/deleteStudent/<id>", methods=["DELETE"])
def remove_student(id):
    
    try:
        result = db.students.delete_one({"_id": ObjectId(id)})
    except:
        return {"success": False, "message": "Error deleting student"}
    
    if result.deleted_count == 0:
        return {"success": False, "message": "Student not found"}
    

    return {"success": True, "message": "Student deleted successfully"}


@app.route("/api/stats")
def get_stats():
    stats = {
        "numStudents": db.students.count_documents({}),
    }
    majors = {}
    years = {}

    # try:
    #     major = request.args["major"]
    # except:
    #     major = None

    for student in db.students.find():
        if student["major"] in majors:
            majors[student["major"]] += 1
        else:
            majors[student["major"]] = 1

        if student["graduationYear"] in years:
            years[student["graduationYear"]] += 1
        else:
            years[student["graduationYear"]] = 1

    stats["major"] = majors
    stats["graduationYear"] = years

    # if major != None:
    #     return {"success" : True, "stats" : stats["major"]}

    return {"success": True, "stats": stats}


if __name__ == "__main__":
    app.run(debug=True)
