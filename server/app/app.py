from flask import Flask, request, render_template
from pymongo import MongoClient

client = MongoClient("mongodb://mongodb:27017", serverSelectionTimeoutMS=1000)
rosterDb = client["rosterProject"]
app = Flask(__name__, static_folder="../../client/dist", static_url_path="/", template_folder="../../client/dist")

# @app.route('/')
# def hello_world():
#     return 'Hello, World!'


@app.route("/")
def index():
    return render_template("index.html")


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
        rosterDb.students.insert_one(student)
    except:
        return {"success": False, "message": "Error adding student"}

    return {"success": True, "message": "Student added successfully"}


@app.route("/api/deleteStudent", methods=["POST"])
def remove_student():
    data = request.get_json()
    result = rosterDb.students.delete_one(
        {"firstName": data["firstName"], "lastName": data["lastName"]}
    )
    if result.deleted_count == 1:
        return {"success": True, "message": "Student removed successfully"}
    else:
        return {"success": False, "message": "Student not found"}


@app.route("/api/stats")
def get_stats():
    stats = {
        "numStudents": rosterDb.students.count_documents({}),
    }
    majors = {}
    years = {}
    for student in rosterDb.students.find():
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

    return {"success": True, "stats": stats}    


if __name__ == "__main__":
    app.run(debug=True)
