export default function AdvocateCardSkeleton() {
	return (
		<div className="border border-gray-200 rounded-3xl p-6 bg-white animate-pulse">
			{/* Header - Name and Phone */}
			<div className="flex justify-between items-start mb-4">
				<div className="h-6 bg-gray-200 rounded w-40" />
				<div className="h-5 bg-gray-200 rounded w-28" />
			</div>

			{/* Info fields */}
			<div className="space-y-2 mb-4">
				<div className="flex gap-3">
					<div className="h-4 bg-gray-200 rounded w-16" />
					<div className="h-4 bg-gray-200 rounded w-12" />
				</div>
				<div className="flex gap-3">
					<div className="h-4 bg-gray-200 rounded w-16" />
					<div className="h-4 bg-gray-200 rounded w-24" />
				</div>
				<div className="flex gap-3">
					<div className="h-4 bg-gray-200 rounded w-16" />
					<div className="h-4 bg-gray-200 rounded w-20" />
				</div>
			</div>

			{/* Specialties section */}
			<div className="mt-auto pt-4">
				<div className="h-4 bg-gray-200 rounded w-20 mb-2" />
				<div className="flex flex-wrap gap-2">
					<div className="h-6 bg-gray-200 rounded-full w-24" />
					<div className="h-6 bg-gray-200 rounded-full w-32" />
					<div className="h-6 bg-gray-200 rounded-full w-20" />
				</div>
			</div>
		</div>
	);
}