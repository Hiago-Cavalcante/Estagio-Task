// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import exp from "constants";

// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type ProductTable = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number; // stored in cents for UI formatting
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
  createdByUser?: {
    name: string;
  } | null;
  updatedByUser?: {
    name: string;
  } | null;
};

export type ProductForm = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
};

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};


export type StateProduct = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    category?: string[];
    stock?: string[];
    isActive?: string[];
  };
  message?: string | null;
};


export type ProductCategoryData = {
  category: string;
  count: number;
};


export type ProductsChartProps = {
  data: ProductCategoryData[];
};

export type ProductFormProps = {
  product?: ProductForm
  mode: 'create' | 'edit'
  categories: string[]
}