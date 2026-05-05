/**
 * Footer - Clean and Minimal Design
 * Simple white/light gray design
 */

import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Bliss of Resin
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Handcrafted resin art pieces designed to bring elegance to your space. Each item is made with care and attention to detail.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link to="/" className="hover:text-gray-900 dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-gray-900 dark:hover:text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gray-900 dark:hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>info@blissofresin.com</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2026 Bliss of Resin. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Made with <Heart size={14} className="text-gray-400" /> for art lovers
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
