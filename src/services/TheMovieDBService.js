/* eslint-disable react/no-unused-class-component-methods */
import { Component } from 'react';

export default class TheMovieDBService extends Component {
  BASE_URL = 'https://api.themoviedb.org/3';

  /* options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjhlNDBkZmQzNTdkMmE1ODc3NDI4OGEwMmFmYmI5OCIsInN1YiI6IjY1OTQ3MzRmMmY4ZDA5NzUwNjM3ZTQ1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wLp794wYQ889PN1PT06WxGDXoyf7E3ObcFWHs6HRvPY',
    },
  }; */

  // 8f8e40dfd357d2a58774288a02afbb98
  // eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjhlNDBkZmQzNTdkMmE1ODc3NDI4OGEwMmFmYmI5OCIsInN1YiI6IjY1OTQ3MzRmMmY4ZDA5NzUwNjM3ZTQ1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wLp794wYQ889PN1PT06WxGDXoyf7E3ObcFWHs6HRvPY

  async getResource(url) {
    const response = await fetch(`${this.BASE_URL}${url}&api_key=8f8e40dfd357d2a58774288a02afbb98`);

    if (!response.ok) {
      throw new Error(
        `Request to ${this.BASE_URL}${url} is ERROR whith '${await response
          .json()
          .then((result) => result.status_message)}'`
      );
    }

    return response.json();
  }

  async getByKeyword(key) {
    if (!key || key.match(/#/)) {
      throw new Error('No valid response');
    }
    const response = await this.getResource(`/search/movie?query=${key}`);
    return response.results;
  }

  async getGenres() {
    const response = await this.getResource('/genre/movie/list?language=en');
    return response.genres;
  }
}
