import os
import boto3
import uuid

from boto3.dynamodb.types import TypeDeserializer, TypeSerializer
from botocore.paginate import TokenEncoder, TokenDecoder


TABLE_NAME = "Todos"

encoder = TokenEncoder()
decoder = TokenDecoder()
deserializer = TypeDeserializer()
serializer = TypeSerializer()


def get_todos(page_count: int):
    low_value = page_count
    max_value = low_value + 10

    response = get_dynamo_client().scan(TableName=TABLE_NAME,
                                        Limit=20,
                                        ExpressionAttributeValues={
                                            ':min': {"N": str(low_value)},
                                            ':max': {"N": str(max_value)}
                                        },
                                        FilterExpression="IdRange > :min AND IdRange <= :max"
                                        )
    return max_value, response


def get_todo(identifier: str):
    items = get_dynamo_client().query(TableName=TABLE_NAME,
                                      KeyConditionExpression="Id = :id",
                                      ExpressionAttributeValues={
                                        ":id": {"S": identifier}}
                                      )
    return deserialize(items["Items"][0])


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
    response = get_dynamo_client().put_item(TableName=TABLE_NAME, Item=serialized)
    return id_, response


def delete_todo(payload):
    return get_dynamo_client().delete_item(
        TableName=TABLE_NAME,
        Key={"Id": {"S": payload["id"]}, "IdRange": {"N": str(payload["idRange"])}}
    )


def update_todo(payload):
    return get_dynamo_client().update_item(
        TableName=TABLE_NAME,
        Key={"Id": {"S": payload["id"]}, "IdRange": {"N": str(payload["idRange"])}},
        UpdateExpression="set IsDone=:d",
        ExpressionAttributeValues={":d": {"BOOL": payload["isDone"]}},
    )


# Tad crazy, but hey it's efficient
def delete_all():
    get_dynamo_client().delete_table(
        TableName=TABLE_NAME
    )

    get_dynamo_client().create_table(
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


def get_dynamo_client():
    aws_env = os.environ.get("AWS_REGION") is not None

    return (
        boto3.client("dynamodb")
        if aws_env
        else boto3.client("dynamodb", endpoint_url="http://localhost:8080")
    )
