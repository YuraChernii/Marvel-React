import { useHttp } from "../hooks/http.hook";
import md5 from "md5";

const PRIV_KEY = "e83322980b9923c15e1d4cd2dd2015cb05d3bf88";
const PUBLIC_KEY = "2409291755ce35cc0e70f6b5931b6e91";
const API_URL = "http://gateway.marvel.com:80/v1/public/";
const BASE_OFFSET = 210;

const useMarvelService = () => {
  const { request, clearError, process, setProcess } = useHttp();

  const getAllCharacters = async (offset = BASE_OFFSET) => {
    var authParams = getAuthParams();
    const res = await request(
      `${API_URL}characters?limit=9&offset=${offset}&${authParams}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacterByName = async (name) => {
    var authParams = getAuthParams();
    const res = await request(
      `${API_URL}characters?name=${name}&${authParams}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    var authParams = getAuthParams();
    const res = await request(`${API_URL}characters/${id}?${authParams}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getAllComics = async (offset = 0) => {
    var authParams = getAuthParams();
    const res = await request(
      `${API_URL}comics?orderBy=issueNumber&limit=8&offset=${offset}&${authParams}`
    );
    return res.data.results.map(_transformComics);
  };

  const getComic = async (id) => {
    var authParams = getAuthParams();
    const res = await request(`${API_URL}comics/${id}?${authParams}`);
    return _transformComics(res.data.results[0]);
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

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || "There is no description",
      pageCount: comics.pageCount
        ? `${comics.pageCount} p.`
        : "No information about the number of pages",
      thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
      language: comics.textObjects.language || "en-us",
      price: comics.prices[0].price
        ? `${comics.prices[0].price}$`
        : "not available",
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
    clearError,
    process,
    setProcess,
    getAllCharacters,
    getCharacterByName,
    getCharacter,
    getAllComics,
    getComic,
  };
};

export default useMarvelService;
