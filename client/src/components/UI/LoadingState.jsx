import { motion } from "framer-motion";
import Spinner from "./Spinner";

export const LoadingState = ({ message = "Loading..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <Spinner size="lg" color="primary" />
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </motion.div>
  );
};

export default LoadingState;
