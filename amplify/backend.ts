import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, MISTRAL_MODEL_ID, tutorSwedishFunction } from './data/resource';
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export const backend = defineBackend({
  auth,
  data,
  tutorSwedishFunction,
});

backend.tutorSwedishFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:*::foundation-model/${MISTRAL_MODEL_ID}`,
    ],
  })
);
