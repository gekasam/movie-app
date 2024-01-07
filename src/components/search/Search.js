import { Component } from 'react';
import debounce from 'lodash/debounce';

import './Search.css';

export default class Search extends Component {
  constructor({ getMovieList }) {
    super();
    this.state = {
      searchInput: 'return',
    };

    this.debouncedFunction = debounce(getMovieList, 500);
  }

  handlerInput(e) {
    this.setState(
      {
        searchInput: e.target.value,
      },
      () => {
        const { searchInput } = this.state;
        this.debouncedFunction(searchInput, 1);
      }
    );
  }

  render() {
    const { searchInput } = this.state;

    return (
      <div className="search-wrapper">
        <input
          name="search-input"
          className="search"
          placeholder="Type to search..."
          value={searchInput}
          onChange={(e) => this.handlerInput(e)}
        />
      </div>
    );
  }
}
