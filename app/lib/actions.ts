'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, auth } from "@/auth";
import { prisma } from "./prisma";
import type { State } from "./definitions";
import type { StateProduct } from "./definitions";



const invoicesFormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Amount must be greater than $0" })
    .max(92233720368547.75, { message: "Amount is too large. Maximum allowed is $92,233,720,368,547.75" }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: "Please select a invoice status",
  }),
  date: z.string()
});


const productFormSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(3, { message: "Product name must be at least 3 characters" })
    .max(100, { message: "Product name is too long. Maximum length is 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-_.,]+$/, { message: "Product name contains invalid characters" })
    .trim(),
  description: z.string()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description is too long. Maximum length is 500 characters" })
    .trim(),
  price: z.coerce
    .number()
    .positive({ message: "Price must be greater than $0" })
    .max(9999999.99, { message: "Price is too large. Maximum allowed is $9,999,999.99" })
    .multipleOf(0.01, { message: "Price must have at most 2 decimal places" }),
  category: z.string()
    .min(1, { message: "Please select a category" })
    .max(50, { message: "Category name is too long" })
    .trim(),
  stock: z.coerce
    .number()
    .int({ message: "Stock must be a whole number" })
    .nonnegative({ message: "Stock cannot be negative" })
    .max(999999, { message: "Stock quantity is too large" }),
  isActive: z.enum(['true', 'false'], {
    invalid_type_error: "Please select product status",
  }),
  createdById: z.string().uuid().optional(),
  updatedById: z.string().uuid().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const CreateInvoice = invoicesFormSchema.omit({ id: true, date: true });
const UpdateInvoice = invoicesFormSchema.omit({ id: true, date: true });
const CreateProduct = productFormSchema.omit({ id: true, createdAt: true, updatedAt: true, createdById: true, updatedById: true });
const UpdateProduct = productFormSchema.omit({ id: true, createdAt: true, updatedAt: true, createdById: true, updatedById: true });




const validatedFields = (formData: FormData, action: 'create' | 'update') => {
  return action === 'create' ? CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  }) : UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
};

// Authentication function
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {

    const credentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }
    await signIn('credentials', { ...credentials });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}


// Invoice functions
export async function createInvoice(prevState: State, formData: FormData) {

  const validatedFieldsCreate = validatedFields(formData, 'create');

  if (!validatedFieldsCreate.success) {
    return {
      errors: validatedFieldsCreate.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to create invoice.'
    }
  }

  const { customerId, amount, status } = validatedFieldsCreate.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await prisma.invoice.create({
      data: {
        customer_id: customerId,
        amount: BigInt(amountInCents),
        status,
        date: new Date(date),
      },
    });
  } catch (err) {
    console.error('Database Error:', err);
    throw err instanceof Error ? err : new Error('Failed to create invoice on DB');
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  if (!id) {
    console.error('updateInvoice missing id');
    throw new Error('Missing invoice id');
  }
  const validatedFieldsUpdate = validatedFields(formData, 'update');

  if (!validatedFieldsUpdate.success) {
    return {
      errors: validatedFieldsUpdate.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to update invoice.'
    }
  }

  const { customerId, amount, status } = validatedFieldsUpdate.data;
  const amountInCents = amount * 100;

  try {
    await prisma.invoice.update({
      where: { id },
      data: {
        customer_id: customerId,
        amount: BigInt(amountInCents),
        status,
      },
    });
  } catch (err) {
    console.error('Database Error:', err);
    throw err instanceof Error ? err : new Error('Failed to update invoice on DB');
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {

  if (!id) {
    console.error('deleteInvoice missing id');
    throw new Error('Missing invoice id');
  }

  try {
    await prisma.invoice.delete({
      where: { id },
    });
  } catch (err) {
    console.error('Database Error:', err);
    throw err instanceof Error ? err : new Error('Failed to delete invoice on DB');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


// Product functions
export async function createProduct(prevState: StateProduct, formData: FormData) {
  const validatedFields = CreateProduct.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    category: formData.get('category'),
    stock: formData.get('stock'),
    isActive: formData.get('isActive'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to create product.'
    }
  }

  const { name, description, price, category, stock, isActive } = validatedFields.data;

  // Get authenticated user
  const session = await auth();

  if (!session?.user?.id) {
    return {
      errors: {},
      message: 'Unauthorized.'
    }
  }

  const userId = session.user.id;

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        stock,
        isActive: isActive === 'true',
        createdById: userId,
        updatedById: userId,
      },
    });
  } catch (err) {
    console.error('Database Error:', err);
    throw err instanceof Error ? err : new Error('Failed to create product on DB');
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function updateProduct(id: string, prevState: StateProduct, formData: FormData) {
  if (!id) {
    console.error('updateProduct missing id');
    throw new Error('Missing product id');
  }

  const validatedFields = UpdateProduct.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    category: formData.get('category'),
    stock: formData.get('stock'),
    isActive: formData.get('isActive'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to update product.'
    }
  }

  const { name, description, price, category, stock, isActive } = validatedFields.data;

  // Get authenticated user
  const session = await auth();

  if (!session?.user?.id) {
    return {
      errors: {},
      message: 'Unauthorized.'
    }
  }

  const userId = session.user.id;

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        category,
        stock,
        isActive: isActive === 'true',
        updatedById: userId,
      },
    });
  } catch (err) {
    console.error('Database Error:', err);
    throw err instanceof Error ? err : new Error('Failed to update product on DB');
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
  if (!id) {
    console.error('deleteProduct missing id');
    throw new Error('Missing product id');
  }

  try {
    await prisma.product.delete({
      where: { id },
    });
  } catch (err) {
    console.error('Database Error:', err);
    throw err instanceof Error ? err : new Error('Failed to delete product on DB');
  }

  revalidatePath('/dashboard/products');
}