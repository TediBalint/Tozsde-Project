export default class Stock {
  static _id = 0;

  constructor(name, risk, mult, max_count, baseprice, changeRate) {
    this.ChangeRate = changeRate / 100;
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

  Buy(amount) {
    const currentPrice = this.CostData[this.CostData.length - 1];
    let newPrice = currentPrice;
    let priceIncrease = 0;

    for (let i = 0; i < amount; i++) {
      if (this.Count <= 0) {
        console.log("No more stocks available to buy.");
        return false;
      }
      this.Count -= 1;

      priceIncrease = currentPrice * this.ChangeRate;
      newPrice = currentPrice + priceIncrease;
    }
    if (newPrice != currentPrice) {
      this.CostData.push(newPrice);
    }
    return true;
  }

  Sell(amount) {
    const currentPrice = this.CostData[this.CostData.length - 1];
    let priceDecrease = 0;
    let newPrice = currentPrice;
    for (let i = 0; i < amount; i++) {
      if (this.Count >= this.MaxCount) {
        console.log("You cannot sell stocks you do not own.");
        return false;
      }
      priceDecrease = currentPrice * this.ChangeRate;
      newPrice = currentPrice - priceDecrease;
    }

    this.Count += amount;
    if (newPrice != currentPrice) {
      this.CostData.push(newPrice);
    }
    return true;
  }

  GetCurrentPrice() {
    return this.CostData.length > 0
      ? this.CostData[this.CostData.length - 1]
      : 100;
  }
  
  getRandNumBetween(start, end) {
    return Math.random() * (end - start) + start;
  }
  GetStockObject() {
    return {
      Name: this.Name,
      Id: this.Id,
      CostData: this.CostData,
      Risk: this.Risk,
      Mult: this.Mult,
      ChangeRate: this.ChangeRate,
      MaxCount: this.MaxCount,
      Count: this.Count,
    };
  }
}
