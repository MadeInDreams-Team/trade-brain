module.exports = class Rsi {

    /**
    * Summary: Construct an instance of this class to create a trading stream for the bot
    * 
    * @param {string} product the product ID          
    * @param {uint} close price on this close
    * @param {uint} lastClose price of last close
    * @param {array} avgGain gains
    * @param {array} avgLost lost
    * @param {uint} candleCount counter of candle
    * @param {uint} candleLength time in minutes
    */

    constructor(
        product
    ){
      
        this.product = product
        this.close
        this.lastClose = 0
        this.avgGain = []
        this.avgLost = []
        this.candleCount = 0
        this.candleLength

    }

    /**
     * calculate the RSI INDICATOR
     * @param {float} close price at candle close
     */
    rsi(close) {

        // on first we just record it and increment counter
        if(this.lastClose === 0){
            this.lastClose = close
            //candleCount += 1 we have one price but not one difference yet
        }
        // otherwise we process
        else{

            // check if it's a gain or a lost
            if(close > this.lastClose){
                this.avgGain.push(close - this.lastClose)
            }
             else if(close < this.lastClose){
                this.avgLost.push(this.lastClose - close)
            }
            else {
                //the change is 0 but we still increment because it's a close
            }
            this.lastClose = close
            this.candleCount++

        }

        
       if(this.candleCount >= 15){
       // do we get more then 14 or the 14 last?
       let sumGainAvg  =  this.avgGain.slice(this.avgGain.length-15,this.avgGain.length ).reduce((a, b) => a + b, 0)
       let sumLostAvg  =  this.avgLost.slice(this.avgLost.length-15,this.avgLost.length).reduce((a, b) => a + b, 0)

       let RS =  (sumGainAvg/this.candleCount) / (sumLostAvg/this.candleCount)
       let RSI = 100 - 100 / (1 + RS)
       console.log('RSI : ',RSI)  
       return RSI
       }
       else{
           console.log('Waiting on data',this.candleCount, close, this.lastClose)
           return null
       }
    }
    



}
