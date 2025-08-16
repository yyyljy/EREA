export function About() {
  return (
    <main className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="avax-heading text-4xl mb-4">
          About EREA Platform
        </h1>
        <p className="avax-body text-lg max-w-3xl mx-auto">
          A next-generation real estate auction platform utilizing blockchain technology, 
          providing innovative services based on transparency and reliability.
        </p>
      </div>

      {/* Service Overview */}
      <div className="avax-card p-8">
        <h2 className="avax-subheading text-2xl mb-6">
          What is EREA?
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="avax-body leading-relaxed mb-4">
              EREA (Encrypted Real Estate Auction) is a platform that revolutionarily improves 
              the transparency and security of real estate auctions by combining blockchain 
              technology with encryption technology.
            </p>
            <p className="avax-body leading-relaxed mb-4">
              We solve the opacity and information asymmetry problems of existing real estate 
              auction systems, providing an environment where all participants can participate 
              in fair and transparent auctions.
            </p>
            <p className="avax-body leading-relaxed">
              Through the Avalanche blockchain's EERC (Encrypted ERC) technology, we ensure 
              both privacy protection and transaction transparency.
            </p>
          </div>
          <div className="avax-card p-6 bg-avax-light">
            <h3 className="avax-subheading text-xl mb-4">Key Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="avax-body">Total Transactions:</span>
                <span className="font-bold text-erea-primary">$2.1M</span>
              </div>
              <div className="flex justify-between">
                <span className="avax-body">Active Properties:</span>
                <span className="font-bold text-avax-success">156</span>
              </div>
              <div className="flex justify-between">
                <span className="avax-body">Success Rate:</span>
                <span className="font-bold text-avax-accent">98%</span>
              </div>
              <div className="flex justify-between">
                <span className="avax-body">Average Processing Time:</span>
                <span className="font-bold text-avax-secondary">&lt; 3 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="avax-card p-8">
        <h2 className="avax-subheading text-2xl mb-6">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-avax-border rounded-lg">
            <div className="w-16 h-16 bg-erea-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🔒
            </div>
            <h3 className="avax-subheading text-lg mb-3">Enhanced Security</h3>
            <p className="avax-body text-sm">
              All auction data is encrypted and stored on the Avalanche blockchain, 
              ensuring maximum security and preventing unauthorized access.
            </p>
          </div>
          
          <div className="text-center p-6 border border-avax-border rounded-lg">
            <div className="w-16 h-16 bg-avax-success text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🌐
            </div>
            <h3 className="avax-subheading text-lg mb-3">Transparency</h3>
            <p className="avax-body text-sm">
              Blockchain technology ensures complete transparency of the auction process 
              while protecting individual privacy through encryption.
            </p>
          </div>
          
          <div className="text-center p-6 border border-avax-border rounded-lg">
            <div className="w-16 h-16 bg-avax-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚡
            </div>
            <h3 className="avax-subheading text-lg mb-3">High Performance</h3>
            <p className="avax-body text-sm">
              Avalanche's high-speed processing capabilities enable real-time bidding 
              and instant transaction confirmations.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="avax-card p-8">
        <h2 className="avax-subheading text-2xl mb-6">
          Technology Infrastructure
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="avax-subheading text-xl mb-4">Blockchain Technology</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-erea-primary pl-4">
                <h4 className="font-semibold text-erea-text mb-1">Avalanche EERC</h4>
                <p className="avax-body text-sm">
                  Encrypted ERC standard providing privacy-preserving smart contracts 
                  for secure real estate transactions.
                </p>
              </div>
              <div className="border-l-4 border-avax-secondary pl-4">
                <h4 className="font-semibold text-erea-text mb-1">Zero-Knowledge Proofs</h4>
                <p className="avax-body text-sm">
                  Advanced cryptographic techniques ensuring bid privacy while 
                  maintaining auction integrity and verifiability.
                </p>
              </div>
              <div className="border-l-4 border-avax-success pl-4">
                <h4 className="font-semibold text-erea-text mb-1">Smart Contract Automation</h4>
                <p className="avax-body text-sm">
                  Automated execution of auction rules, bid validation, and 
                  property transfer processes without manual intervention.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="avax-subheading text-xl mb-4">Security Features</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-avax-accent pl-4">
                <h4 className="font-semibold text-erea-text mb-1">End-to-End Encryption</h4>
                <p className="avax-body text-sm">
                  All sensitive data is encrypted from client to blockchain, 
                  ensuring complete privacy of user information and bid details.
                </p>
              </div>
              <div className="border-l-4 border-avax-warning pl-4">
                <h4 className="font-semibold text-erea-text mb-1">Multi-Signature Verification</h4>
                <p className="avax-body text-sm">
                  Multiple authorization levels required for critical operations, 
                  preventing unauthorized transactions and ensuring security.
                </p>
              </div>
              <div className="border-l-4 border-avax-error pl-4">
                <h4 className="font-semibold text-erea-text mb-1">Audit Trail</h4>
                <p className="avax-body text-sm">
                  Complete immutable record of all actions and transactions 
                  for regulatory compliance and dispute resolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Flow */}
      <div className="avax-card p-8">
        <h2 className="avax-subheading text-2xl mb-6">
          Auction Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-erea-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
              1
            </div>
            <h3 className="avax-subheading text-lg mb-2">Registration</h3>
            <p className="avax-body text-sm">
              Verify identity and connect your Avalanche wallet to participate in auctions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-avax-secondary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
              2
            </div>
            <h3 className="avax-subheading text-lg mb-2">Browse Properties</h3>
            <p className="avax-body text-sm">
              Explore available properties with detailed information and verified documentation.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-avax-success text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
              3
            </div>
            <h3 className="avax-subheading text-lg mb-2">Place Encrypted Bids</h3>
            <p className="avax-body text-sm">
              Submit secure, private bids that are encrypted and recorded on the blockchain.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-avax-accent text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
              4
            </div>
            <h3 className="avax-subheading text-lg mb-2">Secure Transfer</h3>
            <p className="avax-body text-sm">
              Automated smart contract execution for seamless and secure property transfer.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="avax-card p-8">
        <h2 className="avax-subheading text-2xl mb-6">
          Platform Benefits
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="avax-subheading text-xl mb-4">For Buyers</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-avax-success mr-2">✓</span>
                <span className="avax-body">Access to verified, high-quality property listings</span>
              </li>
              <li className="flex items-start">
                <span className="text-avax-success mr-2">✓</span>
                <span className="avax-body">Complete privacy of bid amounts and strategies</span>
              </li>
              <li className="flex items-start">
                <span className="text-avax-success mr-2">✓</span>
                <span className="avax-body">Transparent auction process with real-time updates</span>
              </li>
              <li className="flex items-start">
                <span className="text-avax-success mr-2">✓</span>
                <span className="avax-body">Lower transaction costs through blockchain automation</span>
              </li>
              <li className="flex items-start">
                <span className="text-avax-success mr-2">✓</span>
                <span className="avax-body">Instant transaction confirmation and settlement</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="avax-subheading text-xl mb-4">For Sellers</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-avax-success mr-2">✓</span>
                <span className="avax-body">Reach a global network of qualified buyers</span>
              </li>
              <li className="flex items-start">
                <span className="text-avax-success mr-2">✓</span>
                <span className="avax-body">Automated auction management and bid processing</span>
              </li>
              <li className="flex items-start">
                <span className="text-avax-success mr-2">✓</span>
                <span className="avax-body">Guaranteed payment security through smart contracts</span>
              </li>
              <li className="flex items-start">
                <span className="text-avax-success mr-2">✓</span>
                <span className="avax-body">Reduced administrative overhead and costs</span>
              </li>
              <li className="flex items-start">
                <span className="text-avax-success mr-2">✓</span>
                <span className="avax-body">Complete transaction transparency and audit trail</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="avax-card p-8 bg-avax-light">
        <h2 className="avax-subheading text-2xl mb-6">
          Contact & Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="avax-subheading text-lg mb-3">General Inquiries</h3>
            <div className="space-y-2 avax-body">
              <p>📧 info@erea.org</p>
              <p>📞 1-800-EREA-ORG</p>
              <p>🕒 Mon-Fri: 8:00 AM - 6:00 PM EST</p>
            </div>
          </div>
          
          <div>
            <h3 className="avax-subheading text-lg mb-3">Technical Support</h3>
            <div className="space-y-2 avax-body">
              <p>📧 support@erea.org</p>
              <p>📞 1-800-TECH-EREA</p>
              <p>🕒 24/7 Emergency Support</p>
            </div>
          </div>
          
          <div>
            <h3 className="avax-subheading text-lg mb-3">Regulatory Affairs</h3>
            <div className="space-y-2 avax-body">
              <p>📧 compliance@erea.org</p>
              <p>📞 1-800-COMPLIANCE</p>
              <p>🕒 Mon-Fri: 9:00 AM - 5:00 PM EST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="avax-card p-6 bg-yellow-50 border-l-4 border-avax-warning">
        <h3 className="avax-subheading text-lg mb-2 flex items-center">
          <span className="mr-2">⚠️</span>
          Important Notice
        </h3>
        <p className="avax-body text-sm">
          EREA is a platform for real estate auctions. 
          All transactions are subject to federal regulations and oversight. Participation 
          requires proper identification and compliance with applicable laws. Blockchain 
          technology ensures transaction security.
        </p>
      </div>
    </main>
  );
}
