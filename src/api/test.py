import boto3

client = boto3.client('dynamodb')

resp = client.query(
    TableName="Todos",
    ExpressionAttributeValues={
        ':v0': {'S': "20"},
        ':v1': {'N': "40"}
    },
    KeyConditionExpression="(Id == :v0) AND (IdRange < :v1)"
)

print(resp)