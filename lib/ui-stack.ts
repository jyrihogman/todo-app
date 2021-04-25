import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";

const ASSET_LOCATION = "./src/ui/build/";
const INDEX = "index.html";

export class UiStack extends cdk.Stack {
  domainName = "";

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: "todojyri-ui-bucket",
      websiteIndexDocument: INDEX,
      websiteErrorDocument: INDEX,
    });

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset(ASSET_LOCATION)],
      destinationBucket: websiteBucket,
    });

    const distribution = new cloudfront.Distribution(this, "myDist", {
      defaultBehavior: { origin: new origins.S3Origin(websiteBucket) },
      errorResponses: [
        {
          responseHttpStatus: 200,
          responsePagePath: `/${INDEX}`,
          ttl: cdk.Duration.seconds(0),
          httpStatus: 404,
        },
      ],
      defaultRootObject: INDEX,
    });

    this.domainName = distribution.distributionDomainName;
  }
}
