import os
import boto3

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


def get_todos(key):
    if key is not None:
        decoded_key = decode(key)
        return client.scan(TableName=TABLE_NAME, Limit=20, ExclusiveStartKey=decoded_key)

    return client.scan(TableName=TABLE_NAME, Limit=20)


def get_todo(identifier):
    item = client.get_item(TableName=TABLE_NAME, Key={"Id": {"S": identifier}})
    return deserialize(item["Item"])


def put_todo(todo):
    # serialized = serialize({
    #     "Id": todo["id"],
    #     "Description": todo["description"],
    #     "Title": todo["title"],
    #     "Date": todo["date"],
    #     "IsDone": todo["isDone"]
    # })
    serialized = serialize(todo)

    return client.put_item(TableName=TABLE_NAME, Item=serialized)


def delete_todo(id_number):
    return client.delete_item(TableName=TABLE_NAME, Key={"Id": {"S": id_number}})


def update_todo(payload):
    return client.update_item(
        TableName=TABLE_NAME,
        Key={"Id": {"S": payload["id"]}},
        UpdateExpression="set IsDone=:d",
        ExpressionAttributeValues={":d": {"BOOL": payload["isDone"]}},
    )


def deserialize(items):
    if type(items) == list:
        lst = []
        for item in items:
            d = {}

            for key in item:
                d[key[0].lower() + key[1:]] = deserialize(item[key])

            lst.append(d)
        return lst

    d = {}
    for key in items:
        d[key[0].lower() + key[1:]] = deserializer.deserialize(items[key])

    return d


def serialize(item):
    d = {}
    for key in item:
        d[key.capitalize()] = serializer.serialize(item[key])

    return d


def decode(key):
    if key is None:
        return None

    return decoder.decode(key)


def encode(key):
    return encoder.encode(key)
