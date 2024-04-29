import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// TanStack
import { injectMutation } from '@tanstack/angular-query-experimental';
// RxJS
import { lastValueFrom } from 'rxjs';
// Services
import { TodoService } from './todo.service';
// Models
import { todoKeys } from './todo.factory';
import { Todo } from './todo.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatProgressSpinnerModule],
  selector: 'app-todo-item',
  template: `
    @if (updateTodo.isPending() || deleteTodo.isPending()) {
      <mat-spinner [diameter]="20" color="blue" />
    }
    @if (updateTodo.isError()) {
      An error has occured: {{ updateTodo.error() }}
    }
    @if (deleteTodo.isError()) {
      An error has occured: {{ deleteTodo.error() }}
    }
    @if (todoSignal() && !updateTodo.isPending() && !deleteTodo.isPending()) {
      {{ todoSignal()!.title }}
      <button (click)="update(todoSignal()!.id)">Update</button>
      <button (click)="delete(todoSignal()!.id)">Delete</button>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        gap: 3px;
        .error {
          color: red;
        }
      }
    `,
  ],
})
export class TodoItemComponent {
  private todoService = inject(TodoService);

  todoSignal: WritableSignal<Todo | undefined> = signal(undefined);

  @Input({ required: true }) set todo(todo: Todo) {
    this.todoSignal.set(todo);
  }

  updateTodo = injectMutation((client) => ({
    mutationFn: (todoId: number) =>
      lastValueFrom(this.todoService.update(todoId)),
    onSuccess: (todo: Todo) => {
      client.setQueryData(todoKeys.all, (oldData: Todo[]) =>
        oldData
          ? oldData.map((t) => (t.id === todo.id ? { ...todo } : t))
          : oldData,
      );
    },
  }));

  deleteTodo = injectMutation((client) => ({
    mutationFn: (todoId: number) =>
      lastValueFrom(this.todoService.delete(todoId)),
    onSuccess: (_, todoId: number) => {
      client.setQueryData(todoKeys.all, (oldData: Todo[]) =>
        oldData ? oldData.filter((t) => t.id !== todoId) : oldData,
      );
    },
  }));

  update(todoId: number) {
    this.updateTodo.mutate(todoId);
  }

  delete(todoId: number) {
    this.deleteTodo.mutate(todoId);
  }
}
