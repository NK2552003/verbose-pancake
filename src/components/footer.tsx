import React, { Suspense, useEffect, useState } from 'react';

const Footer: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <footer className="bg-[#02100e] bg-opacity-50 text-white py-5 px-2.5 relative z-10">
      <div className="flex flex-wrap justify-evenly max-w-full mx-auto">
        {/* About Section */}
        <div className="flex-1 min-w-[250px] my-2.5 mx-5 py-2.5 px-5">
          <h2 className="text-lg mb-2.5 border-b-2 border-white pb-1.25">About Me</h2>
          <p className="text-sm leading-6 text-gray-400">
            Passionate developer creating stunning web experiences. Let's build something amazing together!
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="flex-1 min-w-[250px] my-2.5 mx-5 py-2.5 px-5">
          <h2 className="text-lg mb-2.5 border-b-2 border-white pb-1.25">Quick Links</h2>
          <ul className="text-sm leading-6 text-gray-400">
            <li><a href="#home" title="about" className="hover:text-white hover:underline">Home</a></li>
            <li><a href="#about" title="skills" className="hover:text-white hover:underline">About</a></li>
            <li><a href="#quali" title="jobs" className="hover:text-white hover:underline">Qualifications</a></li>
            <li><a href="#projects" title="contact" className="hover:text-white hover:underline">Projects</a></li>
            <li><a href="#contact" title="contact" className="hover:text-white hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="flex-1 min-w-[250px] my-2.5 mx-5 py-2.5 px-5">
          <h2 className="text-lg mb-2.5 border-b-2 border-white pb-1.25">Contact</h2>
          <p className="text-sm leading-6 text-gray-400">
            Email: <a href="mailto:nk2552003@gmail.com" className="text-gray-400 hover:text-white hover:underline">nk2552003@gmail.com</a>
          </p>
          <div className="mt-3.75">
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
          </div>
        </div>
      </div>
      <div className="text-center mt-5 text-sm text-gray-400">
        Made with <i className="bx bx-heart"></i> by Nitish Kumar
      </div>
    </footer>
  );
};

export default Footer;