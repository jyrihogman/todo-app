import pytest
import json
import os

from service import dynamodb
from setup_tests import create_table
from moto import mock_dynamodb2
from flask import current_app
from api.api import app


@pytest.fixture(autouse=True)
def prepare():
    os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
    os.environ["AWS_REGION"] = "us-east-1"


@pytest.fixture
def client():
    with app.test_client() as client:
        with app.app_context():  # New!!
            assert current_app.config["ENV"] == "production"
        yield client


@mock_dynamodb2
def test_get_todos(client):
    create_table()
    response = client.get('/todos?pageCount=0')

    assert response.status_code == 200
    assert response.json["deleteKey"] is not None
    assert len(response.json["todos"]) > 0


@mock_dynamodb2
def test_get_details(client):
    create_table()

    response = client.get('/todo?id=testing_id_1')

    assert response.json["id"] == "testing_id_1"
    assert response.status_code == 200


@mock_dynamodb2
def test_update_todo(client):
    create_table()
    old_todo = dynamodb.get_todo("testing_id_1")

    response = client.put('/todo/update',
                          data=json.dumps({"id": "testing_id_1", "idRange": 2, "isDone": True}),
                          content_type='application/json')

    new_todo = dynamodb.get_todo("testing_id_1")

    assert response.status_code == 200
    assert new_todo["id"] == "testing_id_1"

    assert new_todo["isDone"]
    assert not old_todo["isDone"]


@mock_dynamodb2
def test_add_todo(client):
    create_table()
    max_val, old_response = dynamodb.get_todos(None)
    new_title = "Test"

    resp = client.post('/todo/add',
                       data=json.dumps({
                           "idRange": "7",
                           "title": new_title,
                           "description": "Test description",
                           "isDone": False,
                           "date": "2021-04-20T21:28:20.625Z"
                       }),
                       content_type='application/json')

    max_val, new_response = dynamodb.get_todos(None)

    new_todo = dynamodb.get_todo(resp.json["id"])

    assert resp.status_code == 200
    assert new_todo["title"] == new_title
    assert len(new_response["Items"]) > len(old_response["Items"])


@mock_dynamodb2
def test_delete_todo(client):
    create_table()

    response = client.delete('/todo/delete',
                             data=json.dumps({"id": "testing_id_1", "idRange": 2}),
                             content_type='application/json')

    max_val, resp = dynamodb.get_todos(0)
    assert len([item for item in resp["Items"] if item["Id"] == "testing_id_1"]) == 0
    assert response.status_code == 200

