/**
 * Hero Section - Clean and Minimal Design
 * Large hero banner with simple content
 */

import { Link } from "react-router-dom";
import resinBanner from "../../hero-banner.png";

function HeroSection() {
  return (
    <section className="relative bg-white">
      {/* Large Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Handcrafted
              <span className="block text-gray-500 font-normal">Resin Art</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              Discover unique, handcrafted resin pieces designed to bring elegance to your space. Each item is made with care and attention to detail.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium text-sm"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-sm"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image - Large Banner Style */}
          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/3] lg:aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={resinBanner}
                alt="Resin Art"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
