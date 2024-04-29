import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  input,
  output,
} from '@angular/core';
// Directives
import { CardRowDirective } from './card-row.directive';

@Component({
  selector: 'app-card',
  template: `
    <div class="flex w-fit flex-col gap-3 rounded-md border-2 border-black p-4">
      <ng-content select="img" />

      <section>
        @for (item of items(); track item.id) {
          <ng-template
            [ngTemplateOutlet]="rowTemplate()"
            [ngTemplateOutletContext]="{ $implicit: item }"></ng-template>
        }
      </section>

      <button
        class="rounded-sm border border-blue-500 bg-blue-300 p-2"
        (click)="add.emit()">
        Add
      </button>
    </div>
  `,
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent<T extends { id: number }> {
  items = input.required<T[]>();
  add = output();

  // save template reference
  rowTemplate = contentChild.required(CardRowDirective, { read: TemplateRef });
}
