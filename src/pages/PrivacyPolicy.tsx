import { PublicNav } from "../components/layout/PublicNav";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 md:p-16 rounded-[2rem] shadow-sm border border-gray-100"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-500 font-medium mb-10"><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg prose-blue max-w-none text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p>Welcome to <strong>FundFlow</strong> (“we,” “our,” or “us”). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our budgeting application (the “App”).</p>
            <p>By using the App, you agree to the terms of this Privacy Policy.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">a. Personal Information</h3>
            <p>We may collect:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Account login details</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">b. Financial Information</h3>
            <p>To provide budgeting features, we may collect:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Income details</li>
              <li>Expenses and transaction data</li>
              <li>Budget categories</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">c. Device & Usage Data</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address</li>
              <li>Device type and operating system</li>
              <li>App usage patterns</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and improve app functionality</li>
              <li>Personalize your budgeting experience</li>
              <li>Track spending and generate insights</li>
              <li>Communicate updates or support messages</li>
              <li>Ensure security and prevent fraud</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Sharing & Disclosure</h2>
            <p>We do <strong>not sell your personal data</strong>.</p>
            <p>We may share information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Service Providers</strong> (e.g., cloud hosting, analytics)</li>
              <li><strong>Legal Authorities</strong> if required by law</li>
              <li><strong>Business Transfers</strong> in case of merger or acquisition</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p>We implement industry-standard security measures, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption (SSL/TLS)</li>
              <li>Secure servers</li>
              <li>Access controls</li>
            </ul>
            <p>However, no method of transmission is 100% secure.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Data Retention</h2>
            <p>We retain your data only as long as necessary to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
            <p>You may:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>To exercise these rights, contact us at: <strong>support@fundflow.app</strong></p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Third-Party Services</h2>
            <p>Our app may use third-party services (e.g., analytics tools). These services have their own privacy policies, and we are not responsible for their practices.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Children's Privacy</h2>
            <p>Our App is not intended for users under 13 years old. We do not knowingly collect data from children.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Updates will be posted within the App with a revised “Effective Date.”</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, contact:</p>
            <p><strong>Email:</strong> support@fundflow.app<br/>
            <strong>Company Name:</strong> FundFlow</p>
          </div>
        </motion.div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-400 font-medium border-t border-gray-200 bg-white flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
        <div>Built with 💚 — FundFlow © {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}
