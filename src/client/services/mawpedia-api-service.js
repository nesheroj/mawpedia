import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import jsonpack from 'jsonpack';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

const unpackResponse = response => jsonpack.unpack(window.atob(response));

const packRequest = request => window.btoa(jsonpack.pack(request));

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

    return this._request('post', `/api/login`, packRequest({ token }), new RequestOptions({ headers }))
      .map(response => unpackResponse(response.text()))
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

    return this._request('get', `/api/cards`, new RequestOptions({ headers, search }))
      .map(response => {

        const data = unpackResponse(response.text());
        console.log(data.cards.map(card => card.cost));
        const cards = data.cards;
        cards.total = data.total;
        return cards;

      });

  }

  getCardsByArtist(artist, params) {

    const headers = this._setTokenHeader();
    const search = this._setSearchParams(params);

    return this._request('get', `/api/cards/byartist/${artist}`, new RequestOptions({ headers, search }))
      .map(response => {

        const data = unpackResponse(response.text());
        const cards = data.cards;
        cards.total = data.total;
        return cards;

      });

  }

  getCardByCode(code) {

    const headers = this._setTokenHeader();

    return this._request('get', `/api/cards/${code}`, new RequestOptions({ headers }))
      .map(response => unpackResponse(response.text()));

  }

  postCard(card) {

    const headers = this._setTokenHeader();

    return this._request('post', `/api/cards`, packRequest(card), new RequestOptions({ headers }))
      .map(response => unpackResponse(response.text()));

  }

  removeCard(code) {

    const headers = this._setTokenHeader();

    return this._request('delete', `/api/cards/${code}`, new RequestOptions({ headers }))
      .map(response => unpackResponse(response.text()));

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
