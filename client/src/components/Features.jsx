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
    <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <feature.icon size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
