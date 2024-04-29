import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { randText } from '@ngneat/falso';
// Models
import { Todo } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient);

  getAllTodo = () =>
    this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos');

  update = (id: number) =>
    this.http.put<Todo>(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      JSON.stringify({
        todo: id,
        title: randText(),
      }),
      {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );

  delete = (id: number) =>
    this.http.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
}
