export function Footer() {
  return (
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
  );
}
