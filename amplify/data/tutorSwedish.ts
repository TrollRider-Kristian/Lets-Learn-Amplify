import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

// initialize bedrock runtime client
const client = new BedrockRuntimeClient();

export const handler: Schema["tutorSwedish"]["functionHandler"] = async (
  event,
  context
) => {
  // User prompt
  const prompt = event.arguments.prompt;

  // Invoke model
  const input = {
    modelId: process.env.MISTRAL_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      system:
        "You are my Swedish tutor.  Please introduce yourself to me in English and ask me what I wish to discuss.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 4096,
      temperature: 0.5,
      timeout: 20000,
    }),
  } as InvokeModelCommandInput;

  const command = new InvokeModelCommand(input);

  const response = await client.send(command);
  // KRISTIAN_TROUBLESHOOTING - Is the response being parsed ok?  Can't set breakpoints outside of src/...
  console.log('response:')
  console.log(response)

  // Parse the response and return the generated response
  const data = JSON.parse(Buffer.from(response.body).toString());

  // KRISTIAN_TROUBLESHOOTING - It seems to be having trouble reading the [0] indexing of the response
  // Does the data even exist?
  console.log('data:')
  console.log (data)

  return data.content[0].text;
};