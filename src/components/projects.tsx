"use client";

import { useState, useEffect } from 'react';

const projects = [
  {
    id: "1",
    title: "BlissCamp",
    category: "Web Development",
    image: "/Project_Assets/Images/1.png",
    video: "/Project_Assets/Videos/1.mp4",
    description: "A website for Tourists and Travellers",
    links: {
      live: "https://nk2552003.github.io/BlissCampIndia/",
      github: "https://github.com/NK2552003/BlissCampIndia",
      codepen: "https://github.com/NK2552003/BlissCampIndia",
    },
    progress: "Completed",
  },
  {
    id: "6",
    title: "HostelEase",
    category: "App Development",
    image: "/Project_Assets/Images/6.png",
    video: "/Project_Assets/Videos/6.mp4",
    description:
      "The management app for hostelers, warden, for seamless interaction.",
    links: {
      live: "https://github.com/NK2552003/Hostel_Management_App",
      github: "https://github.com/NK2552003/Hostel_Management_App",
      codepen: "https://github.com/NK2552003/Hostel_Management_App",
    },
    progress: "Working on it",
  },
  {
    id: "7",
    title: "Portfolio",
    category: "Web Development",
    image: "/Project_Assets/Images/7.png",
    video: "/Project_Assets/Videos/7.mp4",
    description: "created the portfolio for my colleague for resume purpose.",
    links: {
      live: "https://rohit-s-portfolio.netlify.app/",
      github: "https://github.com/NK2552003/Rohit-s_Portfolio",
      codepen: "https://github.com/NK2552003/Rohit-s_Portfolio",
    },
    progress: "Completed",
  },
  {
    id: "9",
    title: "Satranj",
    category: "App Development",
    image: "/Project_Assets/Images/8.png",
    video: "/Project_Assets/Videos/8.mp4",
    description: "A Simple and Easy-to-Play Ancient Chess Game in Flutter",
    links: {
      live: "https://github.com/NK2552003/Satranj-Chess-_Game",
      github: "https://github.com/NK2552003/Satranj-Chess-_Game",
      codepen: "https://github.com/NK2552003/Satranj-Chess-_Game",
    },
    progress: "Completed",
  },
  {
    id: "10",
    title: "Civic Link",
    category: "Web Development",
    image: "/Project_Assets/Images/10.png",
    video: "/Project_Assets/Videos/10.mp4",
    description:
      "A collaborative platform dedicated to society or community to report or for services in the society means a community handler.",
    links: {
      live: "https://nk2552003.github.io/Civic_Link/",
      github: "https://github.com/NK2552003/Civic_Link",
      codepen: "https://nk2552003.github.io/Civic_Link/",
    },
    progress: "Completed",
  },
  {
    id: "11",
    title: "FreshMart",
    category: "App Development",
    image: "/Project_Assets/Images/11.png",
    video: "/Project_Assets/Videos/v_1.mp4",
    description: "Your one stop for everything",
    links: {
      live: "https://github.com/NK2552003/FreshMart",
      github: "https://github.com/NK2552003/FreshMart",
      codepen: "https://github.com/NK2552003/FreshMart",
    },
    progress: "Working on it",
  },
  {
    id: "12",
    title: "Gemini_Chat",
    category: "App Development",
    image: "/Project_Assets/Images/13.png",
    video: "/Project_Assets/Videos/v_1.mp4",
    description: "An application to chat with gemini Ai",
    links: {
      live: "https://github.com/NK2552003/Gemini_Chat_AI",
      github: "https://github.com/NK2552003/Gemini_Chat_AI",
      codepen: "https://github.com/NK2552003/Gemini_Chat_AI",
    },
    progress: "Completed",
  },
  {
    id: "13",
    title: "Dhayana ",
    category: "App Development",
    image: "/Project_Assets/Images/14.png",
    video: "/Project_Assets/Videos/v_1.mp4",
    description: "An Application to note down every task that is pending",
    links: {
      live: "https://github.com/NK2552003/Flutter_ToDo",
      github: "https://github.com/NK2552003/Flutter_ToDo",
      codepen: "https://github.com/NK2552003/Flutter_ToDo",
    },
    progress: "Completed",
  },
  ];


  
  const categories = ['All', 'App Development', 'Web Development'];
  
  const Projects = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [visibleProjects, setVisibleProjects] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
  
    const filteredProjects = projects.filter(project => 
      selectedCategory === 'All' || project.category === selectedCategory
    );
  
    const loadMoreProjects = () => {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleProjects(prev => prev + 3);
        setIsLoading(false);
      }, 1000);
    };
    
    
    useEffect(() => {
      setTimeout(() => {
        const lazyVideos = document.querySelectorAll('.lazy-video');
        console.log('Lazy videos found:', lazyVideos);
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const video = entry.target;
              if (video instanceof HTMLVideoElement && video.dataset.src) {
                video.src = video.dataset.src;
                video.load();
                observer.unobserve(video);
              } else {
                console.error('Invalid video element or missing data-src:', video);
              }
            }
          });
        });
    
        lazyVideos.forEach((video) => observer.observe(video));
    
        return () => {
          lazyVideos.forEach((video) => observer.unobserve(video));
        };
      }, 500); // Small delay
    
    }, [visibleProjects]);
    
    return (
      <div className="min-h-screen relative z-10 bg-[#031412] p-8">
        <div className="flex flex-col items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] text-center text-white relative z-10 p-4 mb-30" id='projects'>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 mt-20">My Projects Showcase</h1>
          <p className="text-sm sm:text-base md:text-lg text-white/80">
            Discover the innovative projects I've worked on, highlighting my skills and passion for development
          </p>
        </div>
  
        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          {categories.map(category => (
                     <button
                     key={category}
                     onClick={() => setSelectedCategory(category)}
                     className={`relative inline-block p-px font-semibold leading-6 text-white bg-white/20 shadow-2xl cursor-pointer rounded-2xl shadow-zinc-900 duration-300 ease-in-out hover:scale-105 active:scale-95 text-xs sm:text-base transition-all ${
                       selectedCategory === category
                         ? 'bg-white text-black'
                         : 'text-white bg-black'
                     }`}
                   >
                     <span
                       className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 via-[#18786E] to-[#29CEB9] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                     ></span>
                   
                     <span className="relative z-10 block px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl bg-[#031412] hover:bg-[#062825] hover:text-[#a0f7eb]">
                       <div className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                         <span className="transition-all duration-500 group-hover:translate-x-1">
                           {category}
                         </span>
                       </div>
                     </span>
                   </button>
          ))}
        </div>
  
        {/* Projects Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.slice(0, visibleProjects).map(project => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-lg bg-[#181818] border border-[#3332328f] h-[300px] transition-transform hover:scale-105"
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector('video');
                if (video) video.play();
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector('video');
                if (video) video.pause();
              }}
            >
              <div className="media-wrapper relative w-full h-full">
                <img
                  src={project.image}
                  alt={project.title}
                  className="image w-full h-full object-cover transition-opacity group-hover:opacity-0"
                  loading="lazy"
                />
                <video
                  data-src={project.video}
                  className="lazy-video absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity"
                  muted
                  loop
                />
                <div className="overlay-blur absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity group-hover:opacity-0"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center">
                <p className="progress absolute top-4 right-4 bg-[#2d2d2d] text-white text-xs px-2 py-1 rounded-lg">
                  {project.progress}
                </p>
                <h3 className="text-6xl font-semibold text-white/50">{project.title}</h3>
                <p className="description text-white/60 mt-2">{project.description}</p>
                <div className="links mt-4 flex gap-2 justify-center">
                  <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                    <button className="button flex items-center gap-2 px-4 py-2 bg-[#181717] text-white rounded-lg transition-all hover:bg-transparent hover:outline hover:outline-white">
                    <i className="bx bx-broadcast text-white text-2xl"></i>
                    </button>
                  </a>
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <button className="button flex items-center gap-2 px-4 py-2 bg-[#181717] text-white rounded-lg transition-all hover:bg-transparent hover:outline hover:outline-white">
                    <i className="bx bxl-github text-white text-2xl"></i>
                    </button>
                  </a>
                  <a href={project.links.codepen} target="_blank" rel="noopener noreferrer">
                    <button className="button flex items-center gap-2 px-4 py-2 bg-[#181717] text-white rounded-lg transition-all hover:bg-transparent hover:outline hover:outline-white">
                    <i className="bx bxl-codepen text-white text-2xl"></i>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Show More Button */}
        {visibleProjects < filteredProjects.length && (
          <div className="flex justify-center mt-8">
          <button
           onClick={loadMoreProjects}
           disabled={isLoading}
                            className="relative inline-block p-px font-semibold leading-6 text-white bg-white/20 shadow-2xl cursor-pointer rounded-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 text-xs sm:text-base"
                        >
                            <span
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 via-[#18786E] to-[#29CEB9] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            ></span>

                            <span className="relative z-10 block px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl bg-[#031412] hover:text-[#a0f7eb]">
                                <div className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                                    <span className="transition-all duration-500 group-hover:translate-x-1">
                                    {isLoading ? 'Loading...' : 'Show More'}
                                    </span>
                                </div>
                            </span>
                        </button>
          </div>
        )}
      </div>
    );
  };
  
  export default Projects;