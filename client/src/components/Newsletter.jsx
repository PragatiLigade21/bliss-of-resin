import { Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Welcome to the inner circle!");
      setEmail("");
    }
  };

  return (
    <section className="py-32 bg-gray-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto glass-morphism rounded-[4rem] p-12 md:p-20 text-center border-white/5">
          <p className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-6">The Inner Circle</p>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Exclusive Access <br />
            <span className="italic font-light">to New Collections</span>
          </h2>
          <p className="text-gray-400 mb-12 text-lg font-light max-w-xl mx-auto leading-relaxed">
            Join our curated newsletter and be the first to know about limited edition drops, 
            artisan stories, and private events.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto p-2 bg-white/5 rounded-full border border-white/10 focus-within:border-primary/50 transition-all duration-500">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-grow px-8 py-4 bg-transparent text-white outline-none placeholder:text-gray-600 font-light"
              required
            />
            <button
              type="submit"
              className="px-10 py-4 bg-white text-gray-900 rounded-full hover:bg-primary hover:text-white transition-all duration-500 font-bold flex items-center justify-center gap-3 group"
            >
              Join Now
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
          
          <p className="mt-8 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
            No Spam. Only Art. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
