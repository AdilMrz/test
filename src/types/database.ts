export interface Product {
  id: string;
  name: string;
  description: string;
  created_by?: string;
}

export interface Customer {
  id: string;
  fullname: string;
  email: string;
  address: string;
  created_by?: string;
}

export interface Purchase {
  id: string;
  customer_id: string;
  product_id: string;
  purchase_date: string;
  created_by?: string;
  customers?: Customer;
  products?: Product;
}
