import { useEffect, useMemo, useState, useRef } from "react";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import "./charList.scss";

const CharList = ({ onCharSelected }) => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = useMemo(() => {
    return new MarvelService();
  }, []);

  useEffect(() => {
    onRequest();
  }, []);

  const onRequest = (offset) => {
    onCharListLoading();
    marvelService
      .getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError);
  };

  const onCharListLoading = () => {
    setNewItemLoading(true);
  };

  const onCharListLoaded = (newCharList) => {
    console.log("onCharListLoaded");
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    setCharList((charList) => [...charList, ...newCharList]);
    setLoading(false);
    console.log("smth");
    setOffset((offset) => offset + 9);
    setCharEnded(ended);
    setNewItemLoading(false);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  console.log("setref222222");
  const itemRefs = useRef([]);
  const setRef = (ref) => {
    itemRefs.current.push(ref);
  };

  const focusOnItem = (id) => {
    console.log("id", id);
    console.log(itemRefs);
    itemRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  // Этот метод создан для оптимизации,
  // чтобы не помещать такую конструкцию в метод render
  const renderItems = (arr) => {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      return (
        <li
          className="char__item"
          tabIndex={0}
          ref={setRef}
          key={item.id}
          onClick={() => {
            onCharSelected(item.id);
            focusOnItem(i);
          }}
          onKeyPress={(e) => {
            if (e.key === " " || e.key === "Enter") {
              onCharSelected(item.id);
              focusOnItem(i);
            }
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    // А эта конструкция вынесена для центровки спиннера/ошибки

    return <ul className="char__grid">{items}</ul>;
  };

  const items = useMemo(() => {
    if (charList.length > 0) {
      return renderItems(charList);
    }
    return [];
  }, [charList]);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? items : null;
  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {content}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default CharList;
