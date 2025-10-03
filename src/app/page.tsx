'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Advocate } from '../types/advocate';
import Header from '../components/Header';
import Search from '../components/Search';
import AdvocateCard from '../components/AdvocateCard';
import AdvocateCardSkeleton from '../components/AdvocateCardSkeleton';

export default function Home() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [advocates, setAdvocates] = useState<Advocate[]>([]);
	const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
	const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'fullName');
	const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');
	const [hasManualSort, setHasManualSort] = useState(searchParams.has('sortBy') || searchParams.has('sortOrder'));
	const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [loadingPrevious, setLoadingPrevious] = useState(false);
	const [loadingNext, setLoadingNext] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [isDebouncing, setIsDebouncing] = useState(false);
	const topRef = useRef<HTMLDivElement>(null);

	// Update URL when state changes
	useEffect(() => {
		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (hasManualSort) {
			params.set('sortBy', sortBy);
			params.set('sortOrder', sortOrder);
		}
		if (page > 1) params.set('page', page.toString());

		const newUrl = params.toString() ? `/?${params.toString()}` : '/';
		router.replace(newUrl, { scroll: false });
	}, [searchTerm, sortBy, sortOrder, page, hasManualSort, router]);

	// Debounced search effect with server-side fetching
	useEffect(() => {
		const fetchAdvocates = async () => {
			try {
				setIsDebouncing(false);
				setIsSearching(true);

				const params = new URLSearchParams();
				if (searchTerm) params.set('search', searchTerm);
				params.set('sortBy', sortBy);
				params.set('sortOrder', sortOrder);
				params.set('page', page.toString());

				const url = `/api/advocates?${params.toString()}`;
				const response = await fetch(url);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const jsonResponse = await response.json();
				setAdvocates(jsonResponse.data);
				setTotalPages(jsonResponse.pagination.totalPages);

				// Scroll to top after page change (but not initial load)
				if (!loading) {
					topRef.current?.scrollIntoView();
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch advocates');
			} finally {
				setLoading(false);
				setLoadingPrevious(false);
				setLoadingNext(false);
				setIsSearching(false);
			}
		};

		// Initial load
		if (loading) {
			fetchAdvocates();
			return;
		}

		// Show debounce indicator
		setIsDebouncing(true);

		// Debounced search
		const timeoutId = setTimeout(() => {
			fetchAdvocates();
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchTerm, sortBy, sortOrder, page, loading]);

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		setPage(1);
	};

	const handleSearchReset = () => {
		setSearchTerm('');
		setPage(1);
		// Focus the search input after reset
		document.getElementById('search')?.focus();
	};

	const handleSortChange = (newSortBy: string, newSortOrder: string) => {
		setSortBy(newSortBy);
		setSortOrder(newSortOrder);
		setHasManualSort(true);
		setPage(1);
	};

	const goPreviousPage = () => {
		setLoadingPrevious(true);
		setPage((prev) => Math.max(1, prev - 1));
	};

	const goNextPage = useCallback(() => {
		setLoadingNext(true);
		setPage((prev) => Math.min(prev + 1, totalPages));
	}, [totalPages]);

	if (error) {
		return (
			<main
				className="m-6 red-hat-display"
				role="main"
			>
				<Header />
				<section
					className="flex flex-col items-center justify-center gap-8 min-h-[calc(100vh-6rem)]"
					role="alert"
					aria-live="polite"
				>
					<p className="text-6xl">{":'("}</p>
					<p className="forum-regular text-2xl text-gray-600 text-center">{error}</p>
				</section>
			</main>
		);
	}

	return (
		<main
			className="max-w-7xl mx-auto px-6 py-6"
			role="main"
		>
			<div ref={topRef} />
			<Header />

			<section aria-label="Search and filter advocates">
				<Search
					value={searchTerm}
					onChange={handleSearchChange}
					onReset={handleSearchReset}
					isSearching={isSearching}
					isDebouncing={isDebouncing}
					sortBy={sortBy}
					sortOrder={sortOrder}
					onSortChange={handleSortChange}
					hasManualSort={hasManualSort}
				/>
			</section>

			<section
				aria-label="Advocate results"
				aria-live="polite"
				aria-busy={isSearching}
			>
				{isSearching || advocates.length === 0 ? (
					// Show skeleton when loading/searching or no results
					loading || isSearching || (!searchTerm && isDebouncing) ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<AdvocateCardSkeleton key={i} />
							))}
						</div>
					) : (
						// Show "no results" message when search returned nothing
						<div className="text-center py-16">
							<p className="text-xl text-gray-900 mb-2">No advocates match your search</p>
							<button
								onClick={handleSearchReset}
								className="text-gray-500 hover:text-solace transition-colors"
							>
								Try searching by name, city, or specialty
							</button>
						</div>
					)
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{advocates.map((advocate, index) => (
								<div
									key={advocate.id}
									style={{
										animation: 'fadeIn 0.4s ease-out forwards',
										animationDelay: `${(index % 20) * 40}ms`,
										opacity: 0
									}}
								>
									<AdvocateCard
										advocate={advocate}
										searchTerm={searchTerm}
									/>
								</div>
							))}
						</div>

						{totalPages > 1 && (
							<nav
								className="mt-8 flex justify-center items-center gap-2"
								aria-label="Pagination"
							>
								<button
									onClick={() => goPreviousPage()}
									disabled={page === 1 || isSearching}
									className="px-4 py-2 border border-gray-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
									aria-label="Go to previous page"
								>
									{loadingPrevious ? (
										<div
											className=" w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin-fast"
											aria-label="Loading previous page"
										/>
									) : (
										'Previous'
									)}
								</button>
								<span
									className="px-4 py-2 text-gray-700"
									aria-current="page"
								>
									Page {page} of {totalPages}
								</span>
								<button
									onClick={() => goNextPage()}
									disabled={page === totalPages || isSearching}
									className="px-4 py-2 border border-gray-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
									aria-label="Go to next page"
								>
									{loadingNext ? (
										<div
											className=" w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin-fast"
											aria-label="Loading next page"
										/>
									) : (
										'Next'
									)}
								</button>
							</nav>
						)}
					</>
				)}
			</section>
		</main>
	);
}
