"use client";
import { useEffect, useState } from "react";
import { Madimi_One } from "next/font/google";

import 'boxicons/css/boxicons.min.css';
// Define the font
const madimiOne = Madimi_One({ weight: "400", subsets: ["latin"] });

export default function HeroSection() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>("Nitish Kumar");
    const [showNotification, setShowNotification] = useState(false);

    const [isScrolled, setIsScrolled] = useState<boolean>(false); // State to track scroll position
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false); // State to manage drawer visibility

    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = today.toLocaleString("en-US", { month: "short" });


    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
            setIsDrawerOpen(false); // Close the drawer on scroll
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Update display name based on window width
    useEffect(() => {
        const updateName = () => {
            const width = window.innerWidth;
            if (width < 1024) {
                setDisplayName("Nitish K.");
            } else {
                setDisplayName("Nitish Kumar");
            }
        };

        updateName();
        window.addEventListener("resize", updateName);

        return () => window.removeEventListener("resize", updateName);
    }, []);


    // Track scroll position to show/hide floating button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
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
            if (showNotification) {
                setShowNotification(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [showNotification]);

    return (
        <div>
                <div className="relative w-screen h-screen animate-fade-in" id="home">
                    {/* Portfolio Text - Top Left */}
                    <div className="absolute top-5 sm:top-6 left-6 z-30 sr-portfolio">
                        <h2 className={`${madimiOne.className} text-2xl sm:text-3xl text-white font-bold`}>
                            Portfolio
                        </h2>
                    </div>
            
                    {/* Main Content with Blur Effect */}
                    <div
                        className={`relative z-10 flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                            menuOpen ? "scale-90 opacity-0 invisible" : "scale-100 opacity-100 visible"
                        }`}
                    >
                        <h1
                            className={`${madimiOne.className} sr-title text-7xl sm:text-8xl md:text-8xl lg:text-9xl font-bold text-transparent drop-shadow-lg`}
                            style={{ WebkitTextStroke: "3px white" }}
                        >
                            {displayName}
                        </h1>
                        <p
                            className={`${madimiOne.className} sr-subtitle text-base sm:text-xl text-white/80 max-w-2xl text-center relative`}
                        >
                            <span className="hidden lg:inline">An Undergraduate Passionate Engineering Student</span>
                            <span className="inline lg:hidden">Passionate Undergraduate Engineer</span>
                            <span className="absolute left-[-20%] top-1/2 h-[2px] md:w-[18%] bg-white/30 transform -translate-y-1/2 rounded-full"></span>
                            <span className="absolute right-[-20%] top-1/2 h-[2px] md:w-[18%] bg-white/30 transform -translate-y-1/2 rounded-full"></span>
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-1 sm:gap-1 mt-3 sr-social">
                            <a
                                href="https://www.facebook.com/nk222003/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white text-4xl sm:text-5xl transition-transform duration-300 hover:scale-125 hover:text-blue-500"
                            >
                                <i className="bx bxl-facebook-circle"></i>
                            </a>
                            <a
                                href="https://www.instagram.com/nitish.2432/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white text-4xl sm:text-5xl transition-transform duration-300 hover:scale-125 hover:text-pink-500"
                            >
                                <i className="bx bxl-instagram-alt"></i>
                            </a>
                            <a
                                href="https://github.com/NK2552003"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white text-4xl sm:text-5xl transition-transform duration-300 hover:scale-125 hover:text-gray-400"
                            >
                                <i className="bx bxl-github"></i>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/nk2552003/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white text-4xl sm:text-5xl transition-transform duration-300 hover:scale-125 hover:text-blue-700"
                            >
                                <i className="bx bxl-linkedin-square"></i>
                            </a>
                            <a
                                href="https://codepen.io/rlaqxvbr-the-bashful"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white text-4xl sm:text-5xl transition-transform duration-300 hover:scale-125 hover:text-blue-200"
                            >
                                <i className="bx bxl-codepen"></i>
                            </a>
                            <a
                                href="https://www.deviantart.com/sidkr222003/gallery"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white text-4xl sm:text-5xl transition-transform duration-300 hover:scale-125 hover:text-green-500"
                            >
                                <i className="bx bxl-deviantart"></i>
                            </a>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-center mt-2 sm:mt-5 gap-2 sr-buttons">
                            <div className="relative group">
                                <button
                                    className="relative inline-block p-px font-semibold leading-6 text-white bg-white/20 shadow-2xl cursor-pointer rounded-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 text-xs sm:text-base"
                                    onClick={() => {
                                        const projectsSection = document.getElementById("projects");
                                        if (projectsSection) {
                                            projectsSection.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }}
                                >
                                    <span
                                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 via-[#18786E] to-[#29CEB9] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    ></span>
                                    <span className="relative z-10 block px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl bg-[#031412] hover:text-[#a0f7eb]">
                                        <div className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                                            <span className="transition-all duration-500 group-hover:translate-x-1">
                                                My Work
                                            </span>
                                        </div>
                                    </span>
                                </button>
                            </div>
                            <div className="relative group">
                                <button
                                    className="relative inline-block p-px font-semibold leading-6 text-white bg-white/20 shadow-2xl cursor-pointer rounded-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 text-xs sm:text-base"
                                    onClick={() => {
                                        const projectsSection = document.getElementById("contact");
                                        if (projectsSection) {
                                            projectsSection.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }}
                                >
                                    <span
                                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 via-[#29CEB9] to-[#18786E] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    ></span>
                                    <span className="relative z-10 block px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl bg-[#031412] hover:text-[#a0f7eb]">
                                        <div className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                                            <span className="transition-all duration-500 group-hover:translate-x-1">
                                                Get in Touch
                                            </span>
                                            <svg
                                                className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-500 group-hover:translate-x-1"
                                                data-slot="icon"
                                                aria-hidden="true"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    clipRule="evenodd"
                                                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                                                    fillRule="evenodd"
                                                ></path>
                                            </svg>
                                        </div>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Date and Month - Bottom Right */}
                    <div
                        className={`${madimiOne.className} absolute bottom-4 right-4 text-white px-6 py-4 flex items-end ${
                            menuOpen ? "scale-90 opacity-0 invisible" : "scale-100 opacity-100 visible sr-date"
                        }`}
                    >
                        <span
                            className="text-5xl sm:text-8xl font-bold stroke-2 text-transparent text-center mb-3 sm:mb-0"
                            style={{ WebkitTextStroke: "1px white" }}
                        >
                            {day}
                        </span>
                        <div className="bottom-4 right-4 text-white py-3.5 flex flex-col items-end">
                            <span className="text-md sm:text-2xl font-semibold mt-1 mr-1 sm:mr-3">{month}</span>
                            <span className="text-[8px] sm:text-sm font-medium">Available</span>
                            <span className="text-[8px] sm:text-sm font-medium">for Work</span>
                        </div>
                    </div>

                    {/* Location Icon and Text - Bottom Left */}
                    <div
                        className={`${madimiOne.className} sr-location absolute bottom-15 left-6 text-white flex items-center gap-2 ${
                            menuOpen ? "scale-90 opacity-0 invisible" : "scale-100 opacity-100 visible"
                        }`}
                    >
                        <i className="bx bx-map text-2xl sm:text-3xl"></i>
                        <span className="text-sm sm:text-base">SNP, HR, IN</span>
                    </div>

                    {/* Quote - Bottom Center */}
                    <div
                        className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 text-center"
                        data-scroll
                        data-scroll-speed="0.3"
                    >
                        <p
                            className={`${madimiOne.className} sr-quote text-[10px] sm:text-base text-white/50 italic ${
                                menuOpen ? "scale-90 opacity-0 invisible" : "scale-100 opacity-100 visible"
                            }`}
                        >
                            "The best way to predict the future is to create it."
                        </p>
                    </div>
                </div>
            {/* Floating Button and Drawer */}
            <div className="fixed bottom-5 right-5 z-50">
    {/* Floating Button */}
    <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className={` bg-[#03141278] backdrop-blur-md rounded-xl shadow-lg transition-all duration-300 border-[0.5px] border-white/50 hover:scale-105 hover:border ${
            isScrolled ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
        <i
            className={`bx ${isDrawerOpen ? "bx-menu-alt-right" : "bx-menu"} text-white text-2xl transition-transform duration-300`}
        ></i>
    </button>

    {/* Drawer with Navigation Icons */}
    <div
        className={`absolute bottom-14 right-0 flex flex-col space-y-4 transition-all duration-300 ${
            isDrawerOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"
        }`}
    >
        <a
            href="#home"
            onClick={() => setIsDrawerOpen(false)}
            className=" bg-[#03141278] backdrop-blur-md rounded-xl shadow-lg hover:bg-white/30 transition-all duration-300 border-[0.5px] border-white/50 hover:scale-105 hover:border"
            style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <i className="bx bx-home text-white text-2xl sm:text-xl"></i>
        </a>
        <a
            href="#about"
            onClick={() => setIsDrawerOpen(false)}
            className=" bg-[#03141278] backdrop-blur-md rounded-xl shadow-lg hover:bg-white/30 transition-all duration-300 border-[0.5px] border-white/50 hover:scale-105 hover:border"
            style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <i className="bx bx-user text-white text-2xl sm:text-xl"></i>
        </a>
        <a
            href="#quali"
            onClick={() => setIsDrawerOpen(false)}
            className="bg-[#03141278] backdrop-blur-md rounded-xl shadow-lg hover:bg-white/30 transition-all duration-300 border-[0.5px] border-white/50 hover:scale-105 hover:border"
            style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <i className="bx bx-book text-white text-2xl sm:text-xl"></i>
        </a>
        <a
            href="#projects"
            onClick={() => setIsDrawerOpen(false)}
            className=" bg-[#03141278] backdrop-blur-md rounded-xl shadow-lg hover:bg-white/30 transition-all duration-300 border-[0.5px] border-white/50 hover:scale-105 hover:border"
            style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <i className="bx bx-briefcase text-white text-2xl sm:text-xl"></i>
        </a>
        <a
            href="#contact"
            onClick={() => setIsDrawerOpen(false)}
            className=" bg-[#03141278] backdrop-blur-md rounded-xl shadow-lg hover:bg-white/30 transition-all duration-300 border-[0.5px] border-white/50 hover:scale-105 hover:border"
            style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <i className="bx bx-envelope text-white text-2xl sm:text-xl"></i>
        </a>
    </div>
</div>
        </div>
    );
}
