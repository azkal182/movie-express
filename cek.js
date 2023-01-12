const fs = require("fs");
const admin = require("./node_modules/firebase-admin");

const today = admin.firestore.FieldValue.serverTimestamp()
const time = new admin.firestore.Timestamp(1673373650,0)
//console.log(time)
//console.log(new Date(time.seconds *1000)
/*
fs.readFile("seriesAll.json", "utf-8", (err, data) => {
    if (err) throw err;
    const jsonData = JSON.parse(data);
    for (const index in jsonData)
    {
     const oldDate= new Date(jsonData[index].datePublished).getTime()
     const newDate = new admin.firestore.Timestamp(oldDate/1000,0)
    jsonData[index]['type'] = 'tv'
    jsonData[index]['datePublished'] = newDate
    //console.log(newDate)
    }
    fs.writeFileSync("serial.json", JSON.stringify(jsonData));
    console.log(jsonData)
    // do something with jsonData
});
*/

fs.readFile("serial.json", "utf-8", (err, data) => {
    if (err) throw err;
    const jsonData = JSON.parse(data);
    
    console.log(jsonData)
    // do something with jsonData
});