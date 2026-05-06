import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Sparkles, Award } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Bliss of Resin
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We create unique, handcrafted resin art pieces designed to bring elegance to your space.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
              <img
                src="https://media.istockphoto.com/id/2228231094/photo/resin-epoxy-artworks-on-craft-table-with-paintbrushes-mixing-cups-wooden-art-base-for-artisan.jpg?s=2048x2048&w=is&k=20&c=QilmxMjjcj9B5jurvOMkJ0XE7-xKqzJ0vabnCJrF0cY="
                alt="Our Craft"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Bliss of Resin was born from a passion for creating beautiful, functional art. 
                Each piece is meticulously handcrafted using premium epoxy resin, transforming 
                ordinary items into extraordinary works of art.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our skilled artisans combine creativity with precision to produce unique pieces 
                that showcase the beauty of resin - its clarity, depth, and ability to capture 
                light in mesmerizing ways.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every item in our collection is made with attention to detail and a commitment 
                to quality that ensures you'll enjoy your piece for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl">🎨</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Handcrafted Quality</h3>
              <p className="text-sm text-gray-500">
                Each piece is individually handcrafted with meticulous attention to detail.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Premium Materials</h3>
              <p className="text-sm text-gray-500">
                We use only the highest quality resins and materials for lasting beauty.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl">💝</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Customer Satisfaction</h3>
              <p className="text-sm text-gray-500">
                Your satisfaction is our priority. We stand behind every piece we create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Explore Our Collection</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Discover our handcrafted resin art pieces designed to transform your space.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-100 font-medium"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;