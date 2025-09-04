import React, { useState } from 'react';
import { Shield, Menu, X, Zap, Lock, Fingerprint, QrCode, Eye, Clock, Database, CheckCircle, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Fingerprint,
      title: "Biometric Authentication",
      description: "Advanced fingerprint and facial recognition with 99.9% accuracy",
      hasImage: true
    },
    {
      icon: QrCode,
      title: "Dynamic QR Codes",
      description: "Time-sensitive QR codes that regenerate for maximum security",
      hasImage: true
    },
    {
      icon: Shield,
      title: "Multi-Layer Protection",
      description: "Dual authentication ensures unbreachable access control",
      hasImage: false
    },
    {
      icon: Eye,
      title: "Real-Time Monitoring",
      description: "Live security dashboard with instant threat detection",
      hasImage: false
    },
    {
      icon: Clock,
      title: "Instant Verification",
      description: "Sub-second authentication for seamless user experience",
      hasImage: false
    },
    {
      icon: Database,
      title: "Secure Data Storage",
      description: "Encrypted biometric data with zero-knowledge architecture",
      hasImage: false
    }
  ];

  const stats = [
    {
      icon: Shield,
      value: "99.9%",
      label: "Security Accuracy",
      description: "Industry-leading precision in threat detection"
    },
    {
      icon: Shield,
      value: "10M+",
      label: "Trusted Users",
      description: "Global enterprises rely on our security"
    },
    {
      icon: Zap,
      value: "0.3s",
      label: "Average Auth Time",
      description: "Lightning-fast authentication process"
    },
    {
      icon: Lock,
      value: "Zero",
      label: "Breaches Recorded",
      description: "Perfect security track record maintained"
    }
  ];

  const benefits = [
    "30-day free trial with full access",
    "24/7 enterprise support included",
    "No setup fees or hidden costs",
    "Instant deployment capability"
  ];

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Security", href: "#security" },
        { name: "Pricing", href: "#pricing" },
        { name: "Documentation", href: "#docs" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Press", href: "#press" },
        { name: "Partners", href: "#partners" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Community", href: "#community" },
        { name: "Contact", href: "#contact" },
        { name: "Status Page", href: "#status" }
      ]
    }
  ];

  return (
    <div className="app">
      {/* Navigation */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <Shield className="logo-icon" />
            <span className="logo-text">BioQR</span>
          </div>
          
          <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="./about.html">About</a></li>
              <li><a href="./contact.html">Contact</a></li>
              <li><a className="btn btn-ghost" href="./login.html">Sign In</a></li>
              <li><a className="btn btn-primary" href="./register.html">Get Started</a></li>
            </ul>
          </nav>

          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Shield className="badge-icon" />
              <span>Next-Gen Security</span>
            </div>
            
            <h1>
              Biometric + QR
              <span className="gradient-text">Security System</span>
            </h1>
            
            <p>
              Revolutionary dual-layer authentication combining cutting-edge biometric 
              technology with dynamic QR code verification for unbreakable security.
            </p>

            <div className="cta-buttons">
              <a href="./register.html" className="btn btn-primary btn-large">
                <Zap className="btn-icon" />
                Start Free Trial
              </a>
              <a href="./viewdemo.html" className="btn btn-outline btn-large">
                <Lock className="btn-icon" />
                View Demo
              </a>
            </div>

            <div className="stats-grid">
              <div className="stat">
                <div className="stat-value primary">99.9%</div>
                <div className="stat-label">Accuracy Rate</div>
              </div>
              <div className="stat">
                <div className="stat-value accent">&lt; 0.5s</div>
                <div className="stat-label">Auth Time</div>
              </div>
              <div className="stat">
                <div className="stat-value warning">Zero</div>
                <div className="stat-label">False Positives</div>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-image-placeholder">
              <div className="fingerprint-display">
                <div className="fingerprint-scanner">
                  <Fingerprint className="fingerprint-icon" />
                </div>
                <div className="security-rings"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Shield className="badge-icon" />
              <span>Advanced Features</span>
            </div>
            <h2 className="section-title">
              Next-Generation
              <span className="gradient-text">Security Features</span>
            </h2>
            <p className="section-description">
              Combining cutting-edge biometric technology with innovative QR code systems 
              to deliver unparalleled security solutions.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card large">
              <div className="feature-image biometric-image">
                <div className="biometric-scanner">
                  <div className="scanner-frame">
                    <Fingerprint className="scanner-icon" />
                  </div>
                  <div className="scan-lines"></div>
                </div>
              </div>
              <div className="feature-content">
                <div className="feature-header">
                  <div className="feature-icon">
                    <Fingerprint />
                  </div>
                  <h3>Biometric Authentication</h3>
                </div>
                <p>Advanced fingerprint and facial recognition with 99.9% accuracy</p>
              </div>
            </div>

            <div className="feature-card large">
              <div className="feature-image qr-image">
                <div className="qr-display">
                  <div className="qr-code">
                    <QrCode className="qr-icon" />
                  </div>
                  <div className="qr-glow"></div>
                  <Lock className="lock-icon" />
                </div>
              </div>
              <div className="feature-content">
                <div className="feature-header">
                  <div className="feature-icon">
                    <QrCode />
                  </div>
                  <h3>Dynamic QR Codes</h3>
                </div>
                <p>Time-sensitive QR codes that regenerate for maximum security</p>
              </div>
            </div>

            {features.slice(2).map((feature, index) => (
              <div key={index + 2} className="feature-card">
                <div className="feature-content">
                  <div className="feature-header">
                    <div className="feature-icon">
                      <feature.icon />
                    </div>
                    <h3>{feature.title}</h3>
                  </div>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Stats Section */}
      <section id="security" className="security-stats">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Proven Security
              <span className="gradient-text">Performance</span>
            </h2>
            <p className="section-description">
              Our advanced security metrics demonstrate the reliability and effectiveness 
              of the BioQR system in real-world applications.
            </p>
          </div>

          <div className="stats-cards">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <stat.icon />
                </div>
                <div className="stat-value gradient-text">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="section-badge">
              <Shield className="badge-icon" />
              <span>Ready to Secure Your Future?</span>
            </div>
            
            <h2>
              Transform Your Security
              <span className="gradient-text">Infrastructure Today</span>
            </h2>
            
            <p>
              Join thousands of organizations that trust BioQR for their most critical 
              security needs. Experience the future of authentication.
            </p>

            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <CheckCircle className="benefit-icon" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="cta-buttons">
              <a href="#trial" className="btn btn-primary btn-large">
                Start Free Trial
                <ArrowRight className="btn-icon" />
              </a>
              <a href="#demo" className="btn btn-outline btn-large">
                Schedule Demo
              </a>
            </div>

            <div className="cta-note">
              No credit card required • Enterprise-grade security from day one
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <Shield className="logo-icon" />
                <span className="logo-text">BioQR</span>
              </div>
              <p>
                Revolutionary biometric and QR code security system trusted by 
                enterprises worldwide for mission-critical authentication.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>contact@bioqr.com</span>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <span>Mumbai, IN</span>
                </div>
              </div>
            </div>

            <div className="footer-links">
              {footerSections.map((section, index) => (
                <div key={index} className="footer-column">
                  <h4>{section.title}</h4>
                  <ul>
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href={link.href}>{link.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              © {new Date().getFullYear()} BioQR Security Systems. All rights reserved.
            </div>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;