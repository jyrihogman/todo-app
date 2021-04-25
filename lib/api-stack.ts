import * as path from "path";
import * as cdk from "@aws-cdk/core";
import * as dynamo from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import { PythonFunction } from "@aws-cdk/aws-lambda-python";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";

interface ApiStackProps extends cdk.StackProps {
  uiDomainName: string;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const table = new dynamo.Table(this, "TodoTable", {
      tableName: "Todos",
      partitionKey: { name: "Id", type: dynamo.AttributeType.STRING },
      sortKey: { name: "IdRange", type: dynamo.AttributeType.NUMBER },
    });

    const pythonFn = new PythonFunction(this, "MyFunction", {
      entry: path.join(__dirname, "../src/api/"), // required
      index: "handler.py", // optional, defaults to 'index.py'
      handler: "handler", // optional, defaults to 'handler'
      runtime: lambda.Runtime.PYTHON_3_8, // optional, defaults to lambda.Runtime.PYTHON_3_7,
      environment: {
        DOMAIN_NAME: props.uiDomainName,
      },
    });

    pythonFn.addToRolePolicy(
      new PolicyStatement({
        actions: [
          "dynamodb:Scan",
          "dynamodb:UpdateTable",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:PutItem",
          "dynamodb:ListTables",
          "dynamodb:GetItem",
          "dynamodb:DeleteItem",
        ],
        effect: Effect.ALLOW,
        resources: ["*"],
      })
    );

    new apigw.LambdaRestApi(this, "TodoApiGw", {
      restApiName: "TodoApiGw",
      handler: pythonFn,
      defaultCorsPreflightOptions: {
        allowOrigins: [`http://${props.uiDomainName}`],
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    });
  }
}
