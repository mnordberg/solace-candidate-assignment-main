export default function Header() {
	return (
		<div className="flex items-center justify-center gap-2 my-2 md:my-12">
			{/* Logo hack! These should of course use the proper logo svg, font and brand guidelines. For this demo I just pulled screenshots from the website. */}
			<img
				src="/solace-logo.png"
				alt="Solace"
				className="h-6"
			/>
			<img
				src="/advocates.png"
				alt="Advocate Search"
				className="h-6"
			/>
		</div>
	);
}
