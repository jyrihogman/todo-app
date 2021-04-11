import os
import json

import boto3
import dynamodb

from flask import Flask, request, jsonify


app = Flask(__name__)

TABLE_NAME = "Todos"
AWS_ENV = os.environ.get("AWS_REGION") is not None
client = (
    boto3.client("dynamodb")
    if AWS_ENV
    else boto3.client("dynamodb", endpoint_url="http://localhost:8080")
)


@app.route("/todos", methods=["POST"])
def get_todos():
    last_eval_key = request.json.get("key")
    response = dynamodb.get_todos(last_eval_key)
    print(response)
    return_dict = {"todos": dynamodb.deserialize(response["Items"])}

    if response.get("LastEvaluatedKey") is not None:
        return_dict["lastEvalKey"] = dynamodb.encode(response["LastEvaluatedKey"])

    return return_dict


@app.route("/todo", methods=["POST"])
def get_details():
    todo = dynamodb.get_todo(request.json["id"])
    return todo


@app.route("/todo/update", methods=["POST"])
def update_todo():
    response = dynamodb.update_todo(request.json)
    print(response)
    return jsonify(response)


@app.route("/todo/delete", methods=["POST"])
def delete_todo():
    return dynamodb.delete_todo(request.json["id"])


@app.route("/todo/add", methods=["POST"])
def add_todo():
    return dynamodb.put_todo(request.json)


def get_data():
    return get_todos() if AWS_ENV else read_todos()


def get_s3_todos():
    s3 = boto3.client("s3")
    s3_data = s3.get_object(Bucket="app-bucket", Key="data.json")["Body"]
    return json.loads(s3_data)


def read_todos():
    with open("db.json") as json_file:
        return json.load(json_file)
