import app  # Replace with your actual application 
import serverless_wsgi
 
def handler(event, context):
    return serverless_wsgi.handle_request(app.app, event, context)