import React, { Component } from 'react';
import { Spin, Alert } from 'antd';

import Search from './components/search';
import SearchList from './components/list';
import TheMovieDBService from './services';
import './App.css';

const tmdb = new TheMovieDBService();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchList: [],
      genreList: [],
      loading: true,
      error: false,
      errorMessage: 'Oops!',
    };

    this.onError = this.onError.bind(this);
    this.getMovieList = this.getMovieList.bind(this);
    this.getGenres = this.getGenres.bind(this);
  }

  componentDidMount() {
    this.getMovieList('return');
    this.getGenres();
  }

  onError(error) {
    this.setState({
      error: true,
      errorMessage: error.message,
      loading: false,
    });
  }

  getMovieList(key) {
    this.setState({
      loading: true,
    });
    tmdb
      .getByKeyword(key)
      .then((result) => {
        if (result.length === 0) {
          throw new Error('No matches');
        }
        this.setState({
          searchList: result,
          loading: false,
          error: false,
        });
      })
      .catch((error) => this.onError(error));
  }

  getGenres() {
    tmdb.getGenres().then((result) => {
      this.setState({
        genreList: result,
      });
    });
  }

  render() {
    const { searchList, genreList, loading, error, errorMessage } = this.state;

    const spinner = loading ? <Spin /> : null;
    const searchContent =
      !loading && !error ? <SearchList searchList={searchList} genreList={genreList} loading={loading} /> : null;
    const errorAlert = error ? <Alert message={errorMessage} /> : null;

    return (
      <div className="app">
        <header className="header">
          <h2 className="tabs">Search</h2>
          <h2 className="tabs">Rate</h2>
        </header>
        <main className="main-container">
          <Search getMovieList={this.getMovieList} />
          {spinner}
          {searchContent}
          {errorAlert}
        </main>
      </div>
    );
  }
}
