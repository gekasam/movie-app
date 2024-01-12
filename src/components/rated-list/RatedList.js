import Movie from '../movie';
import './RatedList.css';
import { TMDBConsumer } from '../tmdb-context';

export default function RatedList({ ratedList, ratedFilms, getRatedList, currentPageRated }) {
  function ratingRewrite(id) {
    const ratedFilm = ratedFilms.find((obj) => obj.id === id);
    return ratedFilm.value;
  }
  const films = ratedList.map((element) => (
    <li className="movie-card" key={element.id}>
      <TMDBConsumer>
        {({ genreList, guestSessionId, postRating, deleteRating }) => (
          <Movie
            filmLocation="rated"
            rating={() => ratingRewrite(element.id)}
            getRatedList={getRatedList}
            currentPageRated={currentPageRated}
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
  return <ul className="rated-list">{films}</ul>;
}
