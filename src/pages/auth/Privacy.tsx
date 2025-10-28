import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <Link
              to="/auth/choose-role"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign up
            </Link>
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy for CultureCart</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                At CultureCart, we are committed to protecting your privacy and ensuring the security
                of your personal information. This Privacy Policy explains how we collect, use, and
                safeguard your information when you use our platform.
              </p>

              <h3>Information We Collect</h3>

              <h4>Personal Information</h4>
              <p>We may collect the following personal information:</p>
              <ul>
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>Profile information (bio, location, craft specialties for artisans)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Communication preferences</li>
              </ul>

              <h4>Usage Information</h4>
              <p>We automatically collect certain information about your use of our service:</p>
              <ul>
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Location data (with your permission for regional customization)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h4>Artisan-Specific Information</h4>
              <p>For artisans, we additionally collect:</p>
              <ul>
                <li>Business information (shop name, craft categories)</li>
                <li>Product information and descriptions</li>
                <li>Sales and transaction data</li>
                <li>Customer reviews and ratings</li>
              </ul>

              <h3>How We Use Your Information</h3>
              <p>We use the collected information for the following purposes:</p>
              <ul>
                <li>To provide and maintain our service</li>
                <li>To process transactions and send related information</li>
                <li>To communicate with you about your account and our services</li>
                <li>To personalize your experience and provide relevant recommendations</li>
                <li>To improve our platform and develop new features</li>
                <li>To ensure platform security and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>

              <h3>Information Sharing and Disclosure</h3>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>

              <h4>Service Providers</h4>
              <p>
                We may share information with trusted third-party service providers who assist us in
                operating our platform, such as payment processors, shipping companies, and analytics providers.
              </p>

              <h4>Legal Requirements</h4>
              <p>
                We may disclose your information if required by law or if we believe such action is
                necessary to comply with legal processes, protect our rights, or ensure user safety.
              </p>

              <h4>Business Transfers</h4>
              <p>
                In the event of a merger, acquisition, or sale of assets, your information may be
                transferred to the new entity.
              </p>

              <h4>With Your Consent</h4>
              <p>
                We may share information with your explicit consent for specific purposes.
              </p>

              <h3>Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. These
                measures include:
              </p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication procedures</li>
                <li>Secure data storage and backup systems</li>
              </ul>

              <h3>Data Retention</h3>
              <p>
                We retain your personal information for as long as necessary to provide our services,
                comply with legal obligations, resolve disputes, and enforce our agreements. Specific
                retention periods vary depending on the type of information and the purpose for which it was collected.
              </p>

              <h3>Your Rights</h3>
              <p>You have the following rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Restriction:</strong> Request limitation of how we process your information</li>
                <li><strong>Objection:</strong> Object to our processing of your personal information</li>
              </ul>

              <h3>Cookies and Tracking Technologies</h3>
              <p>
                We use cookies and similar technologies to enhance your experience on our platform.
                You can control cookie settings through your browser preferences. However, disabling
                cookies may affect the functionality of our service.
              </p>

              <h3>Third-Party Services</h3>
              <p>
                Our platform may contain links to third-party websites or integrate with third-party
                services. We are not responsible for the privacy practices of these external sites or services.
              </p>

              <h3>Children's Privacy</h3>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13. If we become aware that we have
                collected personal information from a child under 13, we will take steps to delete such information.
              </p>

              <h3>International Data Transfers</h3>
              <p>
                Your information may be transferred to and processed in countries other than your own.
                We ensure that such transfers comply with applicable data protection laws and implement
                appropriate safeguards.
              </p>

              <h3>Changes to This Privacy Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
                We encourage you to review this Privacy Policy periodically.
              </p>

              <h3>Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
                <br />
                Email: privacy@culturecart.in
                <br />
                Address: CultureCart, India
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link to="/auth/choose-role">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign Up
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
