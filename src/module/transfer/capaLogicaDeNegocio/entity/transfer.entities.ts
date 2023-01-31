import { TransferModel } from '../../capaDeDatos/model/transfer.model';
import { v4 as uuid } from 'uuid';
import { AccountEntity } from '../../../account/capaLogicaDeNegocio/entity/account.entities';


export class TransferEntity implements TransferModel{
    id = uuid();
    outcome: AccountEntity;
    income: AccountEntity;
    amount: number;
    reason: string;
    date_time: Date | number;
    delete_at: Date | number;
}