import { Component, inject } from '@angular/core';
// Services
import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
// Components
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';
// Store
import { CityStore } from '../../data-access/city.store';
// Directives
import { CardRowDirective } from '../../ui/card/card-row.directive';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card [items]="cities()" (add)="addCity()" class="bg-blue-500">
      <img src="assets/img/city.png" width="200px" />

      <ng-template [cardRow]="cities()" let-city>
        <app-list-item (delete)="deleteCity(city.id)">
          {{ city.name }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  imports: [CardRowDirective, CardComponent, ListItemComponent],
})
export class CityCardComponent {
  private http = inject(FakeHttpService);
  private store = inject(CityStore);

  cities = this.store.cities;

  constructor() {
    this.http.fetchCities$.subscribe((s) => this.store.addAll(s));
  }

  addCity() {
    this.store.addOne(randomCity());
  }

  deleteCity(id: number) {
    this.store.deleteOne(id);
  }
}
