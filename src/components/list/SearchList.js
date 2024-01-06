import Movie from '../movie';
import './SearchList.css';

export default function SearchList({ searchList, genreList }) {
  const films = searchList.map((element) => (
    <li className="movie-card" key={element.id}>
      <Movie filmData={element} genres={element.genre_ids.map((id) => genreList.find((item) => item.id === id).name)} />
    </li>
  ));
  return <ul className="search-list">{films}</ul>;
}
