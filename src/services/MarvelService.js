import md5 from "md5";
import { useHttp } from "../hooks/http.hook";

const PRIV_KEY = "e83322980b9923c15e1d4cd2dd2015cb05d3bf88";
const PUBLIC_KEY = "2409291755ce35cc0e70f6b5931b6e91";
const API_URL = "http://gateway.marvel.com:80/v1/public/";
const BASE_OFFSET = 210;

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  // Characters
  const getAllCharacters = async (offset = BASE_OFFSET) => {
    var authParams = getAuthParams();

    const res = await request(
      `${API_URL}characters?limit=9&offset=${offset}&${authParams}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    var authParams = getAuthParams();

    const res = await request(`${API_URL}characters/${id}?${authParams}`);

    return _transformCharacter(res.data.results[0]);
  };

  const getCharactersByName = async (name) => {
    var authParams = getAuthParams();

    const res = await request(
      `${API_URL}characters?name=${name}&${authParams}`
    );
    console.log(res.data);
    return res.data.results.length > 0 ? res.data.results : null;
  };

  const getCharById = async (id) => {
    var authParams = getAuthParams();

    const res = await request(`${API_URL}characters/${id}?${authParams}`);

    return res.data.results[0];
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : "There is no description for this character",
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  // Comics
  const getComicById = async (id) => {
    var authParams = getAuthParams();

    const res = await request(`${API_URL}comics/${id}?${authParams}`);

    return _transformComic(res.data.results[0]);
  };

  const getComics = async (offset = BASE_OFFSET) => {
    var authParams = getAuthParams();

    const res = await request(
      `${API_URL}comics?offset=${offset}&${authParams}`
    );

    return res.data.results.map((elem) => _transformComic(elem));
  };

  const _transformComic = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      name: comic.title,
      pageCount: comic.pageCount,
      image: comic?.thumbnail?.path + "." + comic.thumbnail.extension,
      description: comic.description,
      price: comic.prices[0].price,
    };
  };

  // Helpers
  const getAuthParams = () => {
    var ts = new Date().getTime();
    var hash = md5(ts + PRIV_KEY + PUBLIC_KEY).toString();
    let params = `ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
    return params;
  };

  return {
    loading,
    error,
    getAllCharacters,
    getCharacter,
    getCharById,
    getCharactersByName,
    clearError,
    getComicById,
    getComics,
  };
};

export default useMarvelService;
