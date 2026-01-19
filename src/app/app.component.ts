import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PromptBedrockComponent } from './prompt-bedrock/prompt-bedrock.component';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, PromptBedrockComponent],
})
export class AppComponent {
  title = 'amplify-angular-template';
}
