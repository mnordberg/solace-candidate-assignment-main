import db from '../../../db';
import { advocates } from '../../../db/schema';
import { or, ilike, sql, asc, desc, count } from 'drizzle-orm';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const search = searchParams.get('search');
	const sortBy = searchParams.get('sortBy') || 'fullName';
	const sortOrder = searchParams.get('sortOrder') || 'asc';
	const page = parseInt(searchParams.get('page') || '1');
	const limit = parseInt(searchParams.get('limit') || '20');

	const offset = (page - 1) * limit;

	let query = db.select().from(advocates);
	let countQuery = db.select({ count: count() }).from(advocates);

	if (search && search.trim() !== '') {
		// Split search into terms, removing commas and extra spaces
		const terms = search
			.split(/[\s,]+/)
			.filter((term) => term.trim() !== '')
			.map((term) => `%${term}%`);

		// For each term, check if it matches ANY field
		// Then ensure ALL terms have at least one match
		const termConditions = terms.map((searchTerm) => {
			// Create a version stripped of non-alphanumeric for phone matching
			// For this demo, assume phone numbers are stored as digits only
			const strippedTerm = `%${searchTerm.slice(1, -1).replace(/[^a-zA-Z0-9]/g, '')}%`;

			return or(
				ilike(advocates.firstName, searchTerm),
				ilike(advocates.lastName, searchTerm),
				ilike(advocates.city, searchTerm),
				ilike(advocates.degree, searchTerm),
				ilike(advocates.phoneNumber, strippedTerm),
				sql`${advocates.specialties}::text ILIKE ${searchTerm}`
			);
		});

		const whereClause = sql`${sql.join(termConditions, sql` AND `)}`;
		query = query.where(whereClause) as typeof query;
		countQuery = countQuery.where(whereClause) as typeof countQuery;
	}

	const sortFn = sortOrder === 'desc' ? desc : asc;

	// Apply sorting and pagination
	switch (sortBy) {
		case 'experience':
			query = query.orderBy(sortFn(advocates.yearsOfExperience)).limit(limit).offset(offset) as typeof query;
			break;
		case 'degree':
			query = query.orderBy(sortFn(advocates.degree)).limit(limit).offset(offset) as typeof query;
			break;
		case 'fullName':
		default:
			// Default to fullName sorting
			query = query
				.orderBy(sortFn(advocates.lastName), sortFn(advocates.firstName))
				.limit(limit)
				.offset(offset) as typeof query;
			break;
	}

	// Execute queries
	const [data, totalResult] = await Promise.all([query, countQuery]);

	const total = totalResult[0]?.count || 0;
	const totalPages = Math.ceil(total / limit);

	return Response.json({
		data,
		pagination: {
			page,
			limit,
			total,
			totalPages
		}
	});
}
