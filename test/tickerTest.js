const ai = require('../index/')
const data = require('./ETH-BTC.json')
let tradeBrain  = new ai('DOGEBTC',1)

let i=0
let n = data.length

for(i=0;i<n;i++){
    console.log(new Date(data[i].date*1000),data[i].close )
    tradeBrain.RSI(data[i].close)
    tradeBrain.MACD(data[i].close)
}
