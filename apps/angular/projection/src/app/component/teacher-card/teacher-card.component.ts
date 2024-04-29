import { Component, inject } from '@angular/core';
import {
  FakeHttpService,
  randTeacher,
} from '../../data-access/fake-http.service';
// Components
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';
// Store
import { TeacherStore } from '../../data-access/teacher.store';
// Directives
import { CardRowDirective } from '../../ui/card/card-row.directive';

@Component({
  selector: 'app-teacher-card',
  template: `
    <app-card [items]="teachers()" (add)="addTeacher()" class="bg-light-red">
      <img src="assets/img/teacher.png" width="200px" />

      <ng-template [cardRow]="teachers()" let-teacher>
        <app-list-item (delete)="deleteTeacher(teacher.id)">
          {{ teacher.firstName }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  styles: [
    `
      .bg-light-red {
        background-color: rgba(250, 0, 0, 0.1);
      }
    `,
  ],
  standalone: true,
  imports: [CardRowDirective, CardComponent, ListItemComponent],
})
export class TeacherCardComponent {
  private http = inject(FakeHttpService);
  private store = inject(TeacherStore);

  teachers = this.store.teachers;

  constructor() {
    this.http.fetchTeachers$.subscribe((t) => this.store.addAll(t));
  }

  addTeacher() {
    this.store.addOne(randTeacher());
  }

  deleteTeacher(id: number) {
    this.store.deleteOne(id);
  }
}
