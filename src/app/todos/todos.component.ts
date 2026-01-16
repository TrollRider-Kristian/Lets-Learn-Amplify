import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent {
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
      // console.log (JSON.parse(data as string)); // KRISTIAN_NOTE - This gives me the JSON object I want.
      console.log (data);
      this.answer = '';
      this.prompt = '';
    } else {
      console.log(errors);
    }
  }
}
