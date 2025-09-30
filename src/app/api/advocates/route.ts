import db from '../../../db';
import { advocates } from '../../../db/schema';
import { or, ilike, sql } from 'drizzle-orm';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const search = searchParams.get('search');

	let data;

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

		// All terms must match (AND logic)
		data = await db
			.select()
			.from(advocates)
			.where(sql`${sql.join(termConditions, sql` AND `)}`);
	} else {
		data = await db.select().from(advocates);
	}

	return Response.json({ data });
}
