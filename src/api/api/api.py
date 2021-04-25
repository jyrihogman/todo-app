import os
import simplejson as json
import uuid
import boto3

from flask import Flask, request, jsonify
from flask_cors import CORS

from service import dynamodb


app = Flask(__name__)
DOMAIN_NAME = os.environ.get("DOMAIN_NAME") or "*"
cors = CORS(app, resources={r"/*": {"origins": f"http://{DOMAIN_NAME}"}})

UUID = str(uuid.uuid4())
TABLE_NAME = "Todos"
AWS_ENV = os.environ.get("AWS_REGION") is not None


@app.route("/todos", methods=["GET"])
def get_todos():
    page_count = int(request.args.get("pageCount") or 0)
    new_index, response = dynamodb.get_todos(page_count)
    deserialized = dynamodb.deserialize(response["Items"])

    for d in deserialized:
        d["idRange"] = int(d.get("idRange"))

    return_dict = {"todos": deserialized, "deleteKey": UUID}

    if new_index <= response.get("ScannedCount"):
        return_dict["pageCount"] = new_index

    return return_dict


@app.route("/todo", methods=["GET"])
def get_details():
    todo = dynamodb.get_todo(request.args.get("id"))
    return todo


@app.route("/todo/update", methods=["PUT"])
def update_todo():
    response = dynamodb.update_todo(request.json)
    return jsonify(response)


@app.route("/todo/delete", methods=["DELETE"])
def delete_todo():
    return dynamodb.delete_todo(request.json)


@app.route("/todo/deleteall", methods=["DELETE"])
def delete_all_todos():
    if request.json.get("deleteKey") == UUID:
        dynamodb.delete_all()
        return jsonify({"msg": "Deleted all todos"}), 200

    return jsonify({"msg": "Cannot delete all todos"}), 500


@app.route("/todo/add", methods=["POST"])
def add_todo():
    id_, response = dynamodb.put_todo(request.json)

    return jsonify({"response": response, "id": id_})


def get_s3_todos():
    s3 = boto3.client("s3")
    s3_data = s3.get_object(Bucket="app-bucket", Key="data.json")["Body"]
    return json.loads(s3_data)


def read_todos():
    with open("db.json") as json_file:
        return json.load(json_file)
