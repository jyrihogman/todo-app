import * as path from "path";
import * as cdk from "@aws-cdk/core";
import * as dynamo from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import { PythonFunction } from "@aws-cdk/aws-lambda-python";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";

export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log(path.join(__dirname, "../src/api/"));
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

    // const fn = new lambda.Function(this, 'TodoApiHandler', {
    // 	functionName: "TodoApiHandler",
    // 	runtime: lambda.Runtime.PYTHON_3_8,
    // 	handler: 'handler.handler',
    // 	code: lambda.Code.fromAsset(path.join(__dirname, '../src/api/')),
    //   });

    new apigw.LambdaRestApi(this, "TodoApiGw", {
      restApiName: "TodoApiGw",
      handler: pythonFn,
      defaultCorsPreflightOptions: {
        allowOrigins: ["http://d1aaeosv4er2k8.cloudfront.net"],
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    });
  }
}
