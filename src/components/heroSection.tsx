"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Madimi_One } from "next/font/google";
import "boxicons/css/boxicons.min.css";
import AnimatedAvatar from "./animated_avatar";

const madimiOne = Madimi_One({ weight: "400", subsets: ["latin"] });
const iconFloatVariants = [
  { y: [0, -10, 10], rotate: -5 },
  { y: [0, -15, 15], rotate: 3 },
  { y: [0, 8, -8], rotate: -7 },
  { y: [0, -5, 5], rotate: 2 },
  { y: [0, 12, -12], rotate: -3 },
  { y: [0, -10, 10], rotate: 6 },
  { y: [0, 15, -15], rotate: -2 },
  { y: [0, -7, 7], rotate: 4 },
  { y: [0, 5, -5], rotate: -1 },
];

const socialIcons = [
  {
    href: "https://www.facebook.com/nk222003/",
    icon: "bxl-facebook-circle",
    hoverColor: "hover:text-blue-500",
    style: { top: "10%", left: "5%"},
  },
  {
    href: "https://www.instagram.com/nitish.2432/",
    icon: "bxl-instagram-alt",
    hoverColor: "hover:text-pink-500",
    style: { top: "30%", left: "85%" },
  },
  {
    href: "https://github.com/NK2552003",
    icon: "bxl-github",
    hoverColor: "hover:text-gray-400",
    style: { top: "50%", left: "10%" },
  },
  {
    href: "https://codepen.io/rlaqxvbr-the-bashful",
    icon: "bxl-codepen",
    hoverColor: "hover:text-blue-200",
    style: { top: "78%", left: "20%" },
  },
  {
    href: "https://www.deviantart.com/sidkr222003/gallery",
    icon: "bxl-deviantart",
    hoverColor: "hover:text-green-500",
    style: { top: "80%", left: "80%" },
  },
  {
    href: "https://www.linkedin.com/in/nk2552003/",
    icon: "bxl-linkedin-square",
    hoverColor: "hover:text-blue-700",
    style: { top: "20%", left: "70%" }, // moved right
  },
  {
    href: "https://youpic.com/nitish",
    icon: "bx-camera", // YouPic fallback
    hoverColor: "hover:text-yellow-400",
    style: { top: "-10%", left: "78%" }, // moved right
  },
  {
    href: "https://dev.to/nk2552003",
    icon: "bxl-dev-to",
    hoverColor: "hover:text-black",
    style: { top: "30%", left: "20%" }, // moved left
  },
  {
    href: "https://dribbble.com/nk2552003",
    icon: "bxl-dribbble",
    hoverColor: "hover:text-pink-400",
    style: { top: "56%", left: "70%" },
  },
];

// Enhanced Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

const slideIn = (direction: number) => ({
  hidden: { x: direction * 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
});

// New animation variants
const bounceIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.5,
    },
  },
};

const rotateIn = {
  hidden: { rotate: -180, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const floatingVariants = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function HeroSection() {

  const [displayName, setDisplayName] = useState<string>("Nitish Kumar");
  const [showNotification, setShowNotification] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = today.toLocaleString("en-US", { month: "short" });
  const textLg = "- An Undergraduate Passionate Engineering Student -";
  const textSm = "- Passionate Undergraduate Engineer -";



  useEffect(() => {
    const updateName = () => {
      const width = window.innerWidth;
      setDisplayName(width < 1024 ? "Nitish K." : "Nitish Kumar");
      setIsMobile(width < 768); // Consider mobile as screens smaller than 768px
    };

    updateName();
    window.addEventListener("resize", updateName);
    return () => window.removeEventListener("resize", updateName);
  }, []);

  useEffect(() => {
    if (showNotification) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showNotification]);

  useEffect(() => {
    const handleScroll = () => {
      if (showNotification) setShowNotification(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showNotification]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="relative w-screen h-screen animate-fade-in" id="home">
        {/* Portfolio Text - Top Left */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideIn(-1)}
          className="absolute top-5 sm:top-6 left-6 z-30"
        >
          <motion.h2
            className={`${madimiOne.className} text-2xl sm:text-3xl text-white font-bold`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {displayName}
          </motion.h2>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center w-full h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div 
            className="flex flex-col items-center relative"
          >
            <div 
              className="flex justify-center items-center"
            >
                <AnimatedAvatar isDark={true} />
              
              {/* Social Icons */}
              <motion.div
                className="absolute w-[100%] md:w-[600px] h-[200px] md:h-[300px] z-50"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {socialIcons.map((icon, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute"
                    style={icon.style}
                    animate={
                      isMobile
                        ? {}
                        : {
                            y: iconFloatVariants[idx].y,
                            rotate: iconFloatVariants[idx].rotate,
                          }
                    }
                    transition={
                      isMobile
                        ? {}
                        : {
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut",
                          }
                    }
                    whileHover={{
                      scale: 1.2,
                      rotate: 15,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.a
                      href={icon.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-white/80 text-4xl sm:text-6xl ${icon.hoverColor} transition-all duration-300 ease-in-out block`}
                      whileHover={{ y: -5 }}
                    >
                      <i className={`bx ${icon.icon}`}></i>
                    </motion.a>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <motion.div 
              className="flex justify-center items-center overflow-hidden w-auto absolute -bottom-18"
              variants={slideUp}
            >
              <svg
                viewBox="0 0 500 200"
                preserveAspectRatio="xMidYMid meet"
                className="w-full max-w-[500px] h-[200px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* U path */}
                <path id="uPath" d="M10,20 Q250,180 470,20" fill="none" />

                {/* Fixed-size text on curve */}
                <motion.text
                  className="fill-white text-[16px]"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                >
                  <textPath href="#uPath" startOffset="50%" textAnchor="middle">
                    <tspan className="hidden lg:inline">{textLg}</tspan>
                    <tspan className="inline lg:hidden">{textSm}</tspan>
                  </textPath>
                </motion.text>
              </svg>
            </motion.div>
          </div>

          {/* Buttons */}
          <motion.div
            className="flex items-center justify-center mt-2 sm:mt-5 gap-2 relative -top-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {["My Work", "Get in Touch"].map((text, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.button
                  className="relative inline-block p-px font-semibold leading-6 text-white bg-white/20 shadow-2xl cursor-pointer rounded-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out text-xs sm:text-base"
                  onClick={() =>
                    document
                      .getElementById(index ? "contact" : "projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 via-[#18786E] to-[#29CEB9] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                  <span className="relative z-10 block px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl bg-[#031412] hover:text-[#a0f7eb]">
                    <div className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                      <motion.span 
                        className="transition-all duration-500"
                        whileHover={{ x: 2 }}
                      >
                        {text}
                      </motion.span>
                      {index === 1 && (
                        <motion.svg
                          className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          whileHover={{ x: 3, scale: 1.1 }}
                        >
                          <path
                            clipRule="evenodd"
                            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                            fillRule="evenodd"
                          />
                        </motion.svg>
                      )}
                    </div>
                  </span>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Date and Month - Bottom Right */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideIn(1)}
          className={`${madimiOne.className} absolute bottom-4 right-4 text-white px-6 py-4 flex items-end`}
        >
          <motion.span
            className="text-5xl sm:text-8xl font-bold stroke-2 text-transparent text-center mb-3 sm:mb-0"
            style={{ WebkitTextStroke: "1px white" }}
            variants={rotateIn}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {day}
          </motion.span>
          <motion.div 
            className="bottom-4 right-4 text-white py-3.5 flex flex-col items-end"
            animate="animate"
          >
            <motion.span 
              className="text-md sm:text-2xl font-semibold mt-1 mr-1 sm:mr-3"
              whileHover={{ scale: 1.05 }}
            >
              {month}
            </motion.span>
            <motion.span 
              className="text-[8px] sm:text-sm font-medium"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              Available
            </motion.span>
            <motion.span 
              className="text-[8px] sm:text-sm font-medium"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7, duration: 0.5 }}
            >
              for Work
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Location Icon - Bottom Left */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className={`${madimiOne.className} absolute bottom-15 left-6 text-white flex items-center gap-2`}
        >
          <motion.i 
            className="bx bx-map text-2xl sm:text-3xl"
            variants={rotateIn}
            whileHover={{ scale: 1.2, rotate: 10 }}
          ></motion.i>
          <motion.span 
            className="text-sm sm:text-base"
            variants={slideIn(-1)}
            whileHover={{ x: 5 }}
          >
            SNP, HR, IN
          </motion.span>
        </motion.div>

        {/* Quote - Bottom Center */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <motion.p
            className={`${madimiOne.className} text-[10px] sm:text-base text-white/50 italic`}
            animate="animate"
          >
            "The best way to predict the future is to create it."
          </motion.p>
        </motion.div>
      </div>

  
    </motion.div>
  );
}