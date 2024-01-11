/* eslint-disable react/no-unused-class-component-methods */
import { Component } from 'react';

export default class TheMovieDBService extends Component {
  BASE_URL = 'https://api.themoviedb.org/3';

  // 8f8e40dfd357d2a58774288a02afbb98
  // eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjhlNDBkZmQzNTdkMmE1ODc3NDI4OGEwMmFmYmI5OCIsInN1YiI6IjY1OTQ3MzRmMmY4ZDA5NzUwNjM3ZTQ1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wLp794wYQ889PN1PT06WxGDXoyf7E3ObcFWHs6HRvPY

  async getResource(url) {
    const response = await fetch(`${this.BASE_URL}${url}api_key=8f8e40dfd357d2a58774288a02afbb98`);

    if (!response.ok) {
      throw new Error(
        `Request to ${this.BASE_URL}${url} is ERROR whith '${await response
          .json()
          .then((result) => result.status_message)}'`
      );
    }

    return response.json();
  }

  async getByKeyword(key, page) {
    if (!key || key.match(/#/)) {
      throw new Error('No valid response');
    }
    const response = await this.getResource(`/search/movie?query=${key}&page=${page}&`);
    return response;
  }

  async getRatedList(guestSessionId, page) {
    const response = await this.getResource(
      `/guest_session/${guestSessionId}/rated/movies?page=${page}&`
    );
    return response;
  }

  async getGenres() {
    const response = await this.getResource('/genre/movie/list?language=en&');
    return response.genres;
  }

  async createGuestSession() {
    const response = await this.getResource('/authentication/guest_session/new?');
    return response;
  }

  // eslint-disable-next-line class-methods-use-this
  async postRating(sessionId, movieId, value) {
    const optionsPost = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: `{"value":${value}}`,
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}&api_key=8f8e40dfd357d2a58774288a02afbb98`,
      optionsPost
    );
    return response.json();
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteRating(sessionId, movieId) {
    const optionsPost = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}&api_key=8f8e40dfd357d2a58774288a02afbb98`,
      optionsPost
    );
    return response.json();
  }
}
