#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { UiStack } from "../lib/ui-stack";
import { ApiStack } from "../lib/api-stack";

const app = new cdk.App();

const uiStack = new UiStack(app, "UiStack");
new ApiStack(app, "ApiStack", { uiDomainName: uiStack.domainName });
