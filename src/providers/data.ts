import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class Data {

  items: any;
  searchTerm: string = '';

  constructor() {
    this.items = [
      {name: "Allen Iverson"},
      {name: "Kobe Bryant"},
      {name: "Dylan Schultz"},
      {name: "Joel Embiid"},
      {name: "Eli Auslander"},
      {name: "Steph Curry"},
      {name: "Ben Simmons"},
      {name: "Dikembe Mutumbo"},
      {name: "Markelle Fultz"},
      {name: "Michael Jordan"},
    ]
  }

  // Post:  items is filtered by the searchTerm 
  // Param: string to filter by
  // Returns: filtered version of items
  filterItems(searchTerm: string){

    return this.items.filter((item) => {
      // Return true if item matches the searchterm(both lowercased)
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    })
  }

}
