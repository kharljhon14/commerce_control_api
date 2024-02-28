import { Response, Request } from 'express';
import { sql } from '../db';
import { Product } from '../types/product';
import { QueryResult } from 'pg';
import { User } from '../types/user';
export async function getAllProducts(request: Request, response: Response) {
  try {
    const { page, q } = request.query;

    const pageNumber = page as string | undefined;

    const parsedNumber = Math.max(parseInt(pageNumber ?? '0', 10) - 1, 0);

    const limit = 10;
    const offset = parsedNumber * limit;

    let productRes: QueryResult<Product>;

    if (q) {
      productRes = await sql<Product>('select * from products where ilike $1 limit $2 offset $3', [
        `%${q}%`,
        limit,
        offset,
      ]);
    } else {
      productRes = await sql<Product>('select * from products limit $1 offset $2', [limit, offset]);
    }

    return response.json({ message: 'Success', data: productRes.rows });
  } catch (err) {
    if (err instanceof Error) return response.status(500).json({ message: err.message });
  }
}
