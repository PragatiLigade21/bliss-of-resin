import { Truck, ShieldCheck, Headphones, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over ₹1000",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure payment methods",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support anytime",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
];

function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="flex-shrink-0 w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-[2rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 luxury-shadow group-hover:-translate-y-2 mb-6">
                <feature.icon size={32} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium max-w-[200px] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
    </section>
  );
}

export default Features;
