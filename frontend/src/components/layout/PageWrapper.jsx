import React, { useEffect } from "react";
import { motion } from "framer-motion";

export function PageWrapper({ title, className = "", children }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`mx-auto w-full max-w-[1280px] px-4 py-8 pb-24 sm:px-6 md:pb-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}
