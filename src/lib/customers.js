let customers = [{
  id: 'abc123',
  name: 'jane doe',
  address: '123 fake street, anytown USA'
}];

const get = () => customers;

const add = ({ customer }) => customers.push(customer);

const remove = ({ id }) => {
  customers = customers.filter(customer => customer.id !== id);
};

module.exports = {
  get,
  add,
  remove
};
