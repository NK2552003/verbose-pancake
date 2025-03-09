import React, { useEffect } from 'react';

const Cards = () => {

  
  // Load YouTube IFrame API script

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize YouTube player after the script is loaded
    (window as any).onYouTubeIframeAPIReady = () => {
      new (window as any).YT.Player('youtube-audio-player', {
        height: '100%',
        width: '100%',
        videoId: 'RBumgq5yVrA', // Video ID for the specific music track
        playerVars: {
          autoplay: 0, // Do not autoplay
          controls: 1, // Show controls
          modestbranding: 1, // Hide YouTube logo
          showinfo: 0, // Hide video title
          rel: 0, // Do not show related videos
          fs: 0, // Hide fullscreen button
          iv_load_policy: 3, // Hide annotations
          disablekb: 1, // Disable keyboard controls
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(50); // Set volume to 50%
          },
        },
      });
    };
  }, []);

  return (
    <div className=" flex items-center justify-center py-6 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Music Card */}
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 shadow-lg border-[0.5px] border-white/50 flex flex-col h-full">
          <h2 className="text-xl font-bold text-white mb-4">Music</h2>
          <div className="flex-1">
            <div id="youtube-audio-player" className="w-full h-full rounded-lg"></div>
          </div>
          <p className="text-gray-300 mt-4">
            My Favourite Music of all the time
          </p>
        </div>

        {/* Books Card */}
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 shadow-lg border-[0.5px] border-white/50">
          <h2 className="text-xl font-bold text-white mb-4">Life-Changing Books for me </h2>
          <div className="space-y-4">
            {/* Book 1: Atomic Habits */}
            <div className="flex items-center space-x-4">
              <img
                src="https://m.media-amazon.com/images/I/51B7kuFwQFL._SY445_SX342_.jpg"
                alt="Atomic Habits"
                className="w-16 h-24 object-cover rounded-lg"
              />
              <div>
                <p className="text-gray-300 font-semibold">Atomic Habits</p>
                <p className="text-gray-400 text-sm">James Clear</p>
              </div>
            </div>

            {/* Book 2: The Alchemist */}
            <div className="flex items-center space-x-4">
              <img
                src="https://m.media-amazon.com/images/I/51Z0nLAfLmL._SY445_SX342_.jpg"
                alt="The Alchemist"
                className="w-16 h-24 object-cover rounded-lg"
              />
              <div>
                <p className="text-gray-300 font-semibold">The Alchemist</p>
                <p className="text-gray-400 text-sm">Paulo Coelho</p>
              </div>
            </div>
          </div>
          <p className="text-gray-300 mt-4">
            These books transformed my life so can yours.
          </p>
        </div>

        {/* Movies Card */}
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 shadow-lg border-[0.5px] border-white/50">
          <h2 className="text-xl font-bold text-white mb-4">Life-Changing Movie for me</h2>
          <img
            src="https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg"
            alt="The Shawshank Redemption"
            className="w-full h-48 object-cover rounded-lg"
          />
          <p className="text-gray-300 mt-4">
            The Shawshank Redemption - A story of hope and perseverance.
          </p>
        </div>

        
      </div>
    </div>
  );
};

export default Cards;