import { format } from 'date-fns';
import { Rate } from 'antd';

import './Movie.css';

export default function Movie({
  filmData: {
    id,
    poster_path: posterPath,
    title,
    overview,
    release_date: releaseDate,
    vote_average: voteAverage,
    rating = 0,
  },
  genres,
  postRating,
  /* guestSessionId, */
  deleteRating,
  ratingInSearch,
  /* getRatedList,
  currentPageRated,
  getMovieList,
  currentSearchInput,
  currentPageSearch, */
  filmLocation,
}) {
  const genreItems = genres.map((genre) => (
    <button key={`genre${genre}${id}`} type="button" className="genre-button">
      {genre}
    </button>
  ));
  function getImageAddres() {
    if (posterPath !== null) {
      return `https://image.tmdb.org/t/p/w780/${posterPath}`;
    }
    return `${process.env.PUBLIC_URL}/zaglushka.png`;
  }

  function textCutter(text) {
    if (text.length > 200) {
      const newText = text.replace(/^(.{200}\w*).*/, '$1 ...');
      return newText;
    }
    return text;
  }

  function handlerRate(value) {
    /* if (filmLocation === 'rated') {
      if (value !== 0) {
        return postRating(guestSessionId, id, value).then(() => {
          getRatedList(currentPageRated);
        });
      }
      return deleteRating(guestSessionId, id).then(() => {
        getRatedList(currentPageRated);
      });
    } */
    if (value !== 0) {
      return postRating(id, value, filmLocation) /* .then(() => {
        console.log(currentSearchInput);
        getMovieList(currentSearchInput, currentPageSearch);
      }) */;
    }
    return deleteRating(id, filmLocation) /* .then(() => {
      getMovieList(currentSearchInput, currentPageSearch);
    }) */;
  }

  function voteToQuaternary() {
    if (voteAverage < 3) {
      return '-min';
    }
    if (voteAverage < 5) {
      return '-min-mid';
    }
    if (voteAverage < 7) {
      return '-max-mid';
    }
    return '-max';
  }

  return (
    <div className="movie">
      <img className="poster" src={getImageAddres()} alt={`Poster to film ${title}`} />
      <div className="film-data">
        <div className="data-no-rate-wrapper">
          <div className="film-head">
            <h2 className="title">{title}</h2>
            <div className={`vote vote${voteToQuaternary()}`}>{+voteAverage.toFixed(1)}</div>
          </div>
          <span className="release-date">
            {releaseDate
              ? format(releaseDate, 'MMMM d, yyyy')
              : 'The release date is not specified'}
          </span>
          <ul className="genre-list">{genreItems}</ul>
          <p className="movie-description">{textCutter(overview)}</p>
        </div>
        <Rate
          defaultValue={rating || ratingInSearch}
          allowHalf
          count={10}
          onChange={(value) => handlerRate(value)}
          className="rate"
        />
      </div>
    </div>
  );
}
