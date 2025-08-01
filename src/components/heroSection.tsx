"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
// Animation variants
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

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("Nitish Kumar");
  const [showNotification, setShowNotification] = useState(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = today.toLocaleString("en-US", { month: "short" });
  const textLg = "- An Undergraduate Passionate Engineering Student -";
  const textSm = "- Passionate Undergraduate Engineer -";
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      setIsDrawerOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateName = () => {
      const width = window.innerWidth;
      setDisplayName(width < 1024 ? "Nitish K." : "Nitish Kumar");
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
    <div>
      <div className="relative w-screen h-screen animate-fade-in" id="home">
        {/* Portfolio Text - Top Left */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideIn(-1)}
          className="absolute top-5 sm:top-6 left-6 z-30"
        >
          <h2
            className={`${madimiOne.className} text-2xl sm:text-3xl text-white font-bold`}
          >
            {displayName}
          </h2>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center w-full h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* <motion.h1
            variants={scaleUp}
            className={`${madimiOne.className} text-7xl sm:text-8xl md:text-8xl lg:text-9xl font-bold text-transparent drop-shadow-lg relative`}
            style={{ WebkitTextStroke: "3px white" }}
          >
            {displayName}
          </motion.h1> */}
<div className="flex flex-col items-center relative">
            <div className=" flex justify-center items-center">
            <div className="">
              <AnimatedAvatar isDark={true} />
            </div>
            {/* Social Icons */}
            <motion.div
              className="absolute w-[100%] md:w-[600px] h-[200px] md:h-[300px]  z-50"
              initial="hidden"
              animate="visible"
            >
              {socialIcons.map((icon, idx) => (
                <motion.div
                  key={idx}
                  className="absolute"
                  style={icon.style}
                  animate={{
                    y: iconFloatVariants[idx].y,
                    rotate: iconFloatVariants[idx].rotate,
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2, // unique duration per icon
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                >
                  <a
                    href={icon.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white text-4xl sm:text-6xl ${icon.hoverColor} transition-all duration-300 ease-in-out `}
                  >
                    <i className={`bx ${icon.icon}`}></i>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <div className="flex justify-center items-center overflow-hidden w-auto absolute -bottom-17">
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <textPath href="#uPath" startOffset="50%" textAnchor="middle">
                  <tspan className="hidden lg:inline">{textLg}</tspan>
                  <tspan className="inline lg:hidden">{textSm}</tspan>
                </textPath>
              </motion.text>
            </svg>
          </div>

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
              >
                <button
                  className="relative inline-block p-px font-semibold leading-6 text-white bg-white/20 shadow-2xl cursor-pointer rounded-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 text-xs sm:text-base"
                  onClick={() =>
                    document
                      .getElementById(index ? "contact" : "projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 via-[#18786E] to-[#29CEB9] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                  <span className="relative z-10 block px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl bg-[#031412] hover:text-[#a0f7eb]">
                    <div className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                      <span className="transition-all duration-500 group-hover:translate-x-1">
                        {text}
                      </span>
                      {index === 1 && (
                        <svg
                          className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-500 group-hover:translate-x-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            clipRule="evenodd"
                            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                            fillRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </span>
                </button>
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
          <span
            className="text-5xl sm:text-8xl font-bold stroke-2 text-transparent text-center mb-3 sm:mb-0"
            style={{ WebkitTextStroke: "1px white" }}
          >
            {day}
          </span>
          <div className="bottom-4 right-4 text-white py-3.5 flex flex-col items-end">
            <span className="text-md sm:text-2xl font-semibold mt-1 mr-1 sm:mr-3">
              {month}
            </span>
            <span className="text-[8px] sm:text-sm font-medium">Available</span>
            <span className="text-[8px] sm:text-sm font-medium">for Work</span>
          </div>
        </motion.div>

        {/* Location Icon - Bottom Left */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className={`${madimiOne.className} absolute bottom-15 left-6 text-white flex items-center gap-2`}
        >
          <i className="bx bx-map text-2xl sm:text-3xl"></i>
          <span className="text-sm sm:text-base">SNP, HR, IN</span>
        </motion.div>

        {/* Quote - Bottom Center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 text-center"
        >
          <p
            className={`${madimiOne.className} text-[10px] sm:text-base text-white/50 italic`}
          >
            "The best way to predict the future is to create it."
          </p>
        </motion.div>
      </div>

      {/* Floating Navigation */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className={`flex items-center justify-center bg-[#03141278] backdrop-blur-md rounded-xl shadow-lg transition-all duration-300 border-[0.5px] border-white/50 ${
            isScrolled ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{ width: "40px", height: "40px" }}
        >
          <i
            className={`bx ${
              isDrawerOpen ? "bx-menu-alt-right" : "bx-menu"
            } text-white text-2xl`}
          ></i>
        </button>

        <div
          className={`absolute bottom-14 right-0 flex flex-col space-y-4 transition-all duration-300 ${
            isDrawerOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
        >
          {[
            { icon: "bx-home", href: "#home" },
            { icon: "bx-user", href: "#about" },
            { icon: "bx-book", href: "#quali" },
            { icon: "bx-briefcase", href: "#projects" },
            { icon: "bx-envelope", href: "#contact" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={() => setIsDrawerOpen(false)}
              className="flex bg-[#03141278] backdrop-blur-md rounded-xl justify-center items-center shadow-lg hover:bg-white/30 transition-all duration-300 border-[0.5px] border-white/50"
              style={{ width: "40px", height: "40px" }}
            >
              <i
                className={` bx ${item.icon} text-white text-2xl sm:text-xl`}
              ></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
