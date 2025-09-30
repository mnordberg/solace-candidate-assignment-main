'use client';

import { useEffect, useState } from 'react';
import { Advocate } from '../types/advocate';
import Header from '../components/Header';
import Search from '../components/Search';
import AdvocateCard from '../components/AdvocateCard';

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
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{advocates.map((advocate) => (
						<AdvocateCard
							key={advocate.id}
							advocate={advocate}
							searchTerm={searchTerm}
						/>
					))}
				</div>
			)}
		</main>
	);
}
