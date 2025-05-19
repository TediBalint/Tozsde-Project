export default interface IStock
{
    Name: string;
    Id: number;
    CostData: Array<number>;
    Risk: number;
    Mult: number;
    ChangeRate: number;
    MaxCount: number;
    Count: number;
}
