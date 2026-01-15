import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/

// KRISTIAN_NOTE - Anthropic Opus does not support "model invocation with on-demand throughput".
// I think that means programmatically sending on-demand prompts to an Amplify app requires a different model.
// We need one that supports the Swedish language, so let's try Mistral.
// export const OPUS_MODEL_ID = 'anthropic.claude-opus-4-5-20251101-v1:0';
export const MISTRAL_MODEL_ID = 'mistral.mistral-large-3-675b-instruct'

export const tutorSwedishFunction = defineFunction({
  entry: "./tutorSwedish.ts",
  environment: {
    // OPUS_MODEL_ID,
    MISTRAL_MODEL_ID,
  }
})

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  tutorSwedish: a
    .query()
    .arguments({ prompt: a.string().required() })
    .returns(a.string()) // KRISTIAN_TODO - Changing the type to a.json() gives a string in todos.component.ts.  Why?
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function(tutorSwedishFunction)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 90,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
