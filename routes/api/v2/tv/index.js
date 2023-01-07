const express = require('express')
const router = express.Router()
const admin = require("firebase-admin");
const serviceAccount = require("../../../../firebase/akun.json");
admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
});



const db = admin.firestore();


router.get('/', (req, res) => {
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
})

router.get('/latest', (req, res) => {
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
})

router.get("/popular", (req, res) => {
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
});

router.get("/show/:id", async function (request, res) {
  try {
   let response = [];
let query = request.params.id

   await db
    .collection("seriesData")
    .where('id', '==', query)
    
    .limit(24)
    .get()
    .then((data) => {
     let docs = data.docs;
     docs.map((doc) => {
      const selectedData = {
       
       id: doc.data().id,
       seasons: doc.data().seasons
      };

      response.push(selectedData);
     });

     return response;
    });
   //console.log(response)
   //return response;
   return res.status(200).send({ status: "Success", length:response.length, results: response });
  } catch (error) {
   console.log(error);
   res.status(500).send({ status: "Failed", msg: error });
  }

  //return 'oke'
 });
router.get("/search", async function (request, res) {
  try {
   let response = [];
let query = request.query.q

   await db
    .collection("series")
    .where('keywords', 'array-contains', query)
    
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
   return res.status(200).send({ status: "Success", length:response.length, results: response });
  } catch (error) {
   console.log(error);
   res.status(500).send({ status: "Failed", msg: error });
  }

  //return 'oke'
 });

router.get("/country/:country", async function (request, res) {
  try {
   let response = [];
let query = []
if (request.params.country == 'korea')
{
 query = ['Korea', 'South Korea']
} else if (request.params.country == 'china')
{
 query = ['China']
} else if (request.params.country == 'west')
{
 query = ['West']
} else if (request.params.country == 'asian')
{
 query = ['Asian']
}
   await db
    .collection("series")
    .where('categories', 'array-contains-any', query)
    
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
   return res.status(200).send({ status: "Success", length:response.length, results: response });
  } catch (error) {
   console.log(error);
   res.status(500).send({ status: "Failed", msg: error });
  }

  //return 'oke'
 });


router.get("/genre/:genre", async function (request, res) {
  try {
   let response = [];
let query = []
if (request.params.genre == 'horror')
{
 query = ['Horror']
} else if (request.params.genre == 'action')
{
 query = ['Action']
} else if (request.params.genre == 'romance')
{
 query = ['Romance']
} else if (request.params.country == 'comedy')
{
 query = ['Comedy']
}
   await db
    .collection("series")
    .where('categories', 'array-contains-any', query)
    
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
   return res.status(200).send({ status: "Success", length:response.length, results: response });
  } catch (error) {
   console.log(error);
   res.status(500).send({ status: "Failed", msg: error });
  }

  //return 'oke'
 });

module.exports = router
