const express = require('express');
const api = express();

const bodyParser = require('body-parser');
api.use(bodyParser.json());

const fs = require('fs');
const md5 = require('md5');

const axios = require('axios');

handleCurrenciesUpdate = () => {
    let promise = Promise.resolve(200);
    axios.all([
        axios.get('https://free.currencyconverterapi.com/api/v6/convert?q=USD_MAD&compact=y'),
        axios.get('https://free.currencyconverterapi.com/api/v6/convert?q=EUR_MAD&compact=y'),
        promise
    ])
    .then((responses)=>{
        const currencies = {
            usd: responses[0].data.USD_MAD.val,
            eur: responses[1].data.EUR_MAD.val,
            updatedDate: new Date().getDay(),
            serialNumber: md5(new Date().getDate() + responses[0].data.USD_MAD.val + responses[1].data.EUR_MAD.val)
        }
        
        fs.writeFile('currencies', JSON.stringify(currencies), function (err) {
            if (err) console.log(err);
            console.log('Saved !');
        });
        
    })
    let data = fs.readFileSync('currencies','utf8');
    data = JSON.parse(data);
    // console.log(data);
}

api.get('/get-currencies', function(req, res){

    let currencies = fs.readFileSync('currencies','utf8');
    currencies = JSON.parse(currencies);
    
    if (currencies.updatedDate !== new Date().getDay()) handleCurrenciesUpdate();

    res.send({
        currencies
    });

});

api.listen(5100, function () {
    console.log('Ready');
    console.log('Server is listening on port: 5100');
});


