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

    const appBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: "todojyri-ui-bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.bucketDeployment(appBucket);

    const distribution = new cloudfront.Distribution(this, "myDist", {
      defaultBehavior: { origin: new origins.S3Origin(appBucket) },
      errorResponses: [
        {
          responseHttpStatus: 200,
          responsePagePath: `/${INDEX}`,
          ttl: cdk.Duration.seconds(0),
          httpStatus: 404,
        },
        {
          responseHttpStatus: 200,
          responsePagePath: `/${INDEX}`,
          ttl: cdk.Duration.seconds(0),
          httpStatus: 403,
        },
      ],
      defaultRootObject: INDEX,
    });

    this.domainName = distribution.distributionDomainName;
  }

  bucketDeployment(appBucket: any) {
    new s3deploy.BucketDeployment(this, "ui-bucket-deployment1", {
      sources: [s3deploy.Source.asset(ASSET_LOCATION, { exclude: [INDEX] })],
      cacheControl: [
        s3deploy.CacheControl.fromString("max-age=604800,public,immutable"),
      ],
      destinationBucket: appBucket as any,
      prune: false,
    });

    new s3deploy.BucketDeployment(this, "ui-bucket-deployment2", {
      sources: [
        s3deploy.Source.asset(ASSET_LOCATION, { exclude: ["*", `!${INDEX}`] }),
      ],
      cacheControl: [
        s3deploy.CacheControl.fromString(
          "max-age=60,no-cache,no-store,must-revalidate"
        ),
      ],
      destinationBucket: appBucket as any,
      prune: false,
    });
  }
}
