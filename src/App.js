import React, { Component } from 'react';
import { Spin, Alert, Pagination } from 'antd';

import Search from './components/search';
import SearchList from './components/search-list';
import RatedList from './components/rated-list';
import TheMovieDBService from './services';
import './App.css';
import { TMDBProvider } from './components/tmdb-context';

const tmdb = new TheMovieDBService();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTab: 'search',
      displayTabView: 'search',
      searchList: [],
      genreList: [],
      loading: true,
      errorSearch: false,
      errorRated: false,
      errorMessage: 'Oops!',
      totalPagesSearch: 0,
      totalPagesRated: 0,
      currentPageSearch: 1,
      currentPageRated: 1,
      currentSearchInput: 'return',
      guestSessionId: '',
      ratedList: [],
    };

    this.onError = this.onError.bind(this);
    this.getMovieList = this.getMovieList.bind(this);
    this.getGenres = this.getGenres.bind(this);
    this.getRatedList = this.getRatedList.bind(this);
    this.postRating = this.postRating.bind(this);
    this.deleteRating = this.deleteRating.bind(this);
  }

  componentDidMount() {
    this.getMovieList('return', 1);
    this.getGenres();
    this.createGuest();
  }

  handlerTabToggle(value) {
    if (value === 'rated') {
      this.getRatedList(1);
      clearTimeout(this.timer);
      this.setState(
        {
          displayTab: value,
          errorRated: false,
        },
        () => {
          this.timer = setTimeout(() => {
            this.setState(({ displayTab }) => ({
              displayTabView: displayTab,
            }));
          }, 200);
        }
      );
    } else {
      const { currentSearchInput: currenSearchInput, currentPageSearch } = this.state;
      this.getMovieList(currenSearchInput, currentPageSearch);
      clearTimeout(this.timer);
      this.setState(
        {
          displayTab: value,
          errorSearch: false,
        },
        () => {
          this.timer = setTimeout(() => {
            this.setState(({ displayTab }) => ({
              displayTabView: displayTab,
            }));
          }, 200);
        }
      );
    }
  }

  onError(error, filmLocation) {
    if (filmLocation === 'search') {
      this.setState({
        errorSearch: true,
        errorMessage: error.message,
        loading: false,
      });
    } else {
      this.setState({
        errorRated: true,
        errorMessage: error.message,
        loading: false,
      });
    }
  }

  getRatedList(page, filmLocation) {
    const { guestSessionId } = this.state;

    if (filmLocation === 'search') {
      this.setState({
        loading: true,
      });
      tmdb
        .getRatedList(guestSessionId, page)
        .then((result) => {
          if (result.results.length === 0) {
            this.setState({
              ratedList: result.results,
            });
            /* throw new Error('No films rated'); */
          }
          /* console.log('im here', result.results); */
          this.setState({
            ratedList: result.results,
            loading: false,
            errorSearch: false,
            totalPagesRated: result.total_pages,
            currentPageRated: page,
          });
        })
        .catch((error) => this.onError(error, filmLocation));
    } else {
      this.setState({
        loading: true,
      });
      tmdb
        .getRatedList(guestSessionId, page)
        .then((result) => {
          if (result.results.length === 0) {
            this.setState({
              ratedList: result.results,
            });
            throw new Error('No films rated');
          }
          this.setState({
            ratedList: result.results,
            loading: false,
            errorRated: false,
            totalPagesRated: result.total_pages,
            currentPageRated: page,
          });
        })
        .catch((error) => this.onError(error, filmLocation));
    }
  }

  getMovieList(key, page, filmLocation) {
    if (filmLocation === 'search') {
      this.setState({
        loading: true,
      });
      tmdb
        .getByKeyword(key, page)
        .then((result) => {
          if (result.results.length === 0) {
            throw new Error('No matches found');
          }
          this.setState({
            searchList: result.results,
            loading: false,
            errorSearch: false,
            totalPagesSearch: result.total_pages,
            currentSearchInput: key,
            currentPageSearch: page,
          });
        })
        .catch((error) => this.onError(error, filmLocation));
    } else {
      this.setState({
        loading: true,
      });
      tmdb
        .getByKeyword(key, page)
        .then((result) => {
          if (result.results.length === 0) {
            throw new Error('No matches found');
          }
          this.setState({
            searchList: result.results,
            loading: false,
            errorRated: false,
            totalPagesSearch: result.total_pages,
            currentSearchInput: key,
            currentPageSearch: page,
          });
        })
        .catch((error) => this.onError(error, filmLocation));
    }
  }

  getGenres() {
    tmdb.getGenres().then((result) => {
      this.setState({
        genreList: result,
      });
    });
  }

  postRating(movieId, value, filmLocation) {
    const { guestSessionId, /* currentSearchInput, currentPageSearch, */ currentPageRated } =
      this.state;
    tmdb.postRating(guestSessionId, movieId, value).then(() => {
      /* if (filmLocation === 'search') {
        this.getMovieList(currentSearchInput, currentPageSearch, filmLocation);
      } */
      this.getRatedList(currentPageRated, filmLocation);
    });
  }

  deleteRating(movieId, filmLocation) {
    const { guestSessionId, /* currentSearchInput, currentPageSearch, */ currentPageRated } =
      this.state;
    tmdb.deleteRating(guestSessionId, movieId).then(() => {
      /* if (filmLocation === 'search') {
        this.getMovieList(currentSearchInput, currentPageSearch, filmLocation);
      } */
      this.getRatedList(currentPageRated, filmLocation);
    });
  }

  createGuest() {
    tmdb.createGuestSession().then((result) => {
      this.setState({
        guestSessionId: result.guest_session_id,
      });
    });
  }

  render() {
    const {
      displayTab,
      displayTabView,
      searchList,
      genreList,
      loading,
      errorSearch,
      errorRated,
      errorMessage,
      totalPagesSearch,
      totalPagesRated,
      currentPageSearch,
      currentPageRated,
      currentSearchInput,
      guestSessionId,
      ratedList,
    } = this.state;

    const spinner = loading ? <Spin /> : null;
    const searchContent =
      !loading && !errorSearch ? (
        <SearchList
          ratedList={ratedList}
          searchList={searchList}
          getMovieList={this.getMovieList}
          currentSearchInput={currentSearchInput}
          currentPageSearch={currentPageSearch}
        />
      ) : null;
    const ratedContent =
      !loading && !errorRated ? (
        <RatedList
          ratedList={ratedList}
          getRatedList={this.getRatedList}
          currentPageRated={currentPageRated}
        />
      ) : null;
    const paginationSearch = !errorSearch ? (
      <Pagination
        className="pagination"
        current={currentPageSearch}
        total={totalPagesSearch}
        showSizeChanger={false}
        onChange={(page) => this.getMovieList(currentSearchInput, page)}
      />
    ) : null;
    const paginationRated = !errorRated ? (
      <Pagination
        className="pagination"
        current={currentPageRated}
        total={totalPagesRated}
        showSizeChanger={false}
        onChange={(page) => this.getRatedList(page)}
      />
    ) : null;
    const errorAlertSearch = errorSearch ? <Alert message={errorMessage} /> : null;
    const errorAlertRated = errorRated ? <Alert message={errorMessage} /> : null;
    return (
      <TMDBProvider
        value={{
          genreList,
          guestSessionId,
          postRating: this.postRating,
          deleteRating: this.deleteRating,
        }}
      >
        <div className="app">
          <header className="header">
            <div className="tabs-wrapper">
              <button
                type="button"
                className={`tab-button tab-button__right${
                  displayTab === 'search' ? ' tab-button__right-active tab-button__active' : ''
                }`}
                onClick={() => this.handlerTabToggle('search')}
              >
                Search
              </button>
              <button
                type="button"
                className={`tab-button tab-button__left${
                  displayTab === 'rated' ? ' tab-button__left-active  tab-button__active' : ''
                }`}
                onClick={() => this.handlerTabToggle('rated')}
              >
                Rate
              </button>
            </div>
          </header>
          <main className="main-container">
            {displayTabView === 'search' ? (
              <div
                className={`tab search-tab${displayTab === 'search' ? ' search-tab__active' : ''}`}
              >
                <Search currentSearchInput={currentSearchInput} getMovieList={this.getMovieList} />
                {spinner}
                {searchContent}
                {errorAlertSearch}
                {paginationSearch}
              </div>
            ) : (
              <div className={`tab rated-tab${displayTab === 'rated' ? ' rated-tab__active' : ''}`}>
                {spinner}
                {ratedContent}
                {errorAlertRated}
                {paginationRated}
              </div>
            )}
          </main>
        </div>
      </TMDBProvider>
    );
  }
}
