import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import { Injectable } from 'angular2/core';
import { Http, Headers, URLSearchParams } from 'angular2/http';

@Injectable()
class MaWPediaApiService {

  static parameters = [[Http]];

  _requests = new Set();

  constructor(http) {

    this._http = http;
    const apiToken = window.localStorage.getItem('apiToken');
    if (apiToken) {

      this._apiToken = apiToken;

    }

  }

  isLogged() {

    return typeof this._apiToken !== 'undefined';

  }

  isLoading() {

    return this._requests.size;

  }

  login(token) {

    if (this.isLogged()) {

      return Promise.reject(new Error('Already logged in.'));

    }

    const headers = this._setTokenHeader();

    return this._request('get', `/api/login`, JSON.stringify({ token }), { headers })
      .map(response => response.json())
      .toPromise()
      .then(result => {

        this._apiToken = result.token;
        window.localStorage.setItem('apiToken', result.token);

      });

  }

  logout() {

    if (this.isLogged()) {

      this._apiToken = undefined;
      window.localStorage.removeItem('apiToken');
      return Promise.resolve('Logged Out');

    }

    return Promise.reject(new Error('Not logged in.'));

  }

  getCards(params) {

    const headers = this._setTokenHeader();
    const search = this._setSearchParams(params);

    return this._request('get', `/api/cards`, { headers, search })
      .map(response => response.json());

  }

  getCardsByArtist(artist, params) {

    const headers = this._setTokenHeader();
    const search = this._setSearchParams(params);

    return this._request('get', `/api/cards/byartist/${artist}`, { headers, search })
      .map(response => response.json());

  }

  getCardByCode(code) {

    const headers = this._setTokenHeader();

    return this._request('get', `/api/cards/${code}`, { headers })
      .map(response => response.json());

  }

  postCard(card) {

    console.log(card);
    const headers = this._setTokenHeader();

    return this._request('post', `/api/cards`, JSON.stringify(card), { headers })
      .map(response => response.json());

  }

  _request(verb, ...params) {

    const request = this._http[verb](...params);
    this._requests.add(request);

    const onError = error => {

      console.error(error);
      this._requests.delete(request);

    };

    const onComplete = () => {

      this._requests.delete(request);

    };

    return request
    .do(() => {}, onError, onComplete);

  }

  _setTokenHeader() {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (this._apiToken) {

      headers.append('Authorization', `Bearer ${this._apiToken}`);

    }

    return headers;

  }

  _setSearchParams(params) {

    const searchParams = new URLSearchParams();
    if (params) {

      Object.keys(params).forEach(paramKey => searchParams.set(paramKey, params[paramKey]));

    }

    return searchParams;

  }

}

export default MaWPediaApiService;
