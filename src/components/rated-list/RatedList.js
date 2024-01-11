import Movie from '../movie';
import './RatedList.css';
import { TMDBConsumer } from '../tmdb-context';

export default function RatedList({ ratedList, getRatedList, currentPageRated }) {
  /* console.log(ratedList); */
  const films = ratedList.map((element) => (
    <li className="movie-card" key={element.id}>
      <TMDBConsumer>
        {({ genreList, guestSessionId, postRating, deleteRating }) => (
          <Movie
            filmLocation="rated"
            rating={element.rating}
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
