import { Component, Input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

@Component({
  selector: 'app-prompt-bedrock',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './prompt-bedrock.component.html',
  styleUrl: './prompt-bedrock.component.css',
})
export class PromptBedrockComponent implements OnInit {
  @Input({ required: true }) topic!: string | null;
  change_topic = output<void>();
  current_question: string = '';
  user_response: string = '';
  feedback: string | null = null;
  feedback_is_loading: boolean = false;

  // KRISTIAN_NOTE - Websocket connection to the URL on my amplify_outputs.json file failed because that URL does not exist anymore.
  // The amplify_outupts.json takes its url from the deployed Amplify app and is produced when I deploy said app.
  // This means that I will fail to receive a response every time I want to test locally unless/until I actually deploy my app.
  // That also means every other operation involving a connection to AWS (eg. prompting an AWS Bedrock LLM) will also fail unless I deploy the app.
  ngOnInit() {
    this.pose_question_based_on_topic(); // send prompt for initial question
  }

  // Take the topic and request a question from the LLM as a prompt.
  async pose_question_based_on_topic () {
    let prompt_to_ask = 'Please ask me a question in Swedish about: ' + this.topic + '.';
    if (this.user_response.length > 0) {
      prompt_to_ask += 'Please make this question a follow-up to our user\'s last response of: ' + this.user_response + '.';
      this.user_response = '';
    }

    // KRISTIAN_TODO - Do I throw an error if the user gives an empty response?  Leaning towards no for now...
    const { data, errors } = await client.queries.tutorSwedish({
      prompt: prompt_to_ask,
    });

    if (!errors) {
      console.log (data); // KRISTIAN_NOTE - If the response doesn't populate correctly in the app, then troubleshoot this console log.
      this.current_question = data !== null ? data : '';
    } else {
      console.log (errors);
    }
  }

  // KRISTIAN_TODO - What user-event should we use to submit our response and call this function?
  // KRISTIAN_TODO - Explicitly specify ALL feedback criteria based on the Swedish concepts I have learned thus far.
  // Use each one as an example (eg. sitt vs. sin for possessive pronouns) -> Do I need to do this?
  async solicit_feedback_for_response () {
    let prompt_with_response = 'Given the question of: ' + this.current_question +
      ', please provide feedback in English to the spelling and grammatical mistakes of each word in the following ' +
      ' user response: ' + this.user_response;
      
    this.feedback_is_loading = true;

    const { data, errors } = await client.queries.tutorSwedish({
      prompt: prompt_with_response,
    });

    if (!errors) {
      console.log (data); // KRISTIAN_NOTE - If the response doesn't populate correctly in the app, then troubleshoot this console log.
      this.feedback = data;
      this.user_response = '';
    } else {
      console.log(errors);
    }
    this.feedback_is_loading = false;
  }

  request_another_topic() {
    this.change_topic.emit();
  }
}
