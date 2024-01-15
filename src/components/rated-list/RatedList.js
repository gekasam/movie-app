import Movie from '../movie';
import './RatedList.css';
import { TMDBConsumer } from '../tmdb-context';

export default function RatedList({ ratedList, ratedFilms }) {
  function ratingRewrite(id) {
    const ratedFilm = ratedFilms.find((obj) => obj.id === id);
    return ratedFilm.value;
  }
  const films = ratedList.map((element) => (
    <li className="movie-card" key={element.id}>
      <TMDBConsumer>
        {({ genreList, postRating, deleteRating }) => (
          <Movie
            filmLocation="rated"
            rating={() => ratingRewrite(element.id)}
            deleteRating={deleteRating}
            postRating={postRating}
            filmData={element}
            genres={element.genre_ids.map((id) => genreList.find((item) => item.id === id).name)}
          />
        )}
      </TMDBConsumer>
    </li>
  ));
  return <ul className="rated-list">{films}</ul>;
}
