import { format } from 'date-fns';

import './Movie.css';

export default function Movie({ filmData, genres }) {
  const genreItems = genres.map((genre) => (
    <button key={`genre${genre}${filmData.id}`} type="button" className="genre-button">
      {genre}
    </button>
  ));
  function getImageAddres() {
    if (filmData.backdrop_path !== null) {
      return `https://image.tmdb.org/t/p/w780/${filmData.poster_path}`;
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
  return (
    <div className="movie">
      <img className="poster" src={getImageAddres()} alt={`Poster to film ${filmData.title}`} />
      <div className="film-data">
        <h2 className="title">{filmData.title}</h2>
        <span className="release-date">
          {filmData.release_date ? format(filmData.release_date, 'MMMM d, yyyy') : 'The release date is not specified'}
        </span>
        <ul className="genre-list">{genreItems}</ul>
        <p className="movie-description">{textCutter(filmData.overview)}</p>
      </div>
    </div>
  );
}
