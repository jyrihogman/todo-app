import os
import boto3
import uuid

from boto3.dynamodb.types import TypeDeserializer, TypeSerializer
from botocore.paginate import TokenEncoder, TokenDecoder

TABLE_NAME = "Todos"
AWS_ENV = os.environ.get("AWS_REGION") is not None

client = (
    boto3.client("dynamodb")
    if AWS_ENV
    else boto3.client("dynamodb", endpoint_url="http://localhost:8080")
)

encoder = TokenEncoder()
decoder = TokenDecoder()
deserializer = TypeDeserializer()
serializer = TypeSerializer()


def get_todos(page_count):
    low_value = page_count if page_count is not None else 0
    max_value = low_value + 10

    response = client.scan(TableName=TABLE_NAME,
                           Limit=20,
                           ExpressionAttributeValues={
                               ':min': {"N": str(low_value)},
                               ':max': {"N": str(max_value)}
                           },
                           FilterExpression="IdRange > :min AND IdRange <= :max"
                           )
    return max_value, response


def get_todo(identifier):
    item = client.get_item(TableName=TABLE_NAME, Key={"Id": {"S": identifier}})
    return deserialize(item["Item"])


def put_todo(todo):
    id_ = str(uuid.uuid4())
    serialized = {
        "Id": {"S": id_},
        "IdRange": {"N": str(todo["idRange"])},
        "Description": {"S": todo["description"]},
        "Title": {"S": todo["title"]},
        "Date": {"S": todo["date"]},
        "IsDone": {"BOOL": todo["isDone"]}
    }
    response = client.put_item(TableName=TABLE_NAME, Item=serialized)
    return id_, response


def delete_todo(payload):
    return client.delete_item(
        TableName=TABLE_NAME,
        Key={"Id": {"S": payload["id"]}, "IdRange": {"N": str(payload["idRange"])}}
    )


def update_todo(payload):
    return client.update_item(
        TableName=TABLE_NAME,
        Key={"Id": {"S": payload["id"]}, "IdRange": {"N": str(payload["idRange"])}},
        UpdateExpression="set IsDone=:d",
        ExpressionAttributeValues={":d": {"BOOL": payload["isDone"]}},
    )


# Tad crazy, but hey it's efficient
def delete_all():
    client.delete_table(
        TableName=TABLE_NAME
    )

    client.create_table(
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


def deserialize(items):
    if type(items) == list:
        lst = []
        for item in items:
            d = {}

            for key in item:
                d[key[0].lower() + key[1:]] = deserializer.deserialize(item[key])

            lst.append(d)
        return lst

    d = {}
    for key in items:
        d[key[0].lower() + key[1:]] = deserializer.deserialize(items[key])

    return d


def serialize(item):
    d = {}
    for key in item:
        d[key] = serializer.serialize(item[key])

    return d


def decode(key):
    if key is None:
        return None

    return decoder.decode(key)


def encode(key):
    return encoder.encode(key)
