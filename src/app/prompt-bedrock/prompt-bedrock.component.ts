import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

@Component({
  selector: 'app-prompt-bedrock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prompt-bedrock.component.html',
  styleUrl: './prompt-bedrock.component.css',
})
export class PromptBedrockComponent {
  prompt: string = '';
  answer: string | null = null;

  // KRISTIAN_NOTE - Websocket connection to the URL on my amplify_outputs.json file failed because that URL does not exist anymore.
  // The amplify_outupts.json takes its url from the deployed Amplify app and is produced when I deploy said app.
  // This means that I will fail to receive a response every time I want to test locally unless/until I actually deploy my app.
  // That also means every other operation involving a connection to AWS (eg. prompting an AWS Bedrock LLM) will also fail unless I deploy the app.
  async sendPrompt() {
    const { data, errors } = await client.queries.tutorSwedish({
      prompt: this.prompt,
    });

    if (!errors) {
      console.log (data); // KRISTIAN_NOTE - If the response doesn't populate correctly in the app, then troubleshoot this console log.
      this.answer = data;
      this.prompt = '';
    } else {
      console.log(errors);
    }
  }
}
