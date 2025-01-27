import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from "../../capaDeDato/repository/customer.repository";
import { CustomerEntity } from 'src/module/customer/capaDeDato/entity/customer.entity';
import { CustomerDto } from '../dto/customer.dto';
import { AccountService } from 'src/module/account/capaLogicaDeNegocio/service';
import { DocumentTypeEntity } from '../../capaDeDato/entity';
import { DocumentTypeRepository } from '../../capaDeDato/repository';
import { DocumentTypeDto } from '../dto/documentType.dto';
import { CustomerStateDTO } from '../dto/customerStateDto';

@Injectable()
export class CustomerService {
  

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly documentTypeRepository: DocumentTypeRepository,
    private readonly accountService: AccountService) {
      this.Fijos();
    }

  createCustomer(customer: CustomerDto):CustomerEntity {
    const documentType = new DocumentTypeEntity();
    documentType.id = customer.documentType;

    const newCustomer = new CustomerEntity();
    newCustomer.document = customer.document;
    newCustomer.documentType = documentType;
    newCustomer.email = customer.email;
    newCustomer.fullName = customer.fullName;
    newCustomer.password = customer.password;
    newCustomer.phone = customer.phone;

    return this.customerRepository.register(newCustomer);
  }

  createDocumentType(documentType : DocumentTypeDto):DocumentTypeEntity{
    const newDocumentType = new DocumentTypeEntity();
    newDocumentType.name = documentType.name;
    return this.documentTypeRepository.register(newDocumentType);
  }

  getCustomerInfo(customerId: string): CustomerEntity {
    let customer = this.customerRepository.findOneById(customerId);  
    return customer;
  }
  
  findOneByEmailAndPassword(email: string, password: string):CustomerEntity{
    let Customer = this.customerRepository.findOneByEmailAndPassword(email,password);
    if(!Customer) throw new NotFoundException(`Email : ${email} and password: ${password} Not found`);
    return Customer;
  }

  findEmail(email: string):CustomerEntity{
    let Customer = this.customerRepository.findEmail(email);
    if(!Customer) throw new NotFoundException(`Email : ${email} Not found`);
    return Customer;
  }

  findAll(): CustomerEntity[] {
    return this.customerRepository.findAll();
  }
  findAllDocumentType(): DocumentTypeEntity[] {
    return this.documentTypeRepository.findAll();
  }

  findByIdDocumentType(id : string):DocumentTypeEntity{
    return this.documentTypeRepository.findOneById(id);
  }
  

  updatedCustomer(id: string, newCustomer: CustomerDto ): CustomerEntity{
    let customer = this.customerRepository.findOneById(id);
    if(!customer) throw new NotFoundException(`No se encontro el customer con el id : ${id}`)
    
    let documentType = new DocumentTypeEntity();
    documentType.id = newCustomer.documentType;

    
    customer.documentType = documentType;
    customer.document = newCustomer.document;
    customer.fullName = newCustomer.fullName;
    customer.email = newCustomer.email;
    customer.phone = newCustomer.phone;
    customer.password = newCustomer.password;

    return this.customerRepository.update(id,customer);
    
  }

  
  unsubscribe(id: string): boolean {

    const accounts = this.accountService.findByCustomer(id);

    const index = accounts.findIndex((account) => account.balance != 0);

    if (index != -1)throw new Error( 'La cuenta tiene balance 0 ', );
      
    this.customerRepository.delete(id, true);

    return true;

  }

  changeState(customerId: string ,state: CustomerStateDTO): void {
    const customer = this.customerRepository.findOneById(customerId);
    customer.state = state.state;

    this.customerRepository.update(customerId, customer);
  }

  deleteCustomer(customerId: string, soft?: boolean): void {
    if(soft) this.customerRepository.delete(customerId, soft);

    this.customerRepository.delete(customerId);
  }

  //Datos fijos de document type
  documentType1: DocumentTypeEntity = {
    id : "1",
    name: "Cedula",
    state: true
  }
  documentType2: DocumentTypeEntity = {
    id : "2",
    name: "Credencial",
    state: true
  }
  documentType3: DocumentTypeEntity = {
    id : "3",
    name: "Pasaporte",
    state: true
  }
  //Datos fijos de customer
  customer1: CustomerEntity = {
    id:"1",
    documentType: this.documentType1,
    document: "12345678",
    fullName: "Cristian Castro",
    email: "cris@gmail.com",
    phone: "09212324",
    password: "cris12344",
    avatarUrl: undefined,
    state : true,
    daletedAt: undefined, 
  }
  
  Fijos(){
    this.documentTypeRepository.register(this.documentType1);
    this.documentTypeRepository.register(this.documentType2);
    this.documentTypeRepository.register(this.documentType3);
    this.customerRepository.register(this.customer1);
  }

}