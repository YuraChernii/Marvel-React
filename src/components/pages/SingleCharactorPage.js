import { useParams, Link } from "react-router-dom";
import "./SingleComicPage.scss";
import { useState, useEffect } from "react";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const SingleCharactor = () => {
  console.log(1);
  const { charId } = useParams();
  const [char, setChar] = useState(null);
  const { loading, error, getCharById, clearError } = useMarvelService();

  useEffect(() => {
    updateComic();
  }, [charId]);

  const updateComic = () => {
    clearError();
    if (!charId) {
      return;
    }

    getCharById(charId).then(onCharLoaded);
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const View = ({ char }) => {
    console.log(char);
    const { name, description, thumbnail } = char;
    return (
      <div className="single-comic">
        <img
          src={thumbnail.path + "." + thumbnail.extension}
          alt="title"
          className="single-comic__img"
        />
        <div className="single-comic__info">
          <h2 className="single-comic__name">{name}</h2>
          <p className="single-comic__descr">{description}</p>
        </div>
        <Link to="/" className="single-comic__back">
          Back to all
        </Link>
      </div>
    );
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

export default SingleCharactor;
