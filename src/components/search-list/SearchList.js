import Movie from '../movie';
import './SearchList.css';
import { TMDBConsumer } from '../tmdb-context';

export default function SearchList({
  searchList,
  getMovieList,
  ratedList,
  currentSearchInput,
  currentPageSearch,
}) {
  function ratingCheck(id) {
    const ratedFilm = ratedList.find((obj) => obj.id === id);
    return ratedFilm ? ratedFilm.rating : 0;
  }
  const films = searchList.map((element) => (
    <li className="movie-card" key={element.id}>
      <TMDBConsumer>
        {({ genreList, guestSessionId, postRating, deleteRating }) => (
          <Movie
            filmLocation="search"
            ratingInSearch={() => ratingCheck(element.id)}
            getMovieList={getMovieList}
            currentSearchInput={currentSearchInput}
            currentPageSearch={currentPageSearch}
            deleteRating={deleteRating}
            postRating={postRating}
            guestSessionId={guestSessionId}
            filmData={element}
            genres={element.genre_ids.map((id) => genreList.find((item) => item.id === id).name)}
          />
        )}
      </TMDBConsumer>
    </li>
  ));
  return <ul className="search-list">{films}</ul>;
}
