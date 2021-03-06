import boto3
import json
import uuid

TABLE_NAME = "Todos"


def get_todos():
    with open("db.json") as json_file:
        return json.load(json_file)["todos"]


def create_table():
    dynamo = boto3.client("dynamodb", endpoint_url="http://localhost:8080")

    existing_tables = dynamo.list_tables()["TableNames"]

    if TABLE_NAME in existing_tables:
        dynamo.delete_table(TableName=TABLE_NAME)

    dynamo.create_table(
        TableName=TABLE_NAME,
        AttributeDefinitions=[
            {"AttributeName": "Id", "AttributeType": "S"},
            {"AttributeName": "IdRange", "AttributeType": "N"},
        ],
        KeySchema=[
            {"AttributeName": "Id", "KeyType": "HASH"},
            {"AttributeName": "IdRange", "KeyType": "RANGE"},
        ],
        ProvisionedThroughput={"ReadCapacityUnits": 10, "WriteCapacityUnits": 10},
    )

    for todo in get_todos():
        guid = str(uuid.uuid4())

        dynamo.put_item(
            TableName=TABLE_NAME,
            Item={
                "Id": {"S": guid},
                "IdRange": {"N": todo["idRange"]},
                "Title": {"S": todo["title"]},
                "Description": {"S": todo["description"]},
                "IsDone": {"BOOL": todo["isDone"]},
                "Date": {"S": todo["date"]},
            },
        )


create_table()
