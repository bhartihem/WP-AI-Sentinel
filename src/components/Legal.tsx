import React from 'react';
import { Shield, Lock, FileText, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface LegalProps {
  onBack: () => void;
}

export const Legal: React.FC<LegalProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to App
      </button>

      <section id="privacy" className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-4">
          <p className="text-lg font-medium text-gray-800">Your privacy is our top priority. We handle your WordPress credentials with extreme care.</p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Data Collection</h2>
          <p>We collect your WordPress Site URL, Username, and Application Password to enable AI agents to interact with your site. This data is stored securely in your private Firebase account.</p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-8">2. Data Usage</h2>
          <p>Your credentials are only used to perform actions you explicitly approve. We do not share your credentials with any third parties except for the WordPress REST API on your own site.</p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-8">3. AI Processing</h2>
          <p>Content from your site (posts, pages, settings) is sent to Google Gemini for analysis. Google's privacy policy applies to this data processing. We do not use your data to train our own models.</p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Security</h2>
          <p>We use industry-standard encryption and security protocols to protect your data. All communication between this app and your WordPress site is proxied through our secure servers to prevent CORS issues and protect your IP.</p>
        </div>
      </section>

      <section id="terms" className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <FileText className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        </div>
        <div className="prose prose-purple max-w-none text-gray-600 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Acceptance of Terms</h2>
          <p>By using WP Sentinel AI, you agree to these terms. If you do not agree, please do not use the service.</p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-8">2. User Responsibility</h2>
          <p>You are responsible for maintaining the security of your WordPress site. We recommend using "Application Passwords" instead of your main password. You should always have a recent backup of your site before allowing AI agents to make changes.</p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Limitation of Liability</h2>
          <p>WP Sentinel AI is provided "as is". While we strive for 100% accuracy and safety, we are not liable for any damages, data loss, or site downtime caused by AI-generated actions or code snippets.</p>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Prohibited Use</h2>
          <p>You may not use this tool for any illegal activities, including but not limited to hacking, spamming, or distributing malicious content via WordPress.</p>
        </div>
      </section>

      <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
        <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-sm text-gray-500">
          Last updated: March 28, 2026. For any questions, contact us at hembharti7@gmail.com
        </p>
      </div>
    </div>
  );
};

export default Legal;
