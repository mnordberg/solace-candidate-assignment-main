'use client';

import { useEffect, useRef, useState } from 'react';

interface SortPopoverProps {
	sortBy: string;
	sortOrder: string;
	onSortChange: (sortBy: string, sortOrder: string) => void;
	hasManualSelection: boolean;
}

export default function SortPopover({ sortBy, sortOrder, onSortChange, hasManualSelection }: SortPopoverProps) {
	const [isOpen, setIsOpen] = useState(false);
	const popoverRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const sortFields = [
		{ key: 'fullName', label: 'Name' },
		{ key: 'experience', label: 'Experience' },
		{ key: 'degree', label: 'Degree' }
	];

	const handleSort = (field: string, order: string) => {
		onSortChange(field, order);
	};

	const activeField = sortFields.find((f) => f.key === sortBy);
	const activeLabel = activeField ? activeField.label : 'Name';

	return (
		<div
			className="relative"
			ref={popoverRef}
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="border border-gray-300 rounded-full p-3.5 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-solace"
				aria-label="Sort options"
			>
				{hasManualSelection ? (
					sortOrder === 'asc' ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-5 h-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.5 15.75l7.5-7.5 7.5 7.5"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-5 h-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19.5 8.25l-7.5 7.5-7.5-7.5"
							/>
						</svg>
					)
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="w-5 h-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
						/>
					</svg>
				)}
				{hasManualSelection && <span className="text-sm text-gray-700">{activeLabel}</span>}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[240px]">
					<div className="p-3">
						<h3 className="text-sm font-semibold text-gray-700 mb-3">Sort by</h3>
						<div className="space-y-2">
							{sortFields.map((field) => (
								<div
									key={field.key}
									className="flex items-center justify-between py-1"
								>
									<span className="text-sm text-gray-700">{field.label}</span>
									<div className="flex gap-1">
										<button
											onClick={() => handleSort(field.key, 'asc')}
											className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-solace ${
												sortBy === field.key && sortOrder === 'asc'
													? 'bg-solace text-white'
													: 'hover:bg-gray-100 text-gray-600'
											}`}
											aria-label={`Sort ${field.label} ascending`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={2}
												stroke="currentColor"
												className="w-4 h-4"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M4.5 15.75l7.5-7.5 7.5 7.5"
												/>
											</svg>
										</button>
										<button
											onClick={() => handleSort(field.key, 'desc')}
											className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-solace ${
												sortBy === field.key && sortOrder === 'desc'
													? 'bg-solace text-white'
													: 'hover:bg-gray-100 text-gray-600'
											}`}
											aria-label={`Sort ${field.label} descending`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={2}
												stroke="currentColor"
												className="w-4 h-4"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M19.5 8.25l-7.5 7.5-7.5-7.5"
												/>
											</svg>
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
