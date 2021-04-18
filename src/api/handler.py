from api import api
import serverless_wsgi


def handler(event, context):
    return serverless_wsgi.handle_request(api.app, event, context)