import boto3
import json


TABLE_NAME = "Todos"
uuids = []


def get_todos():
    with open("db.json") as json_file:
        return json.load(json_file)["todos"]


def create_table():
    dynamo = boto3.client("dynamodb")
    dynamo.create_table(
        TableName=TABLE_NAME,
        AttributeDefinitions=[
            {
                'AttributeName': 'Id',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'IdRange',
                'AttributeType': 'N'
            },
        ],
        KeySchema=[
            {
                'AttributeName': 'Id',
                'KeyType': 'HASH'
            },
            {
                'AttributeName': 'IdRange',
                'KeyType': 'RANGE'
            },
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    )

    for num, todo in enumerate(get_todos()):
        dynamo.put_item(
            TableName=TABLE_NAME,
            Item={
                "Id": {
                    "S": f"testing_id_{num}"
                },
                "IdRange": {
                    "N": todo["idRange"]
                },
                "Title": {
                    "S": todo["title"]
                },
                "Description": {
                    "S": todo["description"]
                },
                "IsDone": {
                    "BOOL": todo["isDone"]
                },
                "Date": {
                    "S": todo["date"]
                }
            }
        )
