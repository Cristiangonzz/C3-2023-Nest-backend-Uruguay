import { Injectable } from '@nestjs/common';

import { DepositModel, PaginationModel } from '../../models/';
import { Deposit } from 'src/persistence/entities/deposit.entities';
import { DepositRepository } from '../../persistence/repositories/deposit.repository';


@Injectable()
export class DepositService {
  constructor(private readonly DepositRepo : DepositRepository){}

  /**
   * Crear un deposito
   *
   * @param {DepositModel} deposit
   * @return {*}  {DepositEntity}
   * @memberof DepositService
   */
  createDeposit(deposit: DepositModel): Deposit {
    const newDeposit = new Deposit();
    newDeposit.dep_id = deposit.dep_id
    newDeposit.account_id = deposit.account_id
    newDeposit.dep_amount = deposit.dep_amount
    newDeposit.dep_date_time = deposit.dep_date_time
    newDeposit.dep_delete_at = deposit.dep_delete_at
    return this.DepositRepo.register(newDeposit);
  }

  /**
   * Borrar un deposito
   *
   * @param {string} depositId
   * @memberof DepositService
   */
  deleteDeposit(depositId: string): void {
    this.DepositRepo.delete(depositId);//Que hago con el soft?
  }

  /**
   * Obtener el historial de los depósitos en una cuenta
   *
   * @param {string} depositId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dataRange]
   * @return {*}  {DepositEntity[]}
   * @memberof DepositService
   */
  getHistory(depositId: string , pagination?: PaginationModel,dataRange?: string /*DataRangeModel*/): Deposit[] {
    //Lo que me falta es que es de todos los depositos 
    const deposit = this.DepositRepo.findByDataRange(pagination.offset,pagination.offset);//el historial de todas las cuenta en ese rango

    const depo = deposit.filter((depo) => depo.dep_id === depositId);//Mismo rango pero para el id del parametro
    return depo;
  }
}