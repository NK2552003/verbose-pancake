"use client";
import React, { Suspense, useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

const Footer: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.2 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const sectionVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const hrVariants = {
    hidden: { width: "0%", opacity: 0 },
    visible: {
      width: "100%",
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const creditVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.8, 
        duration: 0.5, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <footer 
      ref={footerRef}
      className="bg-[#02100e] bg-opacity-50 text-white py-5 px-2.5 relative z-10"
    >
      <motion.div 
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="flex flex-wrap justify-evenly max-w-full mx-auto"
      >
        {/* About Section */}
        <motion.div 
          variants={sectionVariants}
          className="flex-1 min-w-[250px] my-2.5 mx-5 py-2.5 px-5"
        >
          <h2 className="text-lg mb-2.5 pb-1.25">
            About Me
            <motion.div variants={hrVariants} className="border-b-2 border-white mt-1" />
          </h2>
          <motion.p variants={itemVariants} className="text-sm leading-6 text-gray-400">
            Passionate developer creating stunning web experiences. Let's build something amazing together!
          </motion.p>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div 
          variants={sectionVariants}
          className="flex-1 min-w-[250px] my-2.5 mx-5 py-2.5 px-5"
        >
          <h2 className="text-lg mb-2.5 pb-1.25">
            Quick Links
            <motion.div variants={hrVariants} className="border-b-2 border-white mt-1" />
          </h2>
          <ul className="text-sm leading-6 text-gray-400">
            {["Home", "About", "Qualifications", "Projects", "Contact"].map((item, index) => (
              <motion.li 
                key={item}
                variants={itemVariants}
                custom={index}
                transition={{ delay: index * 0.1 }}
              >
                <button 
                  onClick={() => window.location.href = `#${item.toLowerCase()}`} 
                  className="w-full text-left hover:text-white hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  {item}
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          variants={sectionVariants}
          className="flex-1 min-w-[250px] my-2.5 mx-5 py-2.5 px-5"
        >
          <h2 className="text-lg mb-2.5 pb-1.25">
            Contact
            <motion.div variants={hrVariants} className="border-b-2 border-white mt-1" />
          </h2>
          <motion.p variants={itemVariants} className="text-sm leading-6 text-gray-400">
            Email: <a href="mailto:nk2552003@gmail.com" className="text-gray-400 hover:text-white hover:underline">nk2552003@gmail.com</a>
          </motion.p>
          <motion.div variants={itemVariants} className="mt-3.75">
            {isClient && (
              <Suspense fallback={<div>Loading...</div>}>
                <a href="https://www.instagram.com/nitish.2432/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white no-underline mr-3.75 text-3xl">
                  <i className="bx bxl-instagram"></i>
                </a>
                <a href="https://www.linkedin.com/in/nk2552003/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white no-underline mr-3.75 text-3xl">
                  <i className="bx bxl-linkedin"></i>
                </a>
                <a href="https://codepen.io/rlaqxvbr-the-bashful" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white no-underline mr-3.75 text-3xl">
                  <i className="bx bxl-codepen"></i>
                </a>
              </Suspense>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        variants={creditVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-center mt-5 text-sm text-gray-400"
      >
        Made with <i className="bx bx-heart"></i> by Nitish Kumar
      </motion.div>
    </footer>
  );
};

export default Footer;