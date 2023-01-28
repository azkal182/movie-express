const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const url = process.env.HOST_MOVIE ?? 'https://a.lk21official.lol/';

const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: "https://global-central-cougar-32121.upstash.io",
  token:
    "AX15ACQgYjNhMmY5ZWEtNGM3Ny00N2RmLTgwOGUtNWQ0YTk2NDUwYmM0NDhiNTgzYTRjM2JmNDcyMTg0OWNkMzY3NThkYmM0Nzc=",
});

class Movie {
  async index(modes = "latest", page = 1) {
    let mode = modes;
    if (modes == "popular") {
      mode = "populer";
    }
    const data = await this.meta(url + mode + "/page/" + page);
    //console.log(data)
    return data;
  }
  async country(country = "south-korea", page = 1) {
    const data = await this.meta(`${url}country/${country}/page/${page}`);

    return data;
  }
  async genre(genre = "action", page = 1) {
    const data = await this.meta(`${url}genre/${genre}/page/${page}`);
    return data;
  }
  async year(year = "2020", page = 1) {
    const data = await this.meta(`${url}year/${year}/page/${page}`);
    return data;
  }

  async meta(url) {
    const path = url && url.match(/(http[s]?:\/\/)?([^\/\s]+\/)(.*)/)[3];
   
    const cachedData = await this.checkCache("movie/" + path);
    if (cachedData) {
      console.log("Data ditemukan dalam cache");
      //return cachedData;
    }
    
    const config = {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept-Encoding": "application/json",
      },
    };

    function getId(href) {
      var match = href.match(
        /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
      );
      return match[5].split("/").join("");
    }

    let data = await axios.get(url, config).then((res) => {
      let html = res.data;
      let $ = cheerio.load(html);

      const item = $("#grid-wrapper > div");
      //console.log(item.text())
      let index = [];
      item.each(function (i, v) {
        let title = $(this).find("figure > a > img").attr("alt");
        let poster = "https:" + $(this).find("figure > a > img").attr("src");
        let id = $(this).find("article > footer > p:nth-child(3) > a").attr("href");
        //console.log(id)
        let rating = $(this).find(".rating").text();
        let quality = $(this).find(".quality").text();

        let categories = $(this)
          .find(".grid-categories")
          .text()
          .split(",")
          .map((elem) => elem.trim());

        let meta = $(this).find("script").text();
        const optimizedJSON = meta.replace(
          /\\n|\\'|\\"|\\&|\\r|\\t|\\b|\\f|[\u0000-\u0019]+|@/g,
          ""
        );
        const obj = JSON.parse(optimizedJSON);

        const trailer = obj.hasPart.potentialAction.target[0].urlTemplate;
        let genres = obj.genre;
        //remove empty space genres

        if (genres) {
          genres.forEach((i) => {
            genres = i.trim();
          });
        }
        //end remove empty space genres
        const dateCreated = new Date(obj.dateCreated);
        const datePublished = new Date(obj.datePublished);
        const director = obj.director ? obj.director[0].name : "";
        const reviewCount = obj.aggregateRating
          ? obj.aggregateRating.reviewCount
            ? parseInt(obj.aggregateRating.reviewCount, 10)
            : 0
          : 0;
        const ratingValue = obj.aggregateRating
          ? obj.aggregateRating.ratingValue
            ? parseFloat(obj.aggregateRating.ratingValue)
            : 0
          : 0;

        index.push({
          title,
          id: getId(id),
          type: "movie",
          dateCreated,
          datePublished,
          director,
          categories,
          genres,
          poster,
          reviewCount,
          ratingValue,
          rating,
          trailer,
          quality,
          link: id,
        });
      });

      //find page and page count
      const text = $("#pagination > span").text();
      let split = text.split(" ");
      let page = parseInt(split[1]);
      let pageCount = parseInt(split[3]);
      //console.log(page, pageCount);
      const final = { page, pageCount, results: index };
      //console.log(final);
      return final;
    });
    await this.saveCache("movie/" + path, data, true);
    return data;
  }

  async detail(id) {
    let query = id;
    const cachedData = await this.checkCache("movie/detail/" + id);
    if (cachedData) {
      console.log("Data ditemukan dalam cache");
      return cachedData;
    }

    const config = {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept-Encoding": "application/json",
      },
    };

    let result = await axios.get(url + query, config).then((res) => {
      let html = res.data;
      let $ = cheerio.load(html);
      let server_list = {};

      let data = {};
      let get_meta = $(".col-xs-9.content");
      //console.log(get_meta.text())
      data.title = $(
        "body > main > section.breadcrumb > div > ol > li.last > span"
      ).text();
      data.quality = get_meta.find("div:nth-child(1) > h3").text();
      data.country = get_meta.find("div:nth-child(2) > h3").text();
      data.cast = [];
      get_meta.find("div:nth-child(3) > h3").each(function () {
        data["cast"].push($(this).text());
      });
      data.director = get_meta.find("div:nth-child(4) > h3").text();
      data.genre = [];
      get_meta.find("div:nth-child(5) > h3").each(function () {
        data["genre"].push($(this).text());
      });
      data.imdb = get_meta.find("div:nth-child(6) > h3:nth-child(2)").text();
      data.release = get_meta.find("div:nth-child(7) > h3").text();
      data.translator = get_meta.find("div:nth-child(8) > h3").text();
      data.uploaded = get_meta.find("div:nth-child(11) > h3").text();
      data.duration = get_meta.find("div:nth-child(12) > h3").text();
      
      data.overview = get_meta
        .find("blockquote")
        .html() ? 
        get_meta
        .find("blockquote")
        .html().split('<br>')[1].trim() : ''
        
       // console.log(get_meta
        //.find("blockquote")
        //.html().split('<br>')[1])
      data.trailer = $(
        "#player-default > div > div.action-player > ul > li:nth-child(3) > a"
      ).attr("href");

      // this for find server embed
      let list = $("section").find("ul#loadProviders");
      list.children().each(function () {
        const server = $(this).find("a").text();
        const link = $(this).find("a").attr("href");

        server_list[server] = {};

        server_list[server]["link"] = link;
        server_list[server]["quality"] = [];

        $(this)
          .find("span")
          .each(function (v, i) {
            server_list[server]["quality"].push($(this).text());
          });
      });
      return {
        ...data,
        server_embed: server_list,
      };
    });

    const cookie = await this.getCookie(query);
    let get_download = await axios({
      method: "post",
      url: "https://dl.indexmovies.xyz/verifying.php",
      data: {
        slug: query,
      },
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 12; CPH2043) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept-Encoding": "application/json",
        cookie: cookie,
      },
    }).then((res) => {
      let data = res.data;
      const $ = cheerio.load(data);
      let list = $("tbody > tr");
      let index = {
        link_download: [],
      };
      list.each(function (v, i) {
        let item = $(this).find("strong").text();
        let link = $(this).find("a").attr("href");
        let quality = $(this).find("a").attr("class").substring(9, 13);
        index["link_download"].push({
          item,
          link,
          quality,
        });
      });

      return index;
    });

    let employee = {
      ...result,
      ...get_download,
    };
    /*
          nodeCache.set(query, { message: "success", results: employee }, 1800);
        */

    const final = {
      message: "success",
      results: employee,
    };

    await this.saveCache("movie/detail/" + id, final);
    return final;
  }

  async getCookie(id) {
    // Logger.info('from cookie')
    // console.log('2')

    const config = {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 12; CPH2043) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36",

        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",

        "Accept-Encoding": "application/json",
      },
    };

    let result = await axios
      .get("https://dl.indexmovies.xyz/get/" + id, config)
      .then((res) => {
        let data = res.data;
        const search = "setCookie('validate'";
        let idx = data.indexOf(search);
        let hasil = data.substring(idx + 23, idx + 63);
        //console.log("");
        //Logger.warning(data)
        return "validate=" + hasil;
      });
    //console.log(result);
    return result;
  }

  async checkCache(url) {
    // url = url.replaceAll('/', '_')
    const data = await redis.get(url);
    // console.log(data)
    return data;
  }

  async saveCache(url, data, ex = false) {
    if (ex) {
      return await redis.set(url, data, { ex: 43200 });
    }
    return await redis.set(url, data, { ex: 604800 });
    // console.log(res)
  }
}
module.exports = Movie;
