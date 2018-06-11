import { Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

export function authFactory(http: any){
  return new AuthHttp(new AuthConfig(), http);
}
