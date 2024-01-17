import Movie from '../Movie';
import './SearchList.css';
import { TMDBConsumer } from '../TmdbContext';

export default function SearchList({ searchList, ratedFilms }) {
  function ratingCheck(id) {
    const ratedFilm = ratedFilms.find((obj) => obj.id === id);
    return ratedFilm ? ratedFilm.value : 0;
  }
  const films = searchList.map((element) => (
    <li className="movie-card" key={element.id}>
      <TMDBConsumer>
        {({ genreList, postRating, deleteRating }) => (
          <Movie
            filmLocation="search"
            ratingInSearch={() => ratingCheck(element.id)}
            deleteRating={deleteRating}
            postRating={postRating}
            filmData={element}
            genres={element.genre_ids.map((id) => genreList.find((item) => item.id === id).name)}
          />
        )}
      </TMDBConsumer>
    </li>
  ));
  return <ul className="search-list">{films}</ul>;
}
