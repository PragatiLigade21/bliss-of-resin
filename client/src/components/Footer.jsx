/**
 * Footer - Clean and Minimal Design
 * Simple white/light gray design
 */

import { Link } from "react-router-dom";
import { Heart, Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: "All Collections", path: "/shop" },
      { label: "Luxury Trays", path: "/shop?category=Trays" },
      { label: "Resin Jewelry", path: "/shop?category=Jewelry" },
      { label: "Home Decor", path: "/shop?category=Decor" },
    ],
    support: [
      { label: "Track Order", path: "/orders" },
      { label: "Shipping Policy", path: "/shipping" },
      { label: "Returns & Exchanges", path: "/returns" },
      { label: "FAQs", path: "/faqs" },
    ],
    company: [
      { label: "Our Story", path: "/about" },
      { label: "Contact Us", path: "/contact" },
      { label: "Wholesale", path: "/wholesale" },
      { label: "Privacy Policy", path: "/privacy" },
    ]
  };

  return (
    <footer className="bg-[#2C2420] text-white pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-8 group">
              <span className="text-3xl font-black uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
                Bliss <span className="text-primary italic font-serif lowercase">of</span> Resin
              </span>
              <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500" />
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-sm">
              Elevating everyday living through artisanal resin excellence. Handcrafted masterpieces for the modern home.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Facebook, Twitter, Mail].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">Shop</h4>
              <ul className="space-y-4">
                {footerLinks.shop.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden sm:block">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">Support</h4>
              <ul className="space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">Visit Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-gray-400">
                <MapPin size={20} className="text-primary flex-shrink-0" />
                <span className="text-sm leading-relaxed">
                  123 Artisanal Way, Creative District<br />
                  Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center gap-4 text-gray-400">
                <Phone size={20} className="text-primary flex-shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-4 text-gray-400">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <span className="text-sm">studio@blissofresin.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter / Bottom Strip */}
        <div className="pt-12 border-t border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-8">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            © {currentYear} Bliss of Resin. Handcrafted with <Heart size={12} className="inline text-primary mx-1" fill="currentColor" /> in India.
          </p>
          
          <div className="flex items-center gap-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
