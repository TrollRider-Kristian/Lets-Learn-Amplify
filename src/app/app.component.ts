import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, PromptBedrockComponent, SelectTopicForPracticeComponent],
})
export class AppComponent {
  title = 'AI Swedish Whisperer';
  subtitle = 'A Tutor Assistant for Learners of the Swedish Language';
  private _current_topic: string | null = null;
  public get current_topic() {
    return this._current_topic;
  }
  request_new_topic() {
    this._current_topic = null;
  }
  accept_new_topic(new_topic: string | null) {
    this._current_topic = new_topic;
  }
}
