import md5 from "md5";

class MarvelService {
  _apiBase = "http://gateway.marvel.com:80/v1/public/";
  // ЗДЕСЬ БУДЕТ ВАШ КЛЮЧ, ЭТОТ КЛЮЧ МОЖЕТ НЕ РАБОТАТЬ
  PRIV_KEY = "e83322980b9923c15e1d4cd2dd2015cb05d3bf88";
  PUBLIC_KEY = "2409291755ce35cc0e70f6b5931b6e91";
  _baseOffset = 210;

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getAllCharacters = async (offset = this._baseOffset) => {
    var ts = new Date().getTime();
    var hash = md5(ts + this.PRIV_KEY + this.PUBLIC_KEY).toString();

    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}&ts=${ts}&apikey=${this.PUBLIC_KEY}&hash=${hash}`
    );
    return res.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    var ts = new Date().getTime();
    var hash = md5(ts + this.PRIV_KEY + this.PUBLIC_KEY).toString();

    const res = await this.getResource(
      `${this._apiBase}characters/${id}?ts=${ts}&apikey=${this.PUBLIC_KEY}&hash=${hash}`
    );
    return this._transformCharacter(res.data.results[0]);
  };

  _transformCharacter = (char) => {
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
}

export default MarvelService;
