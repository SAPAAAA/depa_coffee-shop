import { NotFoundError } from '@/modules/shared/utils/errors';
import { type CustomerRepository } from '@/modules/users/customers/customer.repository';
import customerRepository from '@/modules/users/customers/customer.repository';

class CustomerService {
  private readonly customerRepository: CustomerRepository;

  constructor(customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  getById = async (customerId: string) => {
    const customer = await this.customerRepository.getById(customerId);
    if (!customer) {
      throw new NotFoundError("Customer not found");
    }
    return customer;
  };

  update = async (customerId: string, updateData: any) => {
    const updatedCustomer = await this.customerRepository.update(
      customerId,
      updateData,
    );
    if (!updatedCustomer) {
      throw new NotFoundError("Customer not found");
    }
    return updatedCustomer;
  };
}

export type { CustomerService };
export default new CustomerService(customerRepository);