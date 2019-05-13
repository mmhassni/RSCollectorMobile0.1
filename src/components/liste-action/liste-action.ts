import { Component } from '@angular/core';

/**
 * Generated class for the ListeActionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'liste-action',
  templateUrl: 'liste-action.html'
})
export class ListeActionComponent {

  text: string;

  constructor() {
    console.log('Hello ListeActionComponent Component');
    this.text = 'Hello World';
  }

}
