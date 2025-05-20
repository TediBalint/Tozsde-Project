export default interface IUser
{
    Id: number | Number;
    Name: string;
    Password: string;
    StocksCount: Array<number>;
    Balance: number | Number // lehet felesleges
}
