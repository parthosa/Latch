import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

/*
  Generated class for the HttpUtils provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
  	*/
@Injectable()
export class HttpService {

	constructor(public http: Http) {
		console.log('Hello HttpUtils Provider');
	}


	getData(url){
		return this.http.get(url)
		.toPromise()
		.then(res => res.json())
		.catch(this.handleError);
	}

	postData(url,data,contentType = "text/plain",authorizationToken = false){
		let headers;
		if(authorizationToken == false)
			headers = new Headers({ 'Content-Type': contentType });
		else
			headers = new Headers({ 'Content-Type': contentType ,'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MGZhY2NiOS05Mzk1LTQ2YzItYmFkNy03OTA0NzUyMGIwYTMifQ.eZZzaJkmlWZSJxc8de7xGs-o99rryxR6tAIt51eQzXc'});
		let options = new RequestOptions({ headers: headers });

		return this.http.post(url, data, options)
		.toPromise()
		.then(res => res.json())
		.catch(this.handleError);
	}

	private handleError (error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}
}
