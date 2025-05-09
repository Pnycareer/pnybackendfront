import { motion } from "framer-motion";

const Loader = () => (
  <div className="flex flex-col items-center justify-center h-60">
    <motion.div
      className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
    <p className="text-gray-300 mt-3">Loading courses...</p>
  </div>
);

export default Loader;
