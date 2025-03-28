
import React from "react";
import { motion } from "framer-motion";
import { Database } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <motion.div 
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-6 h-6"
            >
              <Database className="w-4 h-4 text-primary/70" />
            </motion.div>
            <span className="text-sm text-foreground/70">
              DistFS &copy; {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-foreground/60">
            <span>Distributed File System</span>
            <span>•</span>
            <span>Fault Tolerance</span>
            <span>•</span>
            <span>High Availability</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
