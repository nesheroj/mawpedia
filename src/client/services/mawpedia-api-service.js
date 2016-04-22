import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http, Headers, URLSearchParams } from 'angular2/http';

export default class MaWPediaApiService {
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

    return this.isLoading;

  }

  login(token) {

    if (this.isLogged()) {

      return Promise.reject(new Error('Already logged in.'));

    }

    const headers = this._setTokenHeader();

    return this._http.post(`/api/login`, JSON.stringify({ token }), { headers })
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

    return this._http.get(`/api/cards`, { headers, search })
        .map(response => response.json());

  }

  getCardsByArtist(artist, params) {

    const headers = this._setTokenHeader();
    const search = this._setSearchParams(params);

    return this._http.get(`/api/cards/byartist/${artist}`, { headers, search })
        .map(response => response.json());

  }

  getCardByCode(code) {

    const headers = this._setTokenHeader();

    return this._http.get(`/api/cards/${code}`, { headers })
        .map(response => response.json());

  }

  postCard(card) {

    console.log(card);
    const headers = this._setTokenHeader();

    return this._http.post(`/api/cards`, JSON.stringify(card), { headers })
        .map(response => response.json());

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
MaWPediaApiService.parameters = [[Http]];
