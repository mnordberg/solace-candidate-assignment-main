'use client';

import { useEffect, useState } from 'react';
import { Advocate } from '../types/advocate';
import Header from '../components/Header';

export default function Home() {
	const [advocates, setAdvocates] = useState<Advocate[]>([]);
	const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAdvocates = async () => {
			try {
				setLoading(true);
				const response = await fetch('/api/advocates');

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const jsonResponse = await response.json();
				setAdvocates(jsonResponse.data);
				setFilteredAdvocates(jsonResponse.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch advocates');
			} finally {
				setLoading(false);
			}
		};

		fetchAdvocates();
	}, []);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchValue = e.target.value;
		setSearchTerm(searchValue);

		const searchLower = searchValue.toLowerCase();
		const filtered = advocates.filter((advocate) => {
			return (
				advocate.firstName.toLowerCase().includes(searchLower) ||
				advocate.lastName.toLowerCase().includes(searchLower) ||
				advocate.city.toLowerCase().includes(searchLower) ||
				advocate.degree.toLowerCase().includes(searchLower) ||
				advocate.specialties.some((specialty) => specialty.toLowerCase().includes(searchLower)) ||
				advocate.yearsOfExperience.toString().includes(searchValue)
			);
		});

		setFilteredAdvocates(filtered);
	};

	const onReset = () => {
		setSearchTerm('');
		setFilteredAdvocates(advocates);
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			onReset();
		}
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

			<div className="mt-12 mb-6 relative">
				<input
					id="search"
					type="text"
					value={searchTerm}
					onChange={onChange}
					onKeyDown={onKeyDown}
					placeholder="Search by name, phone number, city, degree, or specialty..."
					aria-label="Search advocates by name, phone number, city, degree, or specialty"
					className="border border-gray-300 rounded-full px-5 py-3 w-full pr-10"
				/>
				{searchTerm && (
					<button
						onClick={onReset}
						aria-label="Clear search"
						className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all font-bold text-gray-500 hover:text-gray-800"
					>
						✕
					</button>
				)}
			</div>

			{filteredAdvocates.length === 0 ? (
				<p className="text-gray-600">No advocates found matching your search.</p>
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
						{filteredAdvocates.map((advocate) => {
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
