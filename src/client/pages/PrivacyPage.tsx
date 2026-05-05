import React from 'react';
import { Footer } from '../components/Footer';

export function PrivacyPage() {
  return (
    <div className="privacy-page">
      <h1 className="page-title">Privacy Policy</h1>
      <p className="page-date">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="privacy-content">
        <section>
          <h2>What We Collect</h2>
          <p>The Faith Wound does not collect personal information beyond what is necessary to operate the site. Specifically:</p>
          <ul>
            <li>We do not require account creation or email registration to access content.</li>
            <li>We use standard server logs that record IP addresses, browser type, and pages visited. These are retained for 30 days and used only for security and performance monitoring.</li>
            <li>Assessment responses are stored anonymously (no identifying information is collected).</li>
          </ul>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>We use minimal cookies for site functionality (e.g., remembering your view preference for articles). We do not use advertising cookies or tracking pixels.</p>
        </section>

        <section>
          <h2>Amazon Affiliate Links</h2>
          <p>
            This site participates in the Amazon Associates program. When you click an Amazon affiliate link, Amazon may set cookies on your browser to track purchases. Amazon's privacy policy governs their data collection. We earn a small commission on qualifying purchases at no extra cost to you.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Google Fonts:</strong> For typography. Google may collect usage data per their privacy policy.</li>
            <li><strong>Bunny CDN:</strong> For image delivery. Bunny CDN processes IP addresses to serve content efficiently.</li>
          </ul>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>
            You have the right to request deletion of any data we hold about you. Since we collect minimal data and nothing personally identifiable, there is typically nothing to delete. If you have questions, contact us through theoraclelover.com.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy occasionally. The date at the top of this page reflects the most recent update.
          </p>
        </section>
      </div>

      <Footer />

      <style>{`
        .page-title {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-heading);
          margin-bottom: var(--space-2);
        }

        .page-date {
          font-size: var(--font-size-sm);
          color: var(--color-muted);
          margin-bottom: var(--space-8);
        }

        .privacy-content {
          max-width: var(--content-max-width);
        }

        .privacy-content section {
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-8);
          border-bottom: 1px solid var(--color-border);
        }

        .privacy-content section:last-child {
          border-bottom: none;
        }

        .privacy-content h2 {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          margin-bottom: var(--space-4);
        }

        .privacy-content p {
          font-size: var(--font-size-base);
          color: var(--color-text);
          line-height: var(--line-height-relaxed);
          margin-bottom: var(--space-3);
        }

        .privacy-content ul {
          margin: var(--space-3) 0 var(--space-3) var(--space-6);
        }

        .privacy-content li {
          font-size: var(--font-size-base);
          color: var(--color-text);
          line-height: var(--line-height-relaxed);
          margin-bottom: var(--space-2);
        }
      `}</style>
    </div>
  );
}
