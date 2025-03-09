import React, { useRef, useState, useEffect } from 'react';

const Cards: React.FC = () => {
  // Path to your local audio file
  const audioFile: string = '/Audio/Aj.m4a';
  // Path to your album art image
  const albumArt: string = '/Audio/poster.png';
  // Title of the audio track
  const audioTitle: string = 'Aj Kal Ve';

  // State for play/pause
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // State for current time and duration
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  // Ref for the audio element
  const audioRef = useRef<HTMLAudioElement>(null);
  // Ref for the container element
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Lazy load the audio source if not already loaded
        if (!audioRef.current.src) {
          audioRef.current.src = audioFile;
          audioRef.current.load(); // Load the audio file
        }
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Function to update the current time and duration
  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // Function to format time (mm:ss)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Function to handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = clickPosition * duration;
    }
  };

  // Effect to add event listener for time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateTime);
    }
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateTime);
      }
    };
  }, []);

  // Effect to lazy load the audio file when the component is in the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && audioRef.current && !audioRef.current.src) {
            // Load the audio file when the component is in the viewport
            audioRef.current.src = audioFile;
            audioRef.current.load();
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [audioFile]);

  return (
    <div className="flex items-center justify-center py-6" ref={containerRef}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Music Card */}
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 shadow-lg border-[0.5px] border-white/50 flex flex-col h-full">
          <div className="flex-1">
            <div className="flex flex-col items-center space-y-4">
              <img
                src={albumArt}
                alt="Album Art"
                className="w-48 h-48 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute flex space-x-6 top-[44.5%]">
                <button
                  onClick={togglePlayPause}
                  className="text-white rounded-full bg-teal-900 hover:bg-teal-600"
                >
                  {isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="text-center">
                <p className="text-gray-300 font-semibold text-lg">{audioTitle}</p>
                <p className="text-gray-400 text-sm">Sidhu Moose Wala</p>
              </div>
              <div className="w-full">
                <div
                  className="relative pt-1 cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div
                      style={{
                        width: `${(currentTime / duration) * 100}%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-300 mt-4 text-center">
            My Favourite Music of all the time
          </p>
        </div>

        {/* Books Card */}
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 shadow-lg border-[0.5px] border-white/50">
          <h2 className="text-xl font-bold text-white mb-4">Life-Changing Books for me</h2>
          <div className="space-y-4">
            {/* Book 1: Atomic Habits */}
            <div className="flex items-center space-x-4">
              <img
                src="https://m.media-amazon.com/images/I/51B7kuFwQFL._SY445_SX342_.jpg"
                alt="Atomic Habits"
                className="w-[50%] h-[100%] object-cover rounded-lg"
              />
              <img
                src="https://m.media-amazon.com/images/I/51Z0nLAfLmL._SY445_SX342_.jpg"
                alt="The Alchemist"
                className="w-[50%] h-[100%] object-cover rounded-lg"
              />
            </div>
          </div>
          <p className="text-gray-300 mt-4 text-center">
            These books transformed my life so can yours.
          </p>
        </div>

        {/* Movies Card */}
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 shadow-lg border-[0.5px] border-white/50">
          <h2 className="text-xl font-bold text-white mb-4">Life-Changing Movies for Me</h2>
          <div className="flex space-x-4">
            {/* Movie 1: The Shawshank Redemption */}
            <div className="flex-1">
              <img
                src="https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg"
                alt="The Shawshank Redemption"
                className="w-full h-60 object-cover rounded-lg"
              />
              <p className="text-gray-300 mt-2">
                The Shawshank Redemption - A story of hope and perseverance.
              </p>
            </div>

            {/* Movie 2: The Godfather */}
            <div className="flex-1">
              <img
                src="https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg"
                alt="The Godfather"
                className="w-full h-60 object-cover rounded-lg"
              />
              <p className="text-gray-300 mt-2">
                The Godfather - A tale of power, family, and betrayal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default Cards;