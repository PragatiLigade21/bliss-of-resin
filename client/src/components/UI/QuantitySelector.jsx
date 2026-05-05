import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export const QuantitySelector = ({ quantity, onIncrease, onDecrease, disabled = false }) => {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Minus size={18} className="text-gray-700" />
      </motion.button>

      <span className="w-8 text-center font-semibold text-lg">{quantity}</span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onIncrease}
        disabled={disabled}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus size={18} className="text-gray-700" />
      </motion.button>
    </div>
  );
};

export default QuantitySelector;
