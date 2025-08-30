import { Suspense, lazy, useState } from "react";

// Lazy load page components
const RealEstateAuction = lazy(() =>
	import("./pages/RealEstateAuction").then((module) => ({ default: module.RealEstateAuction })),
);
const About = lazy(() =>
	import("./pages/About").then((module) => ({ default: module.About })),
);
const EERCDashboard = lazy(() =>
	import("./pages/EERCDashboard").then((module) => ({ default: module.EERCDashboard })),
);
const AdminPage = lazy(() =>
	import("./pages/AdminPage").then((module) => ({ default: module.AdminPage })),
);
const ResidentPage = lazy(() =>
	import("./pages/ResidentPage").then((module) => ({ default: module.ResidentPage })),
);
const BidderPage = lazy(() =>
	import("./pages/BidderPage").then((module) => ({ default: module.BidderPage })),
);

// Loading component
const LoadingFallback = () => (
	<div className="flex items-center justify-center h-full">
		<div className="text-erea-text font-display text-lg">Loading...</div>
	</div>
);

export function App() {
	const [selectedPage, setSelectedPage] = useState<"auction" | "about" | "eerc" | "admin" | "resident" | "bidder">("auction");

	return (
		<div className="min-h-screen bg-avax-light">
			{/* Header */}
			<header className="avax-header shadow-lg">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Top bar with notice */}
					<div className="border-b border-white/20 py-2">
						<div className="flex items-center justify-between text-sm">
							<div className="text-white/80">
								This is Demo Site
							</div>
							<div className="text-white/80">
								Secure • Verified • Transparent
							</div>
						</div>
					</div>
					
					{/* Main header */}
					<div className="flex justify-between items-center h-20">
						<div className="flex items-center space-x-4">
							<div className="avax-seal">
								EREA
							</div>
							<div>
								<h1 className="text-3xl font-bold text-white">
									EREA
								</h1>
								<span className="text-sm text-white/80 block">
									Encrypted Real Estate Auction
								</span>
							</div>
						</div>
						<nav className="flex space-x-1 flex-wrap">
							<button
								onClick={() => setSelectedPage("auction")}
								className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 text-xs uppercase tracking-wide ${
									selectedPage === "auction"
										? "bg-white text-erea-primary shadow-md"
										: "text-white hover:bg-white/10 border border-white/30"
								}`}
							>
								Auction
							</button>
							<button
								onClick={() => setSelectedPage("admin")}
								className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 text-xs uppercase tracking-wide ${
									selectedPage === "admin"
										? "bg-white text-erea-primary shadow-md"
										: "text-white hover:bg-white/10 border border-white/30"
								}`}
							>
								Admin
							</button>
							<button
								onClick={() => setSelectedPage("resident")}
								className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 text-xs uppercase tracking-wide ${
									selectedPage === "resident"
										? "bg-white text-erea-primary shadow-md"
										: "text-white hover:bg-white/10 border border-white/30"
								}`}
							>
								Resident
							</button>
							<button
								onClick={() => setSelectedPage("bidder")}
								className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 text-xs uppercase tracking-wide ${
									selectedPage === "bidder"
										? "bg-white text-erea-primary shadow-md"
										: "text-white hover:bg-white/10 border border-white/30"
								}`}
							>
								Bidder
							</button>
							<button
								onClick={() => setSelectedPage("about")}
								className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 text-xs uppercase tracking-wide ${
									selectedPage === "about"
										? "bg-white text-erea-primary shadow-md"
										: "text-white hover:bg-white/10 border border-white/30"
								}`}
							>
								About
							</button>
							<button
								onClick={() => setSelectedPage("eerc")}
								className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 text-xs uppercase tracking-wide ${
									selectedPage === "eerc"
										? "bg-white text-erea-primary shadow-md"
										: "text-white hover:bg-white/10 border border-white/30"
								}`}
							>
								EERC Dashboard
							</button>
						</nav>
					</div>
				</div>
			</header>

			{/* Breadcrumb */}
			<div className="bg-white border-b border-avax-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
					<nav className="text-sm">
						<span className="text-erea-text-light">Home</span>
						<span className="mx-2 text-erea-text-light">/</span>
						<span className="text-erea-text font-semibold capitalize">
							{selectedPage === "auction" ? "Real Estate Auction" : 
							 selectedPage === "admin" ? "Admin Dashboard" :
							 selectedPage === "resident" ? "Resident Portal" :
							 selectedPage === "bidder" ? "Bidder Portal" :
							 selectedPage === "about" ? "About" : "EERC Dashboard"}
						</span>
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="avax-card p-8">
					<Suspense fallback={<LoadingFallback />}>
						{selectedPage === "auction" ? (
							<RealEstateAuction />
						) : selectedPage === "admin" ? (
							<AdminPage />
						) : selectedPage === "resident" ? (
							<ResidentPage />
						) : selectedPage === "bidder" ? (
							<BidderPage />
						) : selectedPage === "eerc" ? (
							<EERCDashboard />
						) : (
							<About />
						)}
					</Suspense>
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-avax-dark text-white mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<h3 className="text-lg font-semibold mb-4">EREA Platform</h3>
							<p className="text-white/80 text-sm leading-relaxed">
								Blockchain-based real estate auction platform providing 
								secure, transparent, and efficient property transactions.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Links</h3>
							<ul className="space-y-2 text-sm">
								<li><a href="#" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a></li>
								<li><a href="#" className="text-white/80 hover:text-white transition-colors">Terms of Service</a></li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Contact Information</h3>
							<div className="text-sm text-white/80 space-y-2">
								<p>Seoul Korea</p>
								<p>info@erea.com</p>
								<p>Monday - Friday: 10:00 AM - 5:00 PM KST</p>
							</div>
						</div>
					</div>
					
					<div className="border-t border-white/20 mt-8 pt-8 text-center">
						<div className="text-white/80 text-sm">
							<p>
								© 2025 EREA. All rights reserved.
							</p>
							<p className="mt-1">
								Powered by Avalanche EERC Technology | Secure • Transparent • Efficient
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default App;
