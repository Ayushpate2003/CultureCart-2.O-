import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                By accessing and using CultureCart, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above,
                please do not use this service.
              </p>

              <h3>Use License</h3>
              <p>
                Permission is granted to temporarily access the materials (information or software)
                on CultureCart's website for personal, non-commercial transitory viewing only.
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to decompile or reverse engineer any software contained on CultureCart</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h3>User Accounts</h3>
              <p>
                When you create an account with us, you must provide information that is accurate,
                complete, and current at all times. You are responsible for safeguarding the password
                and for all activities that occur under your account.
              </p>

              <h3>Artisan Responsibilities</h3>
              <p>
                Artisans are responsible for:
              </p>
              <ul>
                <li>Accurate product descriptions and pricing</li>
                <li>Timely delivery of orders</li>
                <li>Quality craftsmanship as advertised</li>
                <li>Professional communication with buyers</li>
                <li>Compliance with all applicable laws and regulations</li>
              </ul>

              <h3>Buyer Responsibilities</h3>
              <p>
                Buyers are responsible for:
              </p>
              <ul>
                <li>Providing accurate shipping information</li>
                <li>Timely payment for purchases</li>
                <li>Respectful communication with artisans</li>
                <li>Honest product reviews and feedback</li>
              </ul>

              <h3>Prohibited Uses</h3>
              <p>
                You may not use our service:
              </p>
              <ul>
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
              </ul>

              <h3>Content</h3>
              <p>
                Our Service allows you to post, link, store, share and otherwise make available certain
                information, text, graphics, or other material. You are responsible for content that you post.
              </p>

              <h3>Termination</h3>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability,
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>

              <h3>Disclaimer</h3>
              <p>
                The information on this website is provided on an 'as is' basis. To the fullest extent
                permitted by law, CultureCart excludes all representations, warranties, conditions and terms
                whether express or implied, statutory or otherwise.
              </p>

              <h3>Limitations</h3>
              <p>
                In no event shall CultureCart or its suppliers be liable for any damages (including, without
                limitation, damages for loss of data or profit, or due to business interruption) arising out
                of the use or inability to use the materials on CultureCart's website.
              </p>

              <h3>Revisions</h3>
              <p>
                The materials appearing on CultureCart's website could include technical, typographical,
                or photographic errors. CultureCart does not warrant that any of the materials on its
                website are accurate, complete, or current.
              </p>

              <h3>Contact Information</h3>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@culturecart.in
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
