import { Component } from '@angular/core';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { PromptBedrockComponent } from './prompt-bedrock/prompt-bedrock.component';
import { SelectTopicForPracticeComponent } from "./select-topic-for-practice/select-topic.component";

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [PromptBedrockComponent, SelectTopicForPracticeComponent],
})
export class AppComponent {
  title = 'AI Swedish Whisperer';
  subtitle = 'A Tutor Assistant for Learners of the Swedish Language';
  current_topic: string | null = "";
  request_new_topic() {
    this.current_topic = '';
  }
  accept_new_topic(new_topic: string | null) {
    this.current_topic = new_topic;
  }
}
