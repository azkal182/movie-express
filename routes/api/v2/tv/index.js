const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const serviceAccount = require("../../../../firebase/akun.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const fs = require("fs");

const db = admin.firestore();

router.get("/data", (req, res) => {
  let page = req.query.page || 1;
  if (isNaN(page) || page == "") page = 1;
  else page = parseInt(page);
  let perPage = req.query.perPage;
  if (isNaN(perPage) || perPage == "") perPage = 24;
  else perPage = parseInt(perPage);

  let dataRef = db.collection("series");
  let data = dataRef
    .limit(perPage)
    .offset((page - 1) * perPage)
    .get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id });
      });

      let total = dataRef.get().then((snapshot) => {
        return snapshot.size;
      });

      return Promise.all([data, total]);
    })
    .then(([data, total]) => {
      let totalPages = Math.ceil(total / perPage);
      res.json({ page, perPage, totalPages, results: data });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/", (req, res) => {
  let page = req.query.page || 1;
  if (isNaN(page) || page == "") page = 1;
  else page = parseInt(page);
  let perPage = req.query.perPage;
  if (isNaN(perPage) || perPage == "") perPage = 24;
  else perPage = parseInt(perPage);

  let dataRef = db.collection("series");
  let data = dataRef
    .orderBy("datePublished", "desc")
    .limit(perPage)
    .offset((page - 1) * perPage)
    .get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        const selectedData = {
          name: doc.data().title,
          id: doc.data().id,
          datePublished: doc.data().datePublished,
          director: doc.data().director,
          categories: doc.data().categories,
          episode: doc.data().episode,
          genres: doc.data().genres,
          poster: doc.data().poster,
          rating: doc.data().rating,
          reviewCount: doc.data().reviewCount,
          trailer: doc.data().trailer,
          TMDB: doc.data().TMDB,
        };

        data.push(selectedData);
        //data.push({ id: doc.id });
      });

      return Promise.all([data]);
    })
    .then(([data]) => {
      res.json({ page, perPage, results: data });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/latest", (req, res) => {
  let page = req.query.page || 1;
  if (isNaN(page) || page == "") page = 1;
  else page = parseInt(page);
  let perPage = req.query.perPage;
  if (isNaN(perPage) || perPage == "") perPage = 24;
  else perPage = parseInt(perPage);

  let dataRef = db.collection("series");
  let data = dataRef
    .orderBy("datePublished", "desc")
    .limit(perPage)
    .offset((page - 1) * perPage)
    .get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        const selectedData = {
          name: doc.data().title,
          id: doc.data().id,
          datePublished: doc.data().datePublished,
          director: doc.data().director,
          categories: doc.data().categories,
          episode: doc.data().episode,
          genres: doc.data().genres,
          poster: doc.data().poster,
          rating: doc.data().rating,
          reviewCount: doc.data().reviewCount,
          trailer: doc.data().trailer,
          TMDB: doc.data().TMDB,
        };

        data.push(selectedData);
        //data.push({ id: doc.id });
      });

      return Promise.all([data]);
    })
    .then(([data]) => {
      res.json({ page, perPage, results: data });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });

  /*
 (async () => {
  try {
   let query = db.collection("seies").limit(1);
   let response = [];

   await db
    .collection("series")
    .orderBy("datePublished", "desc")
    .limit(24)
    .get()
    .then((data) => {
     let docs = data.docs;
     docs.map((doc) => {
      const selectedData = {
       name: doc.data().title,
       id: doc.data().id,
       datePublished: doc.data().datePublished,
       director: doc.data().director,
       categories: doc.data().categories,
       episode: doc.data().episode,
       genres: doc.data().genres,
       poster: doc.data().poster,
       rating: doc.data().rating,
       reviewCount: doc.data().reviewCount,
       trailer: doc.data().trailer,
       TMDB: doc.data().TMDB,
      };

      response.push(selectedData);
     });

     return response;
    });

   return res.status(200).send({ status: "Success", results: response });
  } catch (error) {
   console.log(error);
   res.status(500).send({ status: "Failed", msg: error });
  }
 })();
 */
});

router.get("/popular", (req, res) => {
  let page = req.query.page || 1;
  if (isNaN(page) || page == "") page = 1;
  else page = parseInt(page);
  let perPage = req.query.perPage;
  if (isNaN(perPage) || perPage == "") perPage = 24;
  else perPage = parseInt(perPage);

  let dataRef = db.collection("series");
  let data = dataRef
    .orderBy("rating", "desc")
    .limit(perPage)
    .offset((page - 1) * perPage)
    .get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        const selectedData = {
          name: doc.data().title,
          id: doc.data().id,
          datePublished: doc.data().datePublished,
          director: doc.data().director,
          categories: doc.data().categories,
          episode: doc.data().episode,
          genres: doc.data().genres,
          poster: doc.data().poster,
          rating: doc.data().rating,
          reviewCount: doc.data().reviewCount,
          trailer: doc.data().trailer,
          TMDB: doc.data().TMDB,
        };

        data.push(selectedData);
        //data.push({ id: doc.id });
      });

      return Promise.all([data]);
    })
    .then(([data]) => {
      res.json({ page, perPage, results: data });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
  /*
 (async () => {
  try {
   let query = db.collection("seies").limit(1);
   let response = [];

   await db
    .collection("series")
    .orderBy("rating", "desc")
    .limit(24)
    .get()
    .then((data) => {
     let docs = data.docs;
     docs.map((doc) => {
      const selectedData = {
       name: doc.data().title,
       id: doc.data().id,
       datePublished: doc.data().datePublished,
       director: doc.data().director,
       categories: doc.data().categories,
       episode: doc.data().episode,
       genres: doc.data().genres,
       poster: doc.data().poster,
       rating: doc.data().rating,
       reviewCount: doc.data().reviewCount,
       trailer: doc.data().trailer,
       TMDB: doc.data().TMDB,
      };

      response.push(selectedData);
     });

     return response;
    });

   return res.status(200).send({ status: "Success", results: response });
  } catch (error) {
   console.log(error);
   res.status(500).send({ status: "Failed", msg: error });
  }
 })();
 */
});

router.get("/show/:id", async function (request, res) {
  try {
    let response = [];
    let query = request.params.id;

    await db
      .collection("seriesData")
      .where("id", "==", query)

      .limit(24)
      .get()
      .then((data) => {
        let docs = data.docs;
        docs.map((doc) => {
          const selectedData = {
            id: doc.data().id,
            seasons: doc.data().seasons,
          };

          response.push(selectedData);
        });

        return response;
      });
    //console.log(response)
    //return response;
    return res
      .status(200)
      .send({ status: "Success", length: response.length, results: response });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Failed", msg: error });
  }

  //return 'oke'
});
router.get("/search", async function (request, res) {
  try {
    let response = [];
    let query = request.query.q;

    await db
      .collection("series")
      .where("keywords", "array-contains", query)

      .limit(24)
      .get()
      .then((data) => {
        let docs = data.docs;
        docs.map((doc) => {
          const selectedData = {
            name: doc.data().title,
            id: doc.data().id,
            datePublished: doc.data().datePublished,
            director: doc.data().director,
            categories: doc.data().categories,
            episode: doc.data().episode,
            genres: doc.data().genres,
            poster: doc.data().poster,
            rating: doc.data().rating,
            reviewCount: doc.data().reviewCount,
            trailer: doc.data().trailer,
            TMDB: doc.data().TMDB,
          };

          response.push(selectedData);
        });

        return response;
      });
    //console.log(response)
    //return response;
    return res
      .status(200)
      .send({ status: "Success", length: response.length, results: response });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Failed", msg: error });
  }

  //return 'oke'
});

router.get("/country/:country", async function (req, res) {
  let query = [];
  if (req.params.country == "korea") {
    query = ["Korea", "South Korea"];
  } else if (req.params.country == "china") {
    query = ["China"];
  } else if (req.params.country == "west") {
    query = ["West"];
  } else if (req.params.country == "asian") {
    query = ["Asian"];
  }

  let page = req.query.page || 1;
  if (isNaN(page) || page == "") page = 1;
  else page = parseInt(page);
  let perPage = req.query.perPage;
  if (isNaN(perPage) || perPage == "") perPage = 24;
  else perPage = parseInt(perPage);

  let dataRef = db.collection("series");
  let data = dataRef
    .where("categories", "array-contains-any", query)
    .limit(perPage)
    .offset((page - 1) * perPage)
    .get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        const selectedData = {
          name: doc.data().title,
          id: doc.data().id,
          datePublished: doc.data().datePublished,
          director: doc.data().director,
          categories: doc.data().categories,
          episode: doc.data().episode,
          genres: doc.data().genres,
          poster: doc.data().poster,
          rating: doc.data().rating,
          reviewCount: doc.data().reviewCount,
          trailer: doc.data().trailer,
          TMDB: doc.data().TMDB,
        };

        data.push(selectedData);
        //data.push({ id: doc.id });
      });

      return Promise.all([data]);
    })
    .then(([data]) => {
      res.json({ page, perPage, results: data });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });

  /*

  await db
   .collection("series")
   .where("categories", "array-contains-any", query)

   .limit(24)
   .get()
   .then((data) => {
    let docs = data.docs;
    docs.map((doc) => {
     const selectedData = {
      name: doc.data().title,
      id: doc.data().id,
      datePublished: doc.data().datePublished,
      director: doc.data().director,
      categories: doc.data().categories,
      episode: doc.data().episode,
      genres: doc.data().genres,
      poster: doc.data().poster,
      rating: doc.data().rating,
      reviewCount: doc.data().reviewCount,
      trailer: doc.data().trailer,
      TMDB: doc.data().TMDB,
     };

     response.push(selectedData);
    });

    return response;
   });
  //console.log(response)
  //return response;
  return res
   .status(200)
   .send({ status: "Success", length: response.length, results: response });


 //return 'oke'
*/
});

router.get("/genre/:genre", async function (req, res) {
  let response = [];
  let query = [];
  if (req.params.genre == "horror") {
    query = ["Horror"];
  } else if (req.params.genre == "action") {
    query = ["Action"];
  } else if (req.params.genre == "romance") {
    query = ["Romance"];
  } else if (req.params.genre == "comedy") {
    query = ["Comedy"];
  }

  let page = req.query.page || 1;
  if (isNaN(page) || page == "") page = 1;
  else page = parseInt(page);
  let perPage = req.query.perPage;
  if (isNaN(perPage) || perPage == "") perPage = 24;
  else perPage = parseInt(perPage);

  let dataRef = db.collection("series");
  let data = dataRef
    .where("categories", "array-contains-any", query)
    .limit(perPage)
    .offset((page - 1) * perPage)
    .get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        const selectedData = {
          name: doc.data().title,
          id: doc.data().id,
          datePublished: doc.data().datePublished,
          director: doc.data().director,
          categories: doc.data().categories,
          episode: doc.data().episode,
          genres: doc.data().genres,
          poster: doc.data().poster,
          rating: doc.data().rating,
          reviewCount: doc.data().reviewCount,
          trailer: doc.data().trailer,
          TMDB: doc.data().TMDB,
        };

        data.push(selectedData);
        //data.push({ id: doc.id });
      });

      return Promise.all([data]);
    })
    .then(([data]) => {
      res.json({ page, perPage, results: data });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });

  /*
  await db
   .collection("series")
   .where("categories", "array-contains-any", query)

   .limit(24)
   .get()
   .then((data) => {
    let docs = data.docs;
    docs.map((doc) => {
     const selectedData = {
      name: doc.data().title,
      id: doc.data().id,
      datePublished: doc.data().datePublished,
      director: doc.data().director,
      categories: doc.data().categories,
      episode: doc.data().episode,
      genres: doc.data().genres,
      poster: doc.data().poster,
      rating: doc.data().rating,
      reviewCount: doc.data().reviewCount,
      trailer: doc.data().trailer,
      TMDB: doc.data().TMDB,
     };

     response.push(selectedData);
    });

    return response;
   });
  //console.log(response)
  //return response;
  return res
   .status(200)
   .send({ status: "Success", length: response.length, results: response });
*/
});

router.get("/download", (req, res) => {
  let page = req.query.page || 1;
  if (isNaN(page) || page == "") page = 1;
  else page = parseInt(page);
  let perPage = req.query.perPage;
  if (isNaN(perPage) || perPage == "") perPage = 24;
  else perPage = parseInt(perPage);

  let dataRef = db.collection("series");
  let data = dataRef
    .orderBy("datePublished", "desc")
    .get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
        //data.push({ id: doc.id });
      });

      return Promise.all([data]);
    })
    .then(([data]) => {
      fs.writeFileSync(`seriesAll.json`, JSON.stringify(data));
      res.json({ status: "oke" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});
module.exports = router;
