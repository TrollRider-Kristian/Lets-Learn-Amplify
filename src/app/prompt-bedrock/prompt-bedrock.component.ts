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
  styleUrl: './prompt-bedrock.component.scss',
})
export class PromptBedrockComponent implements OnInit {
  @Input({ required: true }) topic!: string | null;
  @Input({ required: false }) is_custom_user_question!: boolean | null;
  change_topic = output<void>();
  current_question: string = '';
  user_response: string = '';
  feedback: string | null = null;
  feedback_is_loading: boolean = false;
  question_is_loading: boolean = false;

  // KRISTIAN_NOTE - Websocket connection to the URL on my amplify_outputs.json file failed because that URL does not exist anymore.
  // The amplify_outupts.json takes its url from the deployed Amplify app and is produced when I deploy said app.
  // This means that I will fail to receive a response every time I want to test locally unless/until I actually deploy my app.
  // That also means every other operation involving a connection to AWS (eg. prompting an AWS Bedrock LLM) will also fail unless I deploy the app.
  ngOnInit() {
    this.pose_question_based_on_topic(); // send prompt for initial question
  }

  // Take the topic and request a question from the LLM as a prompt.
  async pose_question_based_on_topic () {
    this.question_is_loading = true;

    if (this.is_custom_user_question === true) {
      this.current_question = typeof(this.topic) === 'string' ? this.topic : '';
    } else {
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

    this.question_is_loading = false;
  }

  // KRISTIAN_TODO - How do I call this to test any question and answer pair?
  // Do I support another component and call from the outside?
  // Do I support loading question-answer pairs from file and print out a list of feedbacks?
  // How to go about this in my app? 
  async solicit_feedback_for_given_question_and_response (question: string, response: string) {
    let prompt_with_response = 'Given the question of: ' + question +
      ', please provide feedback in English to the spelling and grammatical mistakes of each word in the following ' +
      ' user response: ' + response + ', and generate some keywords for the linguistic concepts related to the user\'s mistakes' +
      'as discussed by the feedback.';
      
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

  async solicit_feedback_for_response () {
    this.solicit_feedback_for_given_question_and_response (this.current_question, this.user_response);
  }

  request_another_topic() {
    this.change_topic.emit();
  }
}
