# READEME

This is a package that return different indicators for your trading bot strategies.



## Usage


```const Rsi = require('@madeindreams/ai-for-tradeBot')```



```const rsiInstance = new Rsi()```


Once the Rsi instance initiated, feed it with every close price, after 14 prices, it will start returning the rsi index.


```let rsi = rsiInstance.rsi(price)```


will return null until it 15 prices are received.


To run a test

```npm run test```