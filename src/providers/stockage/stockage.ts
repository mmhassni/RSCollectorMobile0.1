import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
/*
  Generated class for the StockageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StockageProvider {

  public data: any;

  constructor(public storage: Storage) {


  }


  // set a key/value
  setValue(key: string, value: any) {

    this.storage.set(key, value).then((response) => {
      console.log('set' + key + ' ', response);

      //get Value Saved in key
      this.getValue(key);

    }).catch((error) => {
      console.log('set error for ' + key + ' ', error);
    });

  }

  // get a key/value pair
  getValue(key: string) {
    this.storage.get(key).then((val) => {
      console.log('get ' + key + ' ', val);
      this.data[key] = "";
      this.data[key] = val;
    }).catch((error) => {
      console.log('get error for ' + key + '', error);
    });
  }

  // Remove a key/value pair
  removeKey(key: string) {
    this.storage.remove(key).then(() => {
      console.log('removed ' + key);
      this.data[key] = "";
    }).catch((error) => {
      console.log('removed error for ' + key + '', error);
    });
  }

  traverseKeys() {
    this.storage.forEach((value: any, key: string, iterationNumber: Number) => {
      console.log("key " + key);
      console.log("iterationNumber " + iterationNumber);
      console.log("value " + value);
    });
  }

  // Traverse key/value pairs
  listKeys() {
    this.storage.keys().then((k) => {
      console.table(k)
    });
  }




}
