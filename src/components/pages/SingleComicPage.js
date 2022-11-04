import { useParams, Link } from "react-router-dom";
import "./SingleComicPage.scss";
import { useState, useEffect } from "react";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const SingleComic = () => {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const { loading, error, getComicById, clearError } = useMarvelService();

  useEffect(() => {
    updateComic();
  }, [comicId]);

  const updateComic = () => {
    clearError();
    if (!comicId) {
      return;
    }
    getComicById(comicId).then(onComicLoaded);
  };

  const onComicLoaded = (comic) => {
    setComic(comic);
  };

  const View = ({ comic }) => {
    const { title, description, pageCount, image, language, price } = comic;
    return (
      <div className="single-comic">
        <img src={image} alt="title" className="single-comic__img" />
        <div className="single-comic__info">
          <h2 className="single-comic__name">{title}</h2>
          <p className="single-comic__descr">{description}</p>
          <p className="single-comic__descr">{pageCount}</p>
          <p className="single-comic__descr">{language}</p>
          <div className="single-comic__price">{price}</div>
        </div>
        <Link to="/comics" className="single-comic__back">
          Back to all
        </Link>
      </div>
    );
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

export default SingleComic;
