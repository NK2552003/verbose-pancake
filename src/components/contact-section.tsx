"use client";
import React from "react";
import ContactForm from "./contact-form";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

export default function ContactSection() {
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const lineVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { 
      width: "5rem", 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.4 }
    }
  };
  
  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="relative py-16 sm:py-20 z-10"
    >
      <div className="mb-10 text-center">
        <motion.h2 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={titleVariants}
          className="text-3xl md:text-5xl font-bold text-white"
        >
          Contact Me
        </motion.h2>
        
        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={lineVariants}
          style={{ margin: "0 auto" }}
          className="h-1 bg-primary mx-auto mb-2"
        />
        
        <motion.p 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={textVariants}
          className="text-muted-foreground max-w-3xl mx-auto text-white/80 mb-20"
        >
          I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
        </motion.p>
      </div>
      
      <div className="w-full">
        <ContactForm />
      </div>
    </section>
  );
}