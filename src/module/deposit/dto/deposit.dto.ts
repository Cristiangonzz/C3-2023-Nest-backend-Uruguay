import { IsNumber, IsUUID,IsMin, IsPositive } from 'class-validator';

export class depositDto{
    
    @IsUUID(4, { message: "this must to be uuid" })
    accountTypeId: string;
    
    @IsNumber()
    @IsPositive()
    amount: number;

}