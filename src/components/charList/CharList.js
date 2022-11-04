import { useEffect, useMemo, useState, useRef } from "react";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import styles from "./charList.module.scss";
import useMarvelService from "../../services/MarvelService";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import GeneralConfiguration from "../../constants/GeneralConfiguration";

const CharList = ({ onCharSelected }) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);
  const [showList, setShowList] = useState(false);
  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllCharacters(offset).then(onCharListLoaded);
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setShowList(true);
    setCharList((charList) => [...charList, ...newCharList]);

    setOffset((offset) => offset + 9);
    setCharEnded(ended);
    setNewItemLoading(false);
  };

  const itemRefs = useRef([]);
  const setRef = (ref) => {
    if (ref == null) return;
    itemRefs.current.push(ref);
    console.log(ref);
  };

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) => {
      console.log(item);
      item.classList.remove(styles.char__item_selected);
    });
    itemRefs.current[id].classList.add(styles.char__item_selected);
    itemRefs.current[id].focus();
  };

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
        <CSSTransition
          key={i}
          timeout={GeneralConfiguration.transitionTimeout}
          classNames={styles.item}
        >
          <li
            className={styles.char__item}
            tabIndex={0}
            ref={setRef}
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
            <div className={styles.char__name}>{item.name}</div>
          </li>
        </CSSTransition>
      );
    });

    return (
      <TransitionGroup component={"ul"} className={styles.char__grid}>
        {items}
      </TransitionGroup>
    );
  };

  const items = useMemo(() => {
    if (charList.length > 0) {
      return renderItems(charList);
    }
    return [];
  }, [charList]);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;
  const content = !((loading && !newItemLoading) || error) ? items : null;

  return (
    <div className={styles.char__list}>
      {errorMessage}
      {spinner}
      <CSSTransition
        in={showList}
        timeout={GeneralConfiguration.transitionTimeout}
        classNames={styles.item}
        appear
        unmountOnExit
      >
        <>{content}</>
      </CSSTransition>
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset, false)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default CharList;
