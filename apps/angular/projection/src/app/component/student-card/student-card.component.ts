import { Component, inject } from '@angular/core';
// Services
import {
  FakeHttpService,
  randStudent,
} from '../../data-access/fake-http.service';
// Components
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';
// Store
import { StudentStore } from '../../data-access/student.store';
// Directives
import { CardRowDirective } from '../../ui/card/card-row.directive';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card [items]="students()" (add)="addStudent()" class="bg-light-green">
      <img src="assets/img/student.webp" width="200px" />
      <ng-template [cardRow]="students()" let-student>
        <app-list-item (delete)="deleteStudent(student.id)">
          {{ student.firstName }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      .bg-light-green {
        background-color: rgba(0, 250, 0, 0.1);
      }
    `,
  ],
  imports: [CardRowDirective, CardComponent, ListItemComponent],
})
export class StudentCardComponent {
  private http = inject(FakeHttpService);
  private store = inject(StudentStore);

  students = this.store.students;

  constructor() {
    this.http.fetchStudents$.subscribe((s) => this.store.addAll(s));
  }

  addStudent() {
    this.store.addOne(randStudent());
  }

  deleteStudent(id: number) {
    this.store.deleteOne(id);
  }
}
