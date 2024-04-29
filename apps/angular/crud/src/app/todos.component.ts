import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { todoKeys } from './todo.factory';
// Material
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// Models
import { Todo } from './todo.model';
// Services
import { TodoService } from './todo.service';
// Components
import { TodoItemComponent } from './todo.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    TodoItemComponent,
  ],
  selector: 'app-todos',
  template: `
    @switch (todos.status()) {
      @case ('pending') {
        <mat-spinner></mat-spinner>
      }
      @case ('error') {
        Error has occurred: {{ todos.error() }}
      }
      @default {
        <div class="todo-container">
          @for (todo of todos.data(); track todo.id) {
            <app-todo-item [todo]="todo"></app-todo-item>
          }
        </div>
      }
    }
  `,
  styles: [
    `
      .todo-container {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class TodosComponent {
  private todoService = inject(TodoService);

  todos = injectQuery(() => ({
    queryKey: todoKeys.all,
    queryFn: async (): Promise<Array<Todo>> => {
      return lastValueFrom(this.todoService.getAllTodo());
    },
  }));
}
