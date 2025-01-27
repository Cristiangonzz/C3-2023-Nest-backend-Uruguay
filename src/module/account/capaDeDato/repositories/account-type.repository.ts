import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../../../base/repositories/base.repository';

import { AccountTypeRepositoryInterface } from '.';
import { AccountTypeEntity } from '../entity';

@Injectable()
export class AccountTypeRepository
    extends BaseRepository<AccountTypeEntity>
    implements AccountTypeRepositoryInterface {

      

  static getInstance(): AccountTypeRepository {
    throw new Error('Method not implemented.');
  }

  register(entity: AccountTypeEntity):AccountTypeEntity  {
    const indexCurrentEntity = this.database.findIndex(
      (item) => item.id === entity.id || item.name.toUpperCase() == entity.name.toUpperCase());

    if (indexCurrentEntity != -1) throw new NotFoundException(`Id : ${entity.id} (accountType) ya existe`);

    
    this.database.push(entity);
    return this.database.at(-1) ?? entity;
  }

  update(id: string, entity: AccountTypeEntity):AccountTypeEntity {
    const indexCurrentEntity = this.database.findIndex(
        (item) => item.id === id );

    if (indexCurrentEntity === -1) throw new NotFoundException(`Id : ${id} no found`);

    this.database[indexCurrentEntity] = {
      ...this.database[indexCurrentEntity],
      ...entity,
      id,
    } as AccountTypeEntity;

    return this.database[indexCurrentEntity];
  }

  delete(id: string): void {
    const indexCurrentEntity = this.database.findIndex((item) => item.id === id);

    if (indexCurrentEntity === -1) throw new NotFoundException(`Id : ${id} no found`);

    this.database.splice(indexCurrentEntity); 
  }


  findAll(): AccountTypeEntity[] {
      return this.database.filter(
      (item) => item.state === true);
  }

  findOneById(id: string):AccountTypeEntity{
      let currentEntity = this.database.find(
          (Entity) => Entity.id == id);
      if (!currentEntity) throw new NotFoundException(`id :${id} no found`);
      return currentEntity;
  }

  findByState(state: boolean): AccountTypeEntity[] {
    let currentEntity =this.database.filter( (entity) => entity.state === state);
    if(!currentEntity){
      throw new NotFoundException(`State : ${state} not found`);
    }
    return currentEntity;
  }

  findByName(name: string): AccountTypeEntity[] {
  const currentEntity =this.database.filter( (entity) => entity.name === name);
  if(!currentEntity){
    throw new NotFoundException(`Name : ${name} not found`);
  }
    return currentEntity;
  }
}