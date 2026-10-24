import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { APP_NAME, APP_COLOR_GRADIENT, addReferrer, DRIVE_IO_BASE_URL, DRIVE_IO_COPY_FOLDER_URL } from './constants';
import './onboarding.css';

function Onboarding() {
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('onboarding-footer');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const threshold = window.innerHeight * 0.92;
        setShowArrow(footerTop > threshold);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFooter = () => {
    const footer = document.getElementById('onboarding-footer');
    if (footer) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      footer.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  const openGoogleSearch = () => {
    chrome.tabs.create({ url: 'https://www.google.com/search?q=ai+overview' });
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("We're currently in the process of building the 'About' section. Stay tuned!");
  };

  const handleTwitterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("We're currently in the process of creating our Twitter page. Stay tuned!");
  };

  const openLink = (url: string) => {
    chrome.tabs.create({ url });
  };

  return (
    <div className="onboarding-page">
      {/* Header */}
      <header className="onboarding-header">
        <img
          src={chrome.runtime.getURL('icons/icon-128.png')}
          alt={APP_NAME}
          className="header-logo"
        />
        <p className="header-subtitle">INSTALL SUCCESSFUL</p>
        <h1 className="header-title">
          Welcome to <span className={`gradient-text ${APP_COLOR_GRADIENT} bg-clip-text text-transparent`}>{APP_NAME}</span>
        </h1>
        <p className="header-description">
          Restore the "Send to Docs" button on Google Search AI Mode answers. Google removed this feature in October 2026, but {APP_NAME} brings it back with even better formatting.
        </p>
      </header>

      {/* How to Use Section */}
      <section className="how-to-section">
        <h2 className="section-heading">
          How to use <span className={`gradient-text ${APP_COLOR_GRADIENT} bg-clip-text text-transparent`}>{APP_NAME}</span>
        </h2>

        {/* Step 1 - Pinning */}
        <div className="step-card step-odd">
          <div className="step-number-circle">1</div>
          <div className="step-content">
            <div className="step-label">Step 1</div>
            <h3 className="step-title">Pinning {APP_NAME}</h3>
            <p className="step-description">
              Pin the extension to your browser toolbar for quick access to settings and help.
            </p>
            <ul className="step-tips">
              <li><span className="tip-dot"></span>Click the puzzle icon in your Chrome toolbar</li>
              <li><span className="tip-dot"></span>Find "{APP_NAME}" in the list</li>
              <li><span className="tip-dot"></span>Click the pin icon to keep it visible</li>
            </ul>
          </div>
          <div className="step-media">
            <div className="video-placeholder" role="img" aria-label="Pinning AskToDoc Video coming soon">
              <span>Demo video coming soon</span>
            </div>
          </div>
        </div>

        {/* Step 2 - Using the Button */}
        <div className="step-card step-even">
          <div className="step-number-circle">2</div>
          <div className="step-content">
            <div className="step-label">Step 2</div>
            <h3 className="step-title">Click "Send to Docs" on AI Answers</h3>
            <p className="step-description">
              When you search on Google and get an AI Mode answer, you'll see a "Send to Docs" button at the top.
            </p>
            <ul className="step-tips">
              <li><span className="tip-dot"></span>Navigate to Google Search and enable AI Mode</li>
              <li><span className="tip-dot"></span>Ask a question to get an AI answer</li>
              <li><span className="tip-dot"></span>Click the "📄 Send to Docs" button</li>
              <li><span className="tip-dot"></span>The formatted content is copied to your clipboard</li>
            </ul>
          </div>
          <div className="step-media">
            <div className="video-placeholder" role="img" aria-label="Using Send to Docs button Video coming soon">
              <span>Demo video coming soon</span>
            </div>
          </div>
        </div>

        {/* Step 3 - Paste into Docs */}
        <div className="step-card step-odd">
          <div className="step-number-circle">3</div>
          <div className="step-content">
            <div className="step-label">Step 3</div>
            <h3 className="step-title">Paste into Your New Doc</h3>
            <p className="step-description">
              A new Google Doc will open automatically. Just paste (Ctrl+V or Cmd+V) to insert your formatted answer with sources.
            </p>
            <ul className="step-tips">
              <li><span className="tip-dot"></span>docs.new opens in a new tab automatically</li>
              <li><span className="tip-dot"></span>Press Ctrl+V (or Cmd+V on Mac) to paste</li>
              <li><span className="tip-dot"></span>Your content retains headings, lists, tables, and links</li>
              <li><span className="tip-dot"></span>Source links are included at the end</li>
            </ul>
          </div>
          <div className="step-media">
            <div className="video-placeholder" role="img" aria-label="Pasting into Google Docs Video coming soon">
              <span>Demo video coming soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Button */}
      <div className="cta-container">
        <button onClick={openGoogleSearch} className={`cta-primary ${APP_COLOR_GRADIENT}`}>
          Try it now on Google Search
        </button>
      </div>

      {/* Drive I/O Promo */}
      <section className="driveio-promo">
        <h3 className="promo-title">Want to copy your folders?</h3>
        <div className="promo-content">
          <div className="promo-video">
            <div className="video-placeholder" role="img" aria-label="Drive I/O demo Video coming soon">
              <span>Demo video coming soon</span>
            </div>
            <p className="promo-caption">Bulk-copy entire folders with Drive I/O</p>
          </div>
          <div className="promo-text">
            <h4 className="promo-heading">Install Drive I/O, copy your folders, and save time today!</h4>
            <p className="promo-description">
              {APP_NAME} is built for capturing AI answers to Docs. To <strong>bulk-copy an entire folder</strong> (and everything inside), use Drive I/O—from the same team.
            </p>
            <div className="promo-notice">
              <strong>Regional availability:</strong> Drive I/O is only available in the United States and Canada. Germany, France, and Pakistan have limited availability.
            </div>
            <div className="promo-interest-card">
              <p className="interest-text">
                Not in a supported country, or don't see Drive I/O in the Chrome Web Store? Click below to express your interest on our landing page.
              </p>
              <button
                onClick={() => openLink(addReferrer(`${DRIVE_IO_BASE_URL}?launch-interest=true`))}
                className="interest-button"
              >
                Express your interest ↗
              </button>
            </div>
            <div className="promo-buttons">
              <button
                onClick={() => openLink(addReferrer(DRIVE_IO_BASE_URL))}
                className={`promo-cta ${APP_COLOR_GRADIENT}`}
              >
                Get Drive I/O
              </button>
              <button
                onClick={() => openLink(addReferrer(DRIVE_IO_COPY_FOLDER_URL))}
                className="promo-outline"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="onboarding-footer" className="onboarding-footer">
        <div className="footer-content">
          <div className="footer-columns">
            <div className="footer-column">
              <h4 className="footer-heading">Product</h4>
              <a href="#features" className="footer-link">Features</a>
              <a href="#pricing" className="footer-link">Pricing</a>
              <a href="#features" className="footer-link">FAQ</a>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">{APP_NAME}</h4>
              <a href="#" onClick={handleAboutClick} className="footer-link">About</a>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openLink(addReferrer(`${DRIVE_IO_BASE_URL}/contact?type=support`));
                }}
                className="footer-link"
              >
                Support
              </a>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Legal</h4>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openLink(addReferrer(`${DRIVE_IO_BASE_URL}/privacy`));
                }}
                className="footer-link"
              >
                Privacy
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openLink(addReferrer(`${DRIVE_IO_BASE_URL}/terms`));
                }}
                className="footer-link"
              >
                Terms
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-trademark">{APP_NAME} — trademarked by Drive I/O.</p>
            <div className="footer-social">
              <a href="#" onClick={handleTwitterClick} className="social-link">Twitter</a>
              <a
                href="https://www.linkedin.com/company/drive-i-o"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Arrow */}
      <div className={`floating-arrow ${showArrow ? 'visible' : 'hidden'}`} onClick={scrollToFooter}>
        <div className="arrow-content">
          <div className="arrow-title">How to use {APP_NAME}</div>
          <div className="arrow-subtitle">Scroll down to learn more about {APP_NAME} and Drive I/O.</div>
          <div className="arrow-icon">↓</div>
        </div>
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Onboarding />);
}
