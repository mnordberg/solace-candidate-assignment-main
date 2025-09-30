'use client';

import { useEffect, useState } from 'react';
import { Advocate } from '../types/advocate';
import Header from '../components/Header';
import Search from '../components/Search';

export default function Home() {
	const [advocates, setAdvocates] = useState<Advocate[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSearching, setIsSearching] = useState(false);

	// Debounced search effect with server-side fetching
	useEffect(() => {
		const fetchAdvocates = async (search?: string) => {
			try {
				setIsSearching(true);
				const url = search ? `/api/advocates?search=${encodeURIComponent(search)}` : '/api/advocates';
				const response = await fetch(url);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const jsonResponse = await response.json();
				setAdvocates(jsonResponse.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch advocates');
			} finally {
				setLoading(false);
				setIsSearching(false);
			}
		};

		// Initial load
		if (loading) {
			fetchAdvocates();
			return;
		}

		// Debounced search
		const timeoutId = setTimeout(() => {
			fetchAdvocates(searchTerm || undefined);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchTerm, loading]);

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
	};

	const handleSearchReset = () => {
		setSearchTerm('');
	};

	if (loading) {
		return (
			<main className="m-6">
				<Header />
				<p>Loading advocates...</p>
			</main>
		);
	}

	if (error) {
		return (
			<main className="m-6 red-hat-display">
				<Header />
				<div className="flex flex-col items-center justify-center gap-8 min-h-[calc(100vh-6rem)]">
					<p className="text-6xl">{":'("}</p>
					<p className="forum-regular text-2xl text-gray-600 text-center">{error}</p>
				</div>
			</main>
		);
	}

	return (
		<main className="max-w-7xl mx-auto px-6 py-6">
			<Header />

			<Search
				value={searchTerm}
				onChange={handleSearchChange}
				onReset={handleSearchReset}
				isSearching={isSearching}
			/>

			{advocates.length === 0 ? (
				<p className="text-gray-600 text-center">No advocates found matching your search.</p>
			) : (
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-gray-100">
							<th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
							<th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
							<th className="border border-gray-300 px-4 py-2 text-left">City</th>
							<th className="border border-gray-300 px-4 py-2 text-left">Degree</th>
							<th className="border border-gray-300 px-4 py-2 text-left">Specialties</th>
							<th className="border border-gray-300 px-4 py-2 text-left">Years of Experience</th>
							<th className="border border-gray-300 px-4 py-2 text-left">Phone Number</th>
						</tr>
					</thead>
					<tbody>
						{advocates.map((advocate) => {
							return (
								<tr
									key={advocate.id}
									className="hover:bg-gray-50"
								>
									<td className="border border-gray-300 px-4 py-2">{advocate.firstName}</td>
									<td className="border border-gray-300 px-4 py-2">{advocate.lastName}</td>
									<td className="border border-gray-300 px-4 py-2">{advocate.city}</td>
									<td className="border border-gray-300 px-4 py-2">{advocate.degree}</td>
									<td className="border border-gray-300 px-4 py-2">
										{advocate.specialties.map((s, index) => (
											<div key={index}>{s}</div>
										))}
									</td>
									<td className="border border-gray-300 px-4 py-2">{advocate.yearsOfExperience}</td>
									<td className="border border-gray-300 px-4 py-2">{advocate.phoneNumber}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</main>
	);
}
