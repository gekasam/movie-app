import React, { Component } from 'react';
import { Spin, Alert, Pagination } from 'antd';
import classNames from 'classnames';

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
      ratedFilms: [],
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
  /* TODO: what happ  */

  handlerTabToggle(value) {
    const { currentSearchInput, currentPageSearch } = this.state;
    let errorState;

    if (value === 'rated') {
      this.getRatedList(1, 'rated');
      errorState = 'errorRated';
    } else {
      this.getMovieList(currentSearchInput, currentPageSearch, 'search');
      errorState = 'errorSearch';
    }

    clearTimeout(this.timer);
    this.setState(
      {
        displayTab: value,
        [errorState]: false,
      },
      () => {
        this.timer = setTimeout(() => {
          this.setState(({ displayTab: prevDisplayTab }) => ({
            displayTabView: prevDisplayTab,
          }));
        }, 200);
      }
    );
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
          if (filmLocation === 'rated') {
            throw new Error('No films rated');
          }
        }
        this.setState({
          ratedList: result.results,
          loading: false,
          errorSearch: false,
          totalPagesRated: result.total_pages,
          currentPageRated: page,
        });
      })
      .catch((error) => this.onError(error, filmLocation));
  }

  getMovieList(key, page, filmLocation) {
    this.setState({
      loading: true,
      currentSearchInput: key,
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
          currentPageSearch: page,
        });
      })
      .catch((error) => this.onError(error, filmLocation));
  }

  getGenres() {
    tmdb.getGenres().then((result) => {
      this.setState({
        genreList: result,
      });
    });
  }

  postRating(movieId, value /* filmLocation */) {
    const { guestSessionId /* currentSearchInput, currentPageSearch, currentPageRated */ } =
      this.state;
    tmdb.postRating(guestSessionId, movieId, value).then((/* res */) => {
      this.setState(({ ratedFilms }) => {
        const newRatedFilms = [...ratedFilms];
        const ratedIdx = newRatedFilms.findIndex((object) => object.id === movieId);

        if (ratedIdx >= 0) {
          newRatedFilms[ratedIdx].value = value;
          return {
            ratedFilms: newRatedFilms,
          };
        }
        newRatedFilms.push({ id: movieId, value });
        return {
          ratedFilms: newRatedFilms,
        };
      });
      /* this.getMovieList(currentSearchInput, currentPageSearch, filmLocation);
      this.getRatedList(currentPageRated, filmLocation); */
    });
  }

  deleteRating(movieId /* , filmLocation */) {
    const { guestSessionId /* currentSearchInput, currentPageSearch, currentPageRated  */ } =
      this.state;
    tmdb.deleteRating(guestSessionId, movieId).then(() => {
      this.setState(({ ratedFilms }) => {
        const newRatedFilms = [...ratedFilms];
        const ratedIdx = newRatedFilms.findIndex((object) => object.id === movieId);

        newRatedFilms[ratedIdx].value = 0;
        return {
          ratedFilms: newRatedFilms,
        };
      });
      /* this.getMovieList(currentSearchInput, currentPageSearch, filmLocation);
      this.getRatedList(currentPageRated, filmLocation); */
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
      ratedFilms,
    } = this.state;

    const spinner = loading ? <Spin className="spinner" /> : null;
    const searchContent =
      !loading && !errorSearch ? (
        <SearchList
          ratedList={ratedList}
          ratedFilms={ratedFilms}
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
          ratedFilms={ratedFilms}
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
    const tabButtoRightClasses = classNames('tab-button', 'tab-button__right', {
      'tab-button__right-active': displayTab === 'search',
      'tab-button__active': displayTab === 'search',
    });
    const tabButtonLeftClasses = classNames('tab-button', 'tab-button__left', {
      'tab-button__left-active': displayTab === 'rated',
      'tab-button__active': displayTab === 'rated',
    });
    const tabSearchClasses = classNames('tab', 'search-tab', {
      'search-tab__active': displayTab === 'search',
    });
    const tabRatedClasses = classNames('tab', 'rated-tab', {
      'rated-tab__active': displayTab === 'rated',
    });

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
                className={tabButtoRightClasses}
                onClick={() => displayTab !== 'search' && this.handlerTabToggle('search')}
              >
                Search
              </button>
              <button
                type="button"
                className={tabButtonLeftClasses}
                onClick={() => displayTab !== 'rated' && this.handlerTabToggle('rated')}
              >
                Rate
              </button>
            </div>
          </header>
          <main className="main-container">
            {displayTabView === 'search' ? (
              <div className={tabSearchClasses}>
                <Search currentSearchInput={currentSearchInput} getMovieList={this.getMovieList} />
                {spinner}
                {searchContent}
                {errorAlertSearch}
                {paginationSearch}
              </div>
            ) : (
              <div className={tabRatedClasses}>
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
