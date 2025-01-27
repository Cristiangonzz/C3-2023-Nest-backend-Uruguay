import { Injectable, NotFoundException } from '@nestjs/common';
import { NotAcceptableException } from '@nestjs/common/exceptions/not-acceptable.exception';
import { AccountEntity } from '../entity/account.entities';
import { AccountRepositoryInterface } from './account-repository.interface';
import { BaseRepository } from 'src/module/base/repositories';
import { PaginationModel } from 'src/module/base/models';




@Injectable()
export class AccountRepository
    extends BaseRepository<AccountEntity>
    implements AccountRepositoryInterface {
      
  register(entity: AccountEntity ): AccountEntity {

    const indexCurrentEntity = this.database.findIndex(
      (item) => item.id === entity.id && typeof item.delete_at === 'undefined'
    );
    if(indexCurrentEntity != -1 ){
      throw new NotFoundException(`Id : ${entity.id} ya existe.`)
    }
    
    this.database.push(entity);
    return  this.database.at(-1) ?? entity;
  }

  update(id: string, entity: AccountEntity  ):AccountEntity{
    const indexCurrentEntity = this.database.findIndex(
        (item) => item.id === id && typeof item.delete_at === 'undefined',
      );

      if(indexCurrentEntity === -1 ){
        throw new NotFoundException(`Id : ${id} no existe para actualizarlo .`)
      }
        this.database[indexCurrentEntity] = {
          ...this.database[indexCurrentEntity],
          ...entity,
          id,
        } as AccountEntity;
      return this.database[indexCurrentEntity];
  }

  findAll(pagination: PaginationModel): AccountEntity[] {
    pagination = {
      ... {offset: 0, limit: 20},
      ... pagination
    }
    return this.database.filter(
      (item) => typeof item.delete_at === 'undefined',
    ).slice(pagination.offset, pagination.offset + (pagination.limit || 0));
  }

  findOneById(id: string):AccountEntity {
    const currentEntity = this.database.findIndex(
        (item) => item.id === id);

      if(currentEntity == -1){
        throw new NotFoundException(`Id : ${id}(account) no existe`);
      }
      return this.database[currentEntity];  
  }

  findByState(state: boolean): AccountEntity[] {

    const indexCurrentEntity = this.database.filter(
    (item) =>
      item.state === state &&
      typeof item.delete_at === 'undefined',
    );
    //Si no hay cliente con este estado entonces mando un exepcion
    if(!indexCurrentEntity ){
      throw new NotFoundException(`State : ${state} not found`);
    }

    return indexCurrentEntity;
  }

  findByCustomer(customerId: string): AccountEntity[] {
    //Verifico que algun cliente este en se estado
    const indexCurrentEntity = this.database.filter(
    (item) =>
      item.coustomer_id.id === customerId &&
      typeof item.delete_at === 'undefined',
    );
    //Si no hay cliente con este estado entonces mando un exepcion
    if(!indexCurrentEntity){
        throw new NotFoundException(`customer Id : ${customerId} not found`);
    }

    return indexCurrentEntity;
  }

  findByAccountType(accountTypeId: string): AccountEntity[] {

    const indexCurrentEntity = this.database.filter(
      (item) =>
        item.account_type_id.id === accountTypeId &&
        typeof item.delete_at === 'undefined',
      );

      if(!indexCurrentEntity){
          throw new NotFoundException(`account Type Id: ${accountTypeId} not found`);
      }

      return indexCurrentEntity;
  }

  delete(id: string, soft?: boolean | undefined): void {
    const indexdelete = this.database.findIndex(
      index => index.id === id &&
      typeof index.delete_at === `undefined`);
      if (indexdelete == -1) throw new NotFoundException(`id : ${id} no found`);
      soft ? this.softDelete(indexdelete) : this.hardDelete(indexdelete);
  }

  private hardDelete(index: number): void {
    this.database.splice(index);
  }

  private softDelete(index: number): void {
    if (index < 0){
      throw new NotAcceptableException(`No se aceptan valores negativos`);
    }
    this.database[index].delete_at = new Date;
  }

}