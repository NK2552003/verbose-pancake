"use client";

import { useEffect, useState } from "react";

const SplashScreen = ({ onLoaded }: { onLoaded: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 25 : 100));
    }, 300);

    // When progress reaches 100%, trigger the fade-out transition
    if (progress === 100) {
      clearInterval(interval);
      setIsVisible(false);
      setTimeout(() => onLoaded(), 500); // Wait for the transition to complete before calling onLoaded
    }

    return () => clearInterval(interval);
  }, [progress, onLoaded]);
  
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[#031412] transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center">
             <svg
                width="105"
                height="105"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4"
              >
                <g>
                  <title>Layer 1</title>
                  {/* Set stroke color same as background */}
                  <rect stroke="#031412" id="svg_4" height="105" width="105" y="0" x="0" fill="#031412" />
                  <g fill="none" stroke="#828384" strokeWidth="0.2" id="svg_1">
                    <path
                      fill="#ffffff"
                      d="m19.07469,35.31166q0.01,-0.87 0.62,-0.24l40.32,41.71a0.88,0.88 0 0 0 1.51,-0.61l0,-11.83a0.95,0.94 22.2 0 0 -0.29,-0.68l-41.35,-41.79q-0.37,-0.37 -0.88,-0.37l-15.47,0a0.66,0.64 20.5 0 0 -0.48,0.21q-1,1.06 0.49,1.17q7.17,0.55 10.96,6.42a1.64,1.63 28.4 0 1 0.27,0.9q0,21.43 -0.01,42.89c0,5.57 -1.11,9.73 -7.68,8.82q-0.39,-0.05 -0.64,0.06q-0.67,0.32 -0.28,1.05a0.94,0.94 0 0 0 0.82,0.48l20.29,0a0.46,0.46 0 0 0 0.44,-0.32l0.15,-0.46q0.18,-0.54 -0.39,-0.57c-3.72,-0.18 -8.25,-0.69 -8.31,-4.65q-0.29,-21.33 -0.09,-42.19"
                      vectorEffect="non-scaling-stroke"
                      id="svg_2"
                    />
                    <path
                      fill="#ffffff"
                      d="m53.58469,50.92166a0.44,0.44 0 0 1 -0.76,-0.3q-0.24,-11.48 0.28,-22.8c0.19,-4.1 4.5,-4.94 7.73,-4.85a0.67,0.67 0 0 0 0.69,-0.69l0,-0.35a0.42,0.42 0 0 0 -0.42,-0.43q-12.58,-0.01 -25.27,0.01q-0.26,0 -0.46,0.13q-0.32,0.2 -0.39,0.35a0.77,0.76 10.3 0 0 0.75,1.08c9.03,-0.61 8.4,4.83 8.52,12q0.07,4.07 -0.16,8.23q-0.03,0.48 0.32,0.82q15.71,15.41 31.27,30.97q1.44,1.44 2.12,3.48a1.34,1.33 -34.9 0 1 -0.23,1.26q-1.69,2.15 -4.52,2.17a0.54,0.54 0 0 0 -0.52,0.64q0.15,0.85 0.99,0.85q13.97,0.03 27.94,-0.21q1.39,-0.02 0.59,-1.02a0.72,0.71 75.4 0 0 -0.4,-0.24q-7.72,-1.48 -13.33,-6.8q-13.38,-12.66 -26.14,-25.74q-0.33,-0.34 0,-0.68c8.09,-8.48 19.77,-23.35 31.35,-26.12q0.89,-0.21 0.25,-0.95a0.66,0.63 -18.9 0 0 -0.5,-0.23l-21.44,0q-0.19,0 -0.33,0.14l-0.29,0.29a0.65,0.65 0 0 0 0.55,1.1q2.52,-0.35 4.55,1.1q0.45,0.32 0.48,0.86c0.31,5.84 -18.73,21.31 -23.22,25.93"
                      vectorEffect="non-scaling-stroke"
                      id="svg_3"
                    />
                  </g>
                </g>
              </svg>


        {/* Progress Indicator */}
        <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
