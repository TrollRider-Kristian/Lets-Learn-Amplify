import { Component, OnInit } from '@angular/core';
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
export class TodosComponent implements OnInit {
  todos: any[] = [];
  prompt: string = '';
  answer: string | null = null;

  ngOnInit(): void {
    this.listTodos();
  }

  listTodos() {
    try {
      // KRISTIAN_NOTE - This doesn't return any TODOs unless I deploy this app.
      // Websocket connection to the URL on my amplify_outputs.json file failed because that URL does not exist anymore.
      // The amplify_outupts.json takes its url from the deployed Amplify app and is produced when I deploy said app.
      // This means that I will fail to populate any TODO's every time I want to test locally unless/until I actually deploy my app.
      // That also means every other operation involving a connection to AWS (eg. prompting an AWS Bedrock LLM) will also fail unless I deploy the app.
      client.models.Todo.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.todos = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos from observeQuery', error);
    }
  }

  createTodo() {
    try {
      client.models.Todo.create({
        content: window.prompt('Todo content'),
      });
      this.listTodos();
    } catch (error) {
      console.error('error creating todos', error);
    }
  }

  async sendPrompt() {
    const { data, errors } = await client.queries.tutorSwedish({
      prompt: this.prompt,
    });

    if (!errors) {
      console.log (data);
      this.answer = '';
      this.prompt = '';
    } else {
      console.log(errors);
    }
  }
}
