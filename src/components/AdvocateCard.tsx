import { useState } from 'react';
import { Advocate } from '../types/advocate';

interface AdvocateCardProps {
	advocate: Advocate;
	searchTerm?: string;
}

function formatPhoneNumber(phoneNumber: string): string {
	// Assumes phone is stored as digits only (e.g., "5551234567")
	const cleaned = phoneNumber.replace(/\D/g, '');
	if (cleaned.length === 10) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
	}
	return phoneNumber; // Return as-is if not standard format
}

function getDisplayedSpecialties(specialties: string[], searchTerm?: string) {
	if (!searchTerm || searchTerm.trim() === '') {
		// No search: show first specialty + count
		const first = specialties[0];
		const remaining = specialties.length - 1;
		return {
			displayed: [first],
			remaining
		};
	}

	// Split search terms (same logic as backend)
	const terms = searchTerm
		.split(/[\s,]+/)
		.filter((term) => term.trim() !== '')
		.map((term) => term.toLowerCase());

	// Find specialties that match any search term
	const matched = specialties.filter((specialty) => terms.some((term) => specialty.toLowerCase().includes(term)));

	if (matched.length > 0) {
		// Show matched specialties + count of remaining
		return {
			displayed: matched,
			remaining: specialties.length - matched.length
		};
	}

	// No matches: show first specialty + count
	const first = specialties[0];
	const remaining = specialties.length - 1;
	return {
		displayed: [first],
		remaining
	};
}

export default function AdvocateCard({ advocate, searchTerm }: AdvocateCardProps) {
	const [showAllSpecialties, setShowAllSpecialties] = useState(false);
	const { displayed, remaining } = getDisplayedSpecialties(advocate.specialties, searchTerm);

	const specialtiesToShow = showAllSpecialties ? advocate.specialties : displayed;

	return (
		<div className="border border-gray-200 rounded-3xl p-6 box-content hover:border-solace hover:shadow-solace-200 hover:shadow transition-all bg-white flex flex-col">
			<div className="flex justify-between items-start mb-4">
				<h3 className="text-xl font-semibold text-gray-900">
					{advocate.firstName} {advocate.lastName}
				</h3>
				<a
					href={`tel:${advocate.phoneNumber}`}
					className="text-solace hover:text-solace-700 font-medium"
				>
					{formatPhoneNumber(advocate.phoneNumber)}
				</a>
			</div>

			<div className="space-y-0 md:space-y-1 text-sm text-gray-600">
				<div className="flex gap-3">
					<span className="font-medium text-gray-700">Degree:</span>
					<span>{advocate.degree}</span>
				</div>
				<div className="flex gap-3">
					<span className="font-medium text-gray-700">Location:</span>
					<span>{advocate.city}</span>
				</div>
				<div className="flex gap-3">
					<span className="font-medium text-gray-700 ">Experience:</span>
					<span>{advocate.yearsOfExperience} years</span>
				</div>
			</div>

			<div className="mt-auto pt-4">
				<span className="text-sm font-medium text-gray-700 block mb-2">Specialties:</span>
				<div className="flex flex-wrap gap-2">
					{specialtiesToShow.map((specialty, index) => (
						<span
							key={index}
							className="px-3 py-1 bg-solace-100 text-solace-800 rounded-full text-xs"
						>
							{specialty}
						</span>
					))}
					{!showAllSpecialties && remaining > 0 && (
						<button
							onClick={() => setShowAllSpecialties(true)}
							className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors"
						>
							+ {remaining} more
						</button>
					)}
					{showAllSpecialties && (
						<button
							onClick={() => setShowAllSpecialties(false)}
							className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors"
						>
							Show less
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
