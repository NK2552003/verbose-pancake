"use client";

import FluidShader from "../components/fluid-shader";
import { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaded = () => {
    setIsLoading(false); // This will be called when the SplashScreen finishes loading
  };

  return (
    <div>
      {isLoading ? (
        <SplashScreen onLoaded={handleLoaded} />
      ) : (
        <main className="min-h-screen">
          <FluidShader />
        </main>
      )}
    </div>
  );
}