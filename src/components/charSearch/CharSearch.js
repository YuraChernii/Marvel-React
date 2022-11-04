import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import "./charSearch.scss";
import * as Yup from "yup";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";

const CharSearch = () => {
  const [foundItems, setFoundItems] = useState(null);

  const { loading, error, getCharactersByName } = useMarvelService();

  const onSearchClick = (name) => {
    getCharactersByName(name).then(onCompletingSearch);
  };

  const onCompletingSearch = (chars) => {
    setFoundItems(chars ?? []);
  };

  const errorMessage = error ? (
    <div className="char__search-critical-error">
      <ErrorMessage />
    </div>
  ) : null;

  return (
    <div className="char__search-form">
      <Formik
        initialValues={{ charName: "" }}
        validationSchema={Yup.object({
          charName: Yup.string().required("This field is required."),
        })}
        onSubmit={({ charName }) => {
          onSearchClick(charName);
        }}
      >
        <Form>
          <label className="char__search-label" htmlFor="charName">
            Or find a character by name:
          </label>
          <div className="char__search-wrapper">
            <Field
              id="charName"
              name="charName"
              type="text"
              placeholder="Enter name"
            />
            <button
              type="submit"
              className="button button__main"
              disabled={loading}
            >
              <div className="inner">find</div>
            </button>
          </div>
          <FormikErrorMessage
            component="div"
            className="char__search-error"
            name="charName"
          />
        </Form>
      </Formik>

      {foundItems?.length > 0 ? (
        <div className="char__search-wrapper">
          {foundItems.map((elem) => (
            <>
              <div className="char__search-success" key={elem.id}>
                Here! Visit {elem.name} page.
              </div>
              <Link
                to={`/characters/${elem.id}`}
                className="button button__secondary"
              >
                <div className="inner">Go to Page</div>
              </Link>
            </>
          ))}
        </div>
      ) : foundItems != null ? (
        <div className="char__search-error">
          The character was not found. Check the name and try again
        </div>
      ) : null}
      {errorMessage}
    </div>
  );
};
export default CharSearch;
