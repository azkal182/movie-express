const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')
const url = 'https://lk21official.info/'
const { Redis } = require('@upstash/redis')

const redis = new Redis({
    url: 'https://global-central-cougar-32121.upstash.io',
    token: 'AX15ACQgYjNhMmY5ZWEtNGM3Ny00N2RmLTgwOGUtNWQ0YTk2NDUwYmM0NDhiNTgzYTRjM2JmNDcyMTg0OWNkMzY3NThkYmM0Nzc=',
})

async function search(query) {

        const cachedData = await checkCache('searchn/' + query);
        if (cachedData) {
          console.log('Data ditemukan dalam cache');
         // return cachedData;
        }
    const config = {
        params: {
            s: query,
        },
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept-Encoding": "application/json",
        },
    };

    let result = await axios.get(url, config).then((res) => {
        const html = res.data;
        const $ = cheerio.load(html);

        let list = $(".search-item");
        let index = [];


        list.each(function (v, i) {
            let title = $(this).find("figure > a").attr("title");

            let poster = "https:" + $(this).find("figure > a > img").attr("src");
            let id = getId($(this).find("figure > a").attr("href"));
            let categories = $(this)
                .find(".cat-links")
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
            const genres = obj.genre;
            const dateCreated = new Date(obj.dateCreated)
            const director = obj.director ? obj.director[0].name : "";
            const reviewCount = obj.aggregateRating ? (obj.aggregateRating.reviewCount ? parseInt(obj.aggregateRating.reviewCount, 10) : 0) : 0
            const ratingValue = obj.aggregateRating ? (obj.aggregateRating.ratingValue ? parseFloat(obj.aggregateRating.ratingValue) : 0) : 0

            //console.log(ratingValue)

            //console.log(reviewCount)
            let link = $(this).find(".search-content > h2 > a").attr("href");
            let tag = $(this).find("p.cat-links > a:nth-child(1)").attr("href");
            if (!tag.match(/series/gm)) {
                index.push({
                    title,
                    id,
                    type: 'movie',
                    dateCreated,
                    director,
                    categories,
                    categories,
                    genres,
                    poster,
                    reviewCount,
                    ratingValue,
                    trailer,
                    link,
                });
            } else {
                index.push({
                    title,
                    id,
                    type: 'tv',
                    dateCreated,
                    director,
                    categories,
                    categories,
                    genres,
                    poster,
                    reviewCount,
                    ratingValue,
                    trailer,
                    link,
                });
            }
        });
        //console.log(index)
        return {
            message: "success",
            length: index.length,
            results: index,
        };
    });

    await saveCache('searchn/' + query, result);
    return result
}

function getId(href) {
    var match = href.match(
        /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
    );
    return match[5].split("/").join("");
}

async function checkCache(url) {
    const data = await redis.get(url);
    return data
}

async function saveCache(url, data) {
    return await redis.set(url, data, { ex: 43200 });
}


router.get('/', async (req, res) => {
    const query = req.query.q
    if (query) {
        const data = await search(query)
        //console.log(data)
        res.send(data)
    } else {
        res.send({ status: 'error', message: 'missing query q' })
    }

})


module.exports = router
