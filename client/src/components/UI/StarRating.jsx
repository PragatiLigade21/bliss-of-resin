import { Star } from "lucide-react";
import { motion } from "framer-motion";

export const StarRating = ({ rating = 4.5, count = 128, size = "md" }) => {
  const sizeMap = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const starSize = sizeMap[size];
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {stars.map((star) => (
          <motion.div
            key={star}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: star * 0.05 }}
          >
            <Star
              size={starSize}
              className={
                star <= Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          </motion.div>
        ))}
      </div>
      <span className="text-sm text-gray-600">
        {rating} <span className="text-gray-400">({count})</span>
      </span>
    </div>
  );
};

export default StarRating;
