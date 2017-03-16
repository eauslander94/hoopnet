import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class IPService {
  constructor(private http: Http) {

  }

  getIPAddress() {
    return new Promise(resolve => {
      this.http.get('https://randomuser.me/api/')
      .subscribe(data => {
        resolve(data.json());
      });
    });
  }
}
