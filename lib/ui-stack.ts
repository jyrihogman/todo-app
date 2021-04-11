import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

export class UiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: "ui-bucket"
    });
    
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./website-dist')],
      destinationBucket: websiteBucket,
    });

    new cloudfront.Distribution(this, 'myDist', {
      defaultBehavior: { origin: new origins.S3Origin(websiteBucket) },
      errorResponses: [
        {
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
          httpStatus: 404
        }
      ]
    });
  }
}
