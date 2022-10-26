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
    var { ts, hash, api_url, public_key } = getRequestParams();

    const res = await request(
      `${api_url}characters?limit=9&offset=${offset}&ts=${ts}&apikey=${public_key}&hash=${hash}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    var { ts, hash, api_url, public_key } = getRequestParams();

    const res = await request(
      `${api_url}characters/${id}?ts=${ts}&apikey=${public_key}&hash=${hash}`
    );

    return _transformCharacter(res.data.results[0]);
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
    var { ts, hash, api_url, public_key } = getRequestParams();

    const res = await request(
      `${api_url}comics/${id}?ts=${ts}&apikey=${public_key}&hash=${hash}`
    );

    return _transformComic(res.data.results[0]);
  };

  const getComics = async (offset = BASE_OFFSET) => {
    var { ts, hash, api_url, public_key } = getRequestParams();

    const res = await request(
      `${api_url}comics?offset=${offset}&ts=${ts}&apikey=${public_key}&hash=${hash}`
    );

    return res.data.results.map((elem) => _transformComic(elem));
  };

  const _transformComic = (comic) => {
    return {
      name: comic.title,
      image: comic?.thumbnail?.path + "." + comic.thumbnail.extension,
      description: comic.description,
      price: comic.prices[0].price,
    };
  };

  // Helpers
  const getRequestParams = () => {
    var ts = new Date().getTime();
    var hash = md5(ts + PRIV_KEY + PUBLIC_KEY).toString();
    return { ts, hash, api_url: API_URL, public_key: PUBLIC_KEY };
  };

  return {
    loading,
    error,
    getAllCharacters,
    getCharacter,
    clearError,
    getComicById,
    getComics,
  };
};

export default useMarvelService;
