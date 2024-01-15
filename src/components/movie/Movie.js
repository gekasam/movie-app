import { format } from 'date-fns';
import { Rate } from 'antd';
import classNames from 'classnames';

import './Movie.css';

export default function Movie({
  filmData: {
    id,
    poster_path: posterPath,
    title,
    overview,
    release_date: releaseDate,
    vote_average: voteAverage,
  },
  rating,
  genres,
  postRating,
  deleteRating,
  ratingInSearch,
  filmLocation,
}) {
  const genreItems = genres.map((genre) => (
    <li key={`genre${genre}${id}`} className="genre">
      {genre}
    </li>
  ));
  const voteClasses = classNames('vote', {
    'vote--min': voteAverage < 3,
    'vote--min-mid': voteAverage >= 3 && voteAverage < 5,
    'vote--max-mid': voteAverage >= 5 && voteAverage < 7,
    'vote--max': voteAverage >= 7,
  });
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
    if (value !== 0) {
      return postRating(id, value, filmLocation);
    }
    return deleteRating(id, filmLocation);
  }

  // function voteToQuaternary() {
  //   if (voteAverage < 3) {
  //     return '--min';
  //   }
  //   if (voteAverage < 5) {
  //     return '--min-mid';
  //   }
  //   if (voteAverage < 7) {
  //     return '--max-mid';
  //   }
  //   return '--max';
  // }
  return (
    <div className="movie">
      <img className="poster" src={getImageAddres()} alt={`Poster to film ${title}`} />
      <div className="film-data">
        <div className="data-no-rate-wrapper">
          <div className="film-head">
            <h2 className="title">{title}</h2>
            <div className={/* `vote vote${voteToQuaternary()}` */ voteClasses}>
              {+voteAverage.toFixed(1)}
            </div>
          </div>
          <span className="release-date">
            {releaseDate
              ? format(releaseDate, 'MMMM d, yyyy')
              : 'The release date is not specified'}
          </span>
          <ul className="genres">{genreItems}</ul>
          <p className="movie-description">{textCutter(overview)}</p>
        </div>
        <Rate
          defaultValue={filmLocation === 'search' ? ratingInSearch : rating}
          allowHalf
          count={10}
          onChange={(value) => handlerRate(value)}
          className="rate"
        />
      </div>
    </div>
  );
}
