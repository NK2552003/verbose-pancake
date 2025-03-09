"use client"
import "boxicons/css/boxicons.min.css";
import { useEffect, useState } from "react"
import { Madimi_One } from 'next/font/google';
import TerminalSec from "./Terminal";
import GitHubStats from "./GithubStats";
import GridLayout from "./AdditionalActivity";
import Timeline from "./timeline";
import Projects from "./projects";
import ProjectsCP from "./codepen";
import ContactSection from "./contact-section";
import Footer from "./footer";

const madimiOne = Madimi_One({ weight: '400', subsets: ['latin'] });

export default function HeroSection() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [displayName, setDisplayName] = useState("Nitish Kumar");
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0"); // Ensures two-digit format
    const month = today.toLocaleString("en-US", { month: "short" }); // "Mar"

    useEffect(() => {
        const updateName = () => {
            const width = window.innerWidth;
            if (width < 1024) {
                setDisplayName("Nitish K."); // Tablet
            } else {
                setDisplayName("Nitish Kumar"); // Desktop
            }
        };

        updateName();
        window.addEventListener("resize", updateName);

        return () => window.removeEventListener("resize", updateName);
    }, []);

    useEffect(() => {
        // Disable scrolling when the menu is open
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        // Cleanup function to re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [menuOpen]);

    return (
        <div className="relative w-screen h-screen" id="home">
 {/* Portfolio Text - Top Left */}
<div className="absolute top-10 sm:top-6 left-6 z-30">
    <h2 className={`${madimiOne.className} text-2xl sm:text-3xl text-white font-bold`}>
        Portfolio
    </h2>
</div>

{/* Menu Button */}
<button
    onClick={() => setMenuOpen(!menuOpen)}
    className="fixed top-6 right-6 p-3 rounded-lg transition-all duration-300 z-100"
>
    <svg
        className={`w-10 h-10 text-white transition-transform duration-300 ${
            menuOpen ? "rotate-180 scale-110" : "rotate-220"
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {menuOpen ? (
            <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
            </>
        ) : (
            <>
                <line x1="4" y1="6" x2="10" y2="6" />
                <line x1="2" y1="12" x2="15" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
            </>
        )}
    </svg>
</button>

{/* Blur Background & Centered Menu */}
<div
    className={`fixed inset-0 bg-black/60 backdrop-blur-lg z-20 flex flex-col items-center justify-center transition-opacity duration-300 ${
        menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
    }`}
>
    <ul
        className={`text-white text-3xl space-y-6 transition-all duration-300 text-center ${
            menuOpen ? "scale-100" : "scale-95"
        }`}
    >
        <li>
            <a
                href="#home"
                onClick={() => setMenuOpen(false)}
                className="hover:text-teal-400 transition-all duration-300 cursor-pointer"
            >
                Home
            </a>
        </li>
        <li>
            <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="hover:text-teal-400 transition-all duration-300 cursor-pointer"
            >
                About Me
            </a>
        </li>
        <li>
            <a
                href="#quali"
                onClick={() => setMenuOpen(false)}
                className="hover:text-teal-400 transition-all duration-300 cursor-pointer"
            >
                Qualifications
            </a>
        </li>
        <li>
            <a
                href="#projects"
                onClick={() => setMenuOpen(false)}
                className="hover:text-teal-400 transition-all duration-300 cursor-pointer"
            >
                Projects
            </a>
        </li>
        <li>
            <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="hover:text-teal-400 transition-all duration-300 cursor-pointer"
            >
                Contact Me
            </a>
        </li>
    </ul>
</div>

            {/* Main Content with Blur Effect */}
            <div
                className={`relative z-10 flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                    menuOpen ? "scale-90 opacity-0 invisible" : "scale-100 opacity-100 visible"
                }`}
            >
                <h1
                    className={`${madimiOne.className} text-7xl sm:text-8xl md:text-8xl lg:text-9xl font-bold text-transparent drop-shadow-lg`}
                    style={{ WebkitTextStroke: "3px white" }}
                >
                    {displayName}
                </h1>
                <p className={`${madimiOne.className} text-base sm:text-xl text-white/80 max-w-2xl text-center relative`}>
                    <span className="hidden lg:inline">An Undergraduate Passionate Engineering Student</span>
                    <span className="inline lg:hidden">Passionate Undergraduate Engineer</span>
                    <span className="absolute left-[-20%] top-1/2 h-[2px] md:w-[18%] bg-white/30 transform -translate-y-1/2 rounded-full"></span>
                    <span className="absolute right-[-20%] top-1/2 h-[2px] md:w-[18%] bg-white/30 transform -translate-y-1/2 rounded-full"></span>
                </p>

            {/* Social Icons */}
            <div className="flex gap-1 sm:gap-1 mt-3">
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
                <div className="flex items-center justify-center mt-2 sm:mt-5 gap-2">
                    <div className="relative group">
                        <button
                            className="relative inline-block p-px font-semibold leading-6 text-white bg-white/20 shadow-2xl cursor-pointer rounded-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 text-xs sm:text-base"
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
            <div className={`${madimiOne.className} absolute bottom-4 right-4 text-white px-6 py-4 flex items-end ${menuOpen ? "scale-90 opacity-0 invisible" : "scale-100 opacity-100 visible"}`}>
                <span className=" text-5xl sm:text-8xl font-bold stroke-2 text-transparent text-center mb-3 sm:mb-0" style={{ WebkitTextStroke: "1px white" }}>{day}</span>
                <div className="bottom-4 right-4 text-white py-3.5 flex flex-col items-end">
                    <span className="text-md sm:text-2xl font-semibold mt-1 mr-1 sm:mr-3">{month}</span>
                    <span className="text-[8px] sm:text-sm font-medium">Available</span>
                    <span className="text-[8px] sm:text-sm font-medium">for Work</span>
                </div>
            </div>

            {/* Location Icon and Text - Bottom Left */}
            <div className={`${madimiOne.className} absolute bottom-15 left-6 text-white flex items-center gap-2 ${menuOpen ? "scale-90 opacity-0 invisible" : "scale-100 opacity-100 visible"}`}>
                <i className="bx bx-map text-2xl sm:text-3xl"></i>
                <span className="text-sm sm:text-base">SNP, HR, IN</span>
            </div>

            {/* Quote - Bottom Center */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 text-center">
                <p className={`${madimiOne.className} text-[10px] sm:text-base text-white/50 italic ${menuOpen ? "scale-90 opacity-0 invisible" : "scale-100 opacity-100 visible"}`}>
                    "The best way to predict the future is to create it."
                </p>
            </div>

            {/* Gradient Overlay */}
            <div className={` w-[100%] h-[100vh] relative transition-all`}>
                <div className="absolute h-auto inset-0">
                    <div className="flex flex-col items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] text-center text-white relative z-10 p-4" id="about">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 mt-20">A Glimpse Into My World</h1>
                        <p className="text-sm sm:text-base md:text-lg text-white/80">
                            Learn more about who I am, what I do, and what inspires me.
                        </p>
                    </div>
                        <TerminalSec/>
                        <GitHubStats/>
                        <GridLayout/>
                        <Timeline/>
                        <Projects/>
                        <ProjectsCP/>
                        <ContactSection/>
                        <Footer/>
                </div>
            </div>
        </div>
    );
}