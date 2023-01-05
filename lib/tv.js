const axios = require("axios");
const cheerio = require("cheerio");
require('dotenv').config();
const url = process.env.HOST_TV

class Tv {
 async index(modes = "latest", page = 1) {
  let mode = modes
  if (modes == 'popular')
  {
   mode = 'populer'
  }
  const data = await this.meta(url + mode + "/page/" + page);
  //console.log(data)
  return data;
 }
 async country(country = "south-korea", page=1) {
  const data = await this.meta(`${url}country/${country}/page/${page}`);

 return data;
 }
 async genre(genre = "action", page=1) {
  const data = await this.meta(`${url}genre/${genre}/page/${page}`);
  return data
 }
 async series(series = "asia", page=1) {
  const data = await this.meta(`${url}series/${series}/page/${page}`);
  return data
 }
 async year(year = "2020", page=1) {
  const data = await this.meta(`${url}year/${year}/page/${page}`);
  return data
 }

 async meta(url) {
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
   let index = [];
   item.each(function (i, v) {
    let title = $(this).find("figure > a > img").attr("alt");
    let poster = "https:" + $(this).find("figure > a > img").attr("src");
    let id = $(this).find("figure > a").attr("href");
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

    if (genres)
    {genres.forEach((i) => {
     genres = i.trim();
    })}
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
   let pageCount =parseInt(split[3]);
   //console.log(page, pageCount);
   const final = {page, pageCount, results: index}
   //console.log(final);
   return final;
  });

  return data;
 }
 async detail(id) {
  const self = this;
  //console.log(url)
  const result = await axios(url+id).then(({ data: html }) => {
   const $ = cheerio.load(html);
   const serial = $(".serial-wrapper");
   const h4 = serial.find("h4");
   const episodeList = serial.find(".episode-list ");
   const index = { status: '', country: '', cast: [], director: '', genres:[], rating: '', datePublished: '', duration: '', id: "id", seasons: [] };


    const tes = $('#movie-detail > div > div.col-xs-9.content > div')
    tes.each(function() {
    // if ($(this).)
     if ($(this).text().match(/(?<=Status)(.*)/gm)){
      index.status = $(this).text().match(/(?<=Status)(.*)/gm)[0]
     } else if ($(this).text().match(/(?<=Negara)(.*)/gm)){
      index.country = $(this).text().match(/(?<=Negara)(.*)/gm)[0]
     } else if ($(this).text().match(/(?<=Bintang film)(.*)/gm)){
      let cast = $(this).text().match(/(?<=Bintang film)(.*)/gm)[0].split(',')
      cast.forEach((i) => {
       index.cast.push(i.trim())
      })

     } else if ($(this).text().match(/(?<=Sutradara)(.*)/gm)){
      index.director = $(this).text().match(/(?<=Sutradara)(.*)/gm)[0]
     } else if ($(this).text().match(/(?<=Genre)(.*)/gm)){
      const genres = $(this).text().match(/(?<=Genre)(.*)/gm)[0].split(',')
      genres.forEach((i) => {
       index.genres.push(i.trim())
      })
     } else if ($(this).text().match(/(?<=IMDb)(.*)/gm)){
      index.rating = parseFloat($(this).text().match(/(?<=IMDb)(.*)/gm)[0].split('/')[0].trim())
     } else if ($(this).text().match(/(?<=Diunggah)(.*)/gm)){
      index.datePublished =$(this).text().match(/(?<=Diunggah)(.*)/gm)[0]
     } else if ($(this).text().match(/(?<=Durasi)(.*)/gm)){
      index.duration = $(this).text().match(/(?<=Durasi)(.*)/gm)[0].trim()
     }


    })

    const srcOverview = $('#movie-detail > div > div.col-xs-9.content > blockquote').html()
    let overview = srcOverview.split('<br>')[1]

    index.overview = overview



   //for id
/*
   const id = url
    .match(
     /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
    )[5]
    .replaceAll("/", "");
    */
   index.id = id;

   h4.each(function () {
    const season = $(this)
     .text()
     .match(/Season (\d+)/)[1];
    index.seasons.push({ season: parseInt(season), episodes: [] });
   });

   Promise.all(
    episodeList.each(async function (i, v) {
     const episode = $(this).find("a");

     const list = [];

     Promise.all(
      episode.each(async function () {
       const episodeList = parseInt($(this).text());
       const link = $(this).attr("href");


       const id = link
    .match(
     /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
    )[5]
    .replaceAll("/", "");
       if ($(this).text() !== "Info") {
        list.push({ episode: episodeList, link, id, download: [], embed: [] });
       }
      })
     );
     //console.log(list);

     index.seasons[i].episodes = index.seasons[i].episodes.concat(list);
    })
   );


   index.seasons.sort((a, b) => a.season - b.season);

   for (const movie of index.seasons) {
    movie.episodes.sort((a, b) => a.episode - b.episode);
   }

   //console.log(index)

   return index;
  });
/*
  console.log("mencari data :" + result.id);

  for (const [index, movie] of result.seasons.entries()) {
   console.log(`Movie ${index + 1}: ${movie.season}`);
   for (const [episodeIndex, episode] of movie.episodes.entries()) {
    console.log(
     `Episode ${episodeIndex + 1}: ${episode.episode} dari season ${index + 1}`
    );
    const data = await this.ekstrak(episode.link);
    const embed = data.server_embed;
    const download = data.link_download;
    result.seasons[index].episodes[episodeIndex].embed = embed;
    result.seasons[index].episodes[episodeIndex].download = download;
   }
  }
*/
  //console.log(JSON.stringify(result, null, 1));
  return result;

  //await this.fetchEpisodes(result)
 }
 async show(id) {
  let query = id;

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
    .html()
    .match(/<br>(.*?)<br>/m)[1]
    .trim();
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
  return {
   message: "success",
   results: employee,
  };
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
}

module.exports = Tv;
