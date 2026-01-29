import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'select-topic-for-practice',
    templateUrl: 'select-topic.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
})
export class SelectTopicForPracticeComponent {
    user_selected_topic = new FormControl<string | null> (null, Validators.required);
    change_topic = output<string | null>();
    // KRISTIAN_TODO - Do I want this to be an array of strings?
    // Or do I want some id's to go along with this?
    // KRISTIAN_TODO - Do I want this to be public?  Or private with a getter?
    conversation_topics: string[] = []
    submit_new_topic(new_topic: string | null) {
        this.change_topic.emit (new_topic);
    }
}