export default class Stock
{
    static _id = 0;
    
    constructor(name, risk, mult, max_count, baseprice, changeRate)
    {
        this.ChangeRate = changeRate/100;
        this.CostData = [];
        this.CostData.push(baseprice);
        this.MaxCount = max_count;
        this.Count = max_count;
        this.Name = name;
        this.Id = ++Stock._id;
        this.Mult = mult;
        this.Risk = risk;
    }
    Step() {
        const currentPrice = this.CostData[this.CostData.length - 1];

        const shortTermFluctuation = this.getRandNumBetween(-this.Risk, this.Risk);
        
        const longTermTrend = this.Mult * 0.1; 

        let newPrice = currentPrice + shortTermFluctuation + longTermTrend;

        newPrice = Math.max(newPrice, 0);

        this.CostData.push(newPrice);

    }
    
    Buy() 
    {
        if (this.Count <= 0) {
            console.log("No more stocks available to buy.");
            return;
        }

        const currentPrice = this.CostData[this.CostData.length - 1];

        this.Count -= 1;

        const priceIncrease = currentPrice * this.ChangeRate;  
        const newPrice = currentPrice + priceIncrease;
        this.CostData.push(newPrice); 
    }
    Sell() {
        if (this.Count >= this.MaxCount) {
            console.log("You cannot sell stocks you do not own.");
            return;
        }

        const currentPrice = this.CostData[this.CostData.length - 1];

        this.Count += 1;

        const priceDecrease = currentPrice * this.ChangeRate;
        const newPrice = currentPrice - priceDecrease;
        this.CostData.push(newPrice); 
    }
    GetCurrentPrice() 
    {
        return this.CostData.length > 0 ? this.CostData[this.CostData.length - 1] : 100;
    }   
    getRandNumBetween(start, end)
    {
        return Math.random() * (end - start) + start;
    }
    GetStockObject()
    {
        return {
            "Name": this.Name,
            "Id": this.Id,
            "CostData": this.CostData,
            "Risk": this.Risk,
            "Mult": this.Mult,
            "ChangeRate": this.ChangeRate,
            "MaxCount": this.MaxCount,
            "Count": this.Count
        };
    }

}
