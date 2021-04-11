from boto3.dynamodb.types import TypeDeserializer, TypeSerializer
from botocore.paginate import TokenEncoder, TokenDecoder


encoder = TokenEncoder()
decoder = TokenDecoder()
deserializer = TypeDeserializer()
serializer = TypeSerializer()


def deserialize(items):
    if type(items) == list:
        lst = []
        for item in items:
            d = {}

            for key in item:
                d[key] = deserializer.deserialize(item[key])

            lst.append(d)
        return lst

    d = {}
    for key in items:
        d[key] = deserializer.deserialize(items[key])
        return d


def decode(key):
    if key is None:
        return None

    return decoder.decode(key)


def encode(key):
    if key is None:
        return None

    return encoder.encode(key)
