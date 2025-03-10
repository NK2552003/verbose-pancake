import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  embedUrl: string;
}

const ProjectsCP = () => {
  const [codepenProjects, setCodepenProjects] = useState<Project[]>([]);
  const [visibleProjects, setVisibleProjects] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const codepenProjectsData = [
    { id: "MYgpywe", title: "Project 1" },
    { id: "EaYdRVB", title: "Project 2" },
    { id: "xbKpwwZ", title: "Project 3" },
    { id: "VYwLJNW", title: "Project 4" },
    { id: "JoPyyxj", title: "Project 5" },
    { id: "gbYyXmM", title: "Project 6" },
    { id: "KwKWPoB", title: "Project 7" },
    { id: "ogvdGVm", title: "Project 8" },
    { id: "VwoLgrj", title: "Project 9" },
    { id: "MWdKBpa", title: "Project 10" },
    { id: "LEPQZeR", title: "Project 11" },
    { id: "ExqvZey", title: "Project 12" },
  ];

  useEffect(() => {
    const fetchCodepenProjects = async () => {
      try {
        const projects: Project[] = codepenProjectsData.map((project) => ({
          id: project.id,
          title: project.title,
          embedUrl: `https://codepen.io/username/embed/${project.id}?default-tab=result&editable=true&theme-id=dark`,
        }));

        setCodepenProjects(projects);
      } catch (error) {
        console.error("Error fetching CodePen projects:", error);
        setError("Failed to fetch projects. Please try again later.");
      }
    };

    fetchCodepenProjects();
  }, []);

  useEffect(() => {
    // Ensure this code only runs on the client side
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setVisibleProjects(6); // Desktop screen
        } else {
          setVisibleProjects(3); // Mobile or tablet screen
        }
      };

      // Set initial value on mount
      handleResize();

      // Add event listener for window resize
      window.addEventListener("resize", handleResize);

      // Cleanup event listener on unmount
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const loadMoreProjects = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProjects((prev) => prev + 3);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="relative z-10 bg-[#031412] p-8">
      <div className="pl-8 text-white/80 relative z-10 p-4 mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 mt-10">
          CodePens
        </h1>
      </div>
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {codepenProjects.slice(0, visibleProjects).map((project) => (
          <div
            key={project.id}
            className="group relative overflow-hidden rounded-lg bg-[#181818] border border-[#3332328f] h-[300px] transition-transform hover:scale-105"
            style={{ zoom: 1 }}
          >
            {/* Container for scaling the iframe */}
            <div
              className="w-full h-full transform scale-50 origin-top-left"
              style={{
                width: "200%", // Double the width to compensate for scaling
                height: "200%", // Double the height to compensate for scaling
              }}
            >
              <iframe
                title={project.title}
                src={project.embedUrl}
                className="w-full h-full"
                style={{ border: "none" }}
                allowFullScreen
              />
            </div>
          </div>
        ))}
      </div>

      {visibleProjects < codepenProjects.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreProjects}
            disabled={isLoading}
            className="relative inline-block p-px font-semibold leading-6 text-white bg-white/20 shadow-2xl cursor-pointer rounded-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 text-xs sm:text-base"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 via-[#18786E] to-[#29CEB9] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            <span className="relative z-10 block px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl bg-[#031412] hover:text-[#a0f7eb]">
              <div className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                <span className="transition-all duration-500 group-hover:translate-x-1">
                  {isLoading ? "Loading..." : "Show More"}
                </span>
              </div>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsCP;