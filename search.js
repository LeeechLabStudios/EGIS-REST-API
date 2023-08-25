const google = require('googleapis').google
const customSearch = google.customsearch('v1');
const googleSearchCredentials = require('/etc/secrets/credentials.json')
const express = require('express');

const app = express();
const port = 2828;

app.get('/',async function(req, res){
    const p1 = req.query.p1;
    const p2 = req.query.p2;
    const year = req.query.year;
    if (year == undefined || p1 == undefined){
        console.log("      >>>Data Received: ERROR: (Data is Malformed) [Year: "+year+", P1: "+p1+", P2: "+p2+"]\n      >Data ignored");
    }else{
        console.log("      >>>Data Received: [Year: "+year+", P1: "+p1+", P2: "+p2+"]")
        const links = await search(parseInt(year));
        res.send({
        'payload': [p1,p2,year,links]
        });
    }
});

app.listen(port);
console.log('\n\n---------[  EGIS REST API  ]---------\n\nEraGuessr_ImageSearcher is Online\n      >  ctrl+c to cancel\n      >  Authors: Yellow63, LeeechLab Backend');
console.log('\n[EGIS] Console Logs:');
async function search(year){
    var type = " image ";
    if (year == 911){
        year = 912;
    }
    if (year > 1850){
        type = "photograph";
    }else{
        if (year < 600){
            type = "statue";
        }else{
            type = "painting";
        }
    }
    const content = "year "+year.toString()+" "+type+" wikipedia";
    const returns = await GoogleFIRL(content);
    async function GoogleFIRL(query){
        const response = await customSearch.cse.list({
            auth: googleSearchCredentials.apiKey,
            cx: googleSearchCredentials.searchEngineId,
            q: query,
            fileType: 'jpg',
            searchType: 'image',
            num: 10
        })
        const imagesUrl= response.data.items.map((item) =>{
            return item.link
        })
        return imagesUrl
    }
    return returns
}
