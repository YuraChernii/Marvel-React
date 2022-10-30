import "./comicsList.scss";
import { useState, useRef, useMemo, useEffect } from "react";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";
const LOADING_OFFSET = 10;

const ComicsList = () => {
  const { error, loading, clearError, getComics } = useMarvelService();

  const [comicsList, setComicsList] = useState([]);
  const currOffset = useRef(LOADING_OFFSET);

  useEffect(() => {
    getComics(currOffset.current).then(updateComicsList);
    console.log("call");
  }, []);

  const updateComicsList = (newRecords) => {
    setComicsList((comicsList) => {
      return [...comicsList, ...newRecords];
    });
    console.log(comicsList);
  };

  const loadComicRecords = () => {
    clearError();
    currOffset.current += 10;
    getComics(currOffset.current).then(updateComicsList);
  };

  const HTMLComicsList = useMemo(() => {
    return (
      <div className="comics__list">
        <div className="comics__grid">
          {comicsList.map((elem, index) => {
            return (
              <Link to={`/comics/${elem.id}`} key={index}>
                <img
                  className="comics__item-img"
                  src={elem.image}
                  alt={elem.name}
                />
                <div className="comics__item-name">{elem.name}</div>
                <div className="comics__item-price">{elem.price}$</div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }, [comicsList]);

  const HTMLLoader = loading && !error ? <Spinner /> : null;

  const HTMLError = error && <ErrorMessage />;

  return (
    <>
      {!error && HTMLComicsList}
      {HTMLLoader}
      {HTMLError}
      <button
        className="button button__main button__long"
        style={{
          display:
            comicsList.length === 0 || loading || error ? "none" : "block",
        }}
        onClick={() => loadComicRecords()}
      >
        <div className="inner">load more</div>
      </button>
    </>
  );
};

export default ComicsList;
