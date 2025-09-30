interface SearchProps {
	value: string;
	onChange: (value: string) => void;
	onReset: () => void;
	isSearching: boolean;
}

export default function Search({ value, onChange, onReset, isSearching }: SearchProps) {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			onReset();
		}
	};

	return (
		<div className="mt-12 mb-6 relative">
			<input
				id="search"
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Search by name, phone number, city, degree, or specialty..."
				aria-label="Search advocates by name, phone number, city, degree, or specialty"
				className="border border-gray-300 rounded-full px-5 py-3 w-full pr-10"
			/>
			{isSearching ? (
				<div className="absolute right-5 top-1/2 -translate-y-1/2">
					<div
						className=" w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin-fast"
						aria-label="Searching"
					/>
				</div>
			) : (
				value && (
					<button
						onClick={onReset}
						aria-label="Clear search"
						className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all font-bold text-gray-500 hover:text-gray-800"
					>
						✕
					</button>
				)
			)}
		</div>
	);
}