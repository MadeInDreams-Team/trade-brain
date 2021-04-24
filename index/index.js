module.exports = class ai {

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
        product,
        candleLength
    ){
      
        this.product = product
        this.close
        this.closeHistory = []
        this.lastClose = 0
        this.avgGain = []
        this.avgLost = []
        this.candleCount = 0
        this.ema12History = []
        this.ema26History = []
        this.ema12Counter = 0
        this.ema26Counter = 0
        this.macd = []
        this.candleLength = candleLength

    }

    /**
     * calculate the Real
     * @param {float} close price at candle close
     */
    RSI(close) {
        
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
    

    /**
     * SMA
     * calculate Simple Moving Average
     * 
     * @param {float} close price at candle close
     * 
     */
    MACD(close) {


        this.closeHistory.push(close)   
        let period = 12 
        let period2 = 26
        let weightMultiplier = 2 / period + 1
        let weightMultiplier2 = 2 / period2 + 1
        // we start recording data when we have the period amount required

        let SMA12 = this.closeHistory.slice(this.closeHistory.length-period, this.closeHistory.length).reduce((a, b) => a + b, 0)
        let SMA26 = this.closeHistory.slice(this.closeHistory.length-period2, this.closeHistory.length).reduce((a, b) => a + b, 0)


        // if we reach the first period end we insert the SMA as first ema12
        if(this.candleCount >= period && this.ema12Counter === 0) {
           
            this.ema12Counter++
            this.ema12History.push(SMA12)
           // console.log('First EMA12 pushed ', SMA12)
        }
        else if( (this.candleCount/period - this.ema12Counter) >=1 ){
            this.ema12Counter++
            let ema12 = (close - SMA12) * weightMultiplier + this.ema12History[this.ema12History.length-1]
            this.ema12History.push(ema12)
           // console.log('EMA12 pushed ',ema12)
        }

   

        if(this.candleCount >= period2 && this.ema26Counter === 0) {
           
            this.ema26Counter++
            this.ema26History.push(SMA26)
          //  console.log('EMA26 pushed ', SMA26)
        }
        else if(  (this.candleCount/period2 - this.ema26Counter) >=1   ){
            this.ema26Counter++
           
            let ema26 = (close - SMA26) * weightMultiplier2 + this.ema26History[this.ema26History.length-1]
            this.ema26History.push(ema26)
         //   console.log(this.ema26History)
         //   console.log('EMA26 pushed ',ema26)
        }


         // we can start calculating the MACD
        if(this.ema26History.length >= 2){

        let ema26Seq = (close - this.ema26History[this.ema26History.length-1] ) * weightMultiplier2 + this.ema26History[this.ema26History.length-2]

        let ema12Seq = (close - this.ema12History[this.ema12History.length-1] ) * weightMultiplier + this.ema12History[this.ema12History.length-2]

        this.macd.push(ema12Seq - ema26Seq)

        }

        if(this.macd.length >= 2){

        let signal = (this.macd[this.macd.length-1] * 2/ 10) + (this.macd[this.macd.length-2] * (1 - (2/10)))
        console.log('SIGNAL : ',signal)
        return signal
        }else{

            return null
        }


  }
 
}
