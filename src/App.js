import React, { Component } from 'react';
import { Spin, Alert, Pagination } from 'antd';

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
      totalPages: 0,
      currentPage: 1,
      currenSearchInput: '',
    };

    this.onError = this.onError.bind(this);
    this.getMovieList = this.getMovieList.bind(this);
    this.getGenres = this.getGenres.bind(this);
  }

  componentDidMount() {
    this.getMovieList('return', 1);
    this.getGenres();
  }

  onError(error) {
    this.setState({
      error: true,
      errorMessage: error.message,
      loading: false,
    });
  }

  getMovieList(key, page) {
    this.setState({
      loading: true,
    });
    tmdb
      .getByKeyword(key, page)
      .then((result) => {
        if (result.length === 0) {
          throw new Error('No matches found');
        }
        this.setState({
          searchList: result.results,
          loading: false,
          error: false,
          totalPages: result.total_pages,
          currenSearchInput: key,
          currentPage: page,
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
    const { searchList, genreList, loading, error, errorMessage, totalPages, currentPage, currenSearchInput } =
      this.state;
    const spinner = loading ? <Spin /> : null;
    const searchContent =
      !loading && !error ? <SearchList searchList={searchList} genreList={genreList} loading={loading} /> : null;
    const pagination = !error ? (
      <Pagination
        className="pagination"
        current={currentPage}
        total={totalPages}
        showSizeChanger={false}
        onChange={(page) => this.getMovieList(currenSearchInput, page)}
      />
    ) : null;
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
          {pagination}
        </main>
      </div>
    );
  }
}
