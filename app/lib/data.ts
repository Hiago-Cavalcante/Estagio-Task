import postgres from 'postgres';
import { PrismaClient } from '@prisma/client';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const prisma = new PrismaClient();

// ==================== REVENUE ====================
export async function fetchRevenue() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

// ==================== INVOICES ====================
export async function fetchLatestInvoices() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      amount: invoice.amount / 100,
    }));

    console.log(invoice);
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

// ==================== CUSTOMERS ====================
export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

// ==================== PRODUCTS ====================

/**
 * Busca todos os produtos ativos
 */
export async function fetchProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

/**
 * Busca produtos com filtro e paginação
 */
const ITEMS_PER_PAGE_PRODUCTS = 10;

export async function fetchFilteredProducts(
  query: string,
  currentPage: number,
  category?: string,
  status?: string,
  sortBy?: string
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCTS;

  try {
    const whereConditions: {
      AND: Array<{
        OR?: Array<{
          name?: { contains: string; mode: 'insensitive' };
          description?: { contains: string; mode: 'insensitive' };
          category?: { contains: string; mode: 'insensitive' };
        }>;
        category?: string;
        isActive?: boolean;
      }>;
    } = {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
      ],
    };

    // Add category filter if provided
    if (category && category !== 'all') {
      whereConditions.AND.push({ category: category });
    }

    // Add status filter if provided
    if (status && status !== 'all') {
      whereConditions.AND.push({ isActive: status === 'active' });
    }

    // Determine sort order
    type OrderByType =
      | { name: 'asc' | 'desc' }
      | { price: 'asc' | 'desc' }
      | { createdAt: 'asc' | 'desc' }
      | { updatedAt: 'asc' | 'desc' };

    let orderBy: OrderByType = { name: 'asc' }; // Default

    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          orderBy = { name: 'asc' };
          break;
        case 'name-desc':
          orderBy = { name: 'desc' };
          break;
        case 'price-asc':
          orderBy = { price: 'asc' };
          break;
        case 'price-desc':
          orderBy = { price: 'desc' };
          break;
        case 'createdAt-asc':
          orderBy = { createdAt: 'asc' };
          break;
        case 'createdAt-desc':
          orderBy = { createdAt: 'desc' };
          break;
        case 'updatedAt-asc':
          orderBy = { updatedAt: 'asc' };
          break;
        case 'updatedAt-desc':
          orderBy = { updatedAt: 'desc' };
          break;
        default:
          orderBy = { name: 'asc' };
      }
    }

    const products = await prisma.product.findMany({
      where: whereConditions,
      orderBy: orderBy,
      skip: offset,
      take: ITEMS_PER_PAGE_PRODUCTS,
      include: {
        createdByUser: {
          select: {
            name: true,
          },
        },
        updatedByUser: {
          select: {
            name: true,
          },
        },
      },
    });

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered products.');
  }
}

/**
 * Calcula o número total de páginas para produtos filtrados
 */
export async function fetchProductsPages(
  query: string,
  category?: string,
  status?: string
) {
  try {
    const whereConditions: {
      AND: Array<{
        OR?: Array<{
          name?: { contains: string; mode: 'insensitive' };
          description?: { contains: string; mode: 'insensitive' };
          category?: { contains: string; mode: 'insensitive' };
        }>;
        category?: string;
        isActive?: boolean;
      }>;
    } = {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
      ],
    };

    // Add category filter if provided
    if (category && category !== 'all') {
      whereConditions.AND.push({ category: category });
    }

    // Add status filter if provided
    if (status && status !== 'all') {
      whereConditions.AND.push({ isActive: status === 'active' });
    }

    const count = await prisma.product.count({
      where: whereConditions,
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE_PRODUCTS);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

/**
 * Busca um produto por ID
 */
export async function fetchProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    return product;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

/**
 * Busca produtos por categoria
 */
export async function fetchProductsByCategory(category: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products by category.');
  }
}

/**
 * Busca todas as categorias únicas
 */

export async function fetchProductCategories() {
  try {
    const categories = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    return categories.map(c => c.category);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product categories.');
  }
}

// ==================== PRODUCTS CATEGORY COUNT ====================
export async function fetchProductsCategoryCount() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const productsByCategory = await prisma.product.groupBy({
      by: ['category'],
      where: {
        isActive: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        category: 'desc',
      },
    });

    return productsByCategory.map(item => ({
      category: item.category,
      count: item._count.id,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products category count.');
  }
}

// ==================== PRODUCTS CARD DATA ====================
export async function fetchProductsCardData() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const [totalProducts, stockValue, categoriesCount] = await Promise.all([
      // Total de produtos ativos
      prisma.product.count({
        where: {
          isActive: true,
        },
      }),

      // Valor total em estoque (preço * quantidade)
      prisma.product.aggregate({
        where: {
          isActive: true,
        },
        _sum: {
          stock: true,
        },
        _avg: {
          price: true,
        },
      }),

      // Número de categorias distintas
      prisma.product.findMany({
        where: {
          isActive: true,
        },
        select: {
          category: true,
        },
        distinct: ['category'],
      }),
    ]);

    // Calcular valor estimado do estoque
    const totalStockValue = await prisma.product.aggregate({
      where: {
        isActive: true,
      },
      _sum: {
        price: true,
      },
    });

    // Melhor cálculo: somar (preço * quantidade) de cada produto
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        price: true,
        stock: true,
      },
    });

    const totalInventoryValue = products.reduce((acc, product) => {
      return acc + (Number(product.price) * product.stock);
    }, 0);

    return {
      totalProducts,
      totalInventoryValue: formatCurrency(totalInventoryValue),
      numberOfCategories: categoriesCount.length,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products card data.');
  }
}

// ==================== LOW STOCK PRODUCTS ====================
export async function fetchLowStockProducts() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: {
          lte: 2, // Estoque menor ou igual a 2
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
        category: true,
      },
      orderBy: [
        {
          stock: 'asc', // Primeiro os sem estoque (0)
        },
        {
          name: 'asc', // Depois ordena por nome
        },
      ],
    });

    return lowStockProducts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch low stock products.');
  }
}

// ==================== TOP AND BOTTOM PRICED PRODUCTS ====================
export async function fetchTopAndBottomPricedProducts() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const [topPriced, bottomPriced] = await Promise.all([
      // 5 produtos mais caros
      prisma.product.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
        },
        orderBy: {
          price: 'desc',
        },
        take: 5,
      }),

      // 5 produtos mais baratos
      prisma.product.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 5,
      }),
    ]);

    return {
      topPriced,
      bottomPriced,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch top and bottom priced products.');
  }
}

// ==================== ANALYTICS ====================
export async function fetchProductsCreatedByMonth() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Agrupar por mês
    const monthlyData = products.reduce((acc: { [key: string]: number }, product) => {
      const date = new Date(product.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    // Converter para array e formatar
    const sortedData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthYear, count]) => {
        const [year, month] = monthYear.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
          month: `${monthNames[parseInt(month) - 1]} ${year}`,
          count,
        };
      });

    return sortedData;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products created by month.');
  }
}




