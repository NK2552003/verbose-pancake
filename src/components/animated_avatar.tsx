"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface AnimatedAvatarProps {
  isDark: boolean;
}

export default function AnimatedAvatar({ isDark }: AnimatedAvatarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  // Refs for GSAP animations
  const meRef = useRef<SVGGElement>(null);
  const faceRef = useRef<SVGGElement>(null);
  const innerFaceRef = useRef<SVGGElement>(null);
  const hairFrontRef = useRef<SVGPathElement>(null);
  const hairBackRef = useRef<SVGPathElement>(null);
  const eyebrowLeftRef = useRef<SVGPathElement>(null);
  const eyebrowRightRef = useRef<SVGPathElement>(null);
  const earLeftRef = useRef<SVGGElement>(null);
  const earRightRef = useRef<SVGGElement>(null);
  const eyeLeftRef = useRef<SVGPathElement>(null);
  const eyeRightRef = useRef<SVGPathElement>(null);
  const glassesRef = useRef<SVGPathElement>(null);
  const backgroundRef = useRef<SVGPathElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const handRef = useRef<SVGGElement>(null);
  const isMobile = window.innerWidth < 768;


  useEffect(() => {
    // Initialize GSAP timeline for floating animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

    if (meRef.current) {
      gsap.set(meRef.current, { y: 0, rotation: 0, scale: 1 });
      tl.to(meRef.current, {
        y: -8,
        rotation: 0.5,
        scale: 1.01,
        duration: 4,
        ease: "sine.inOut",
      })
        .to(meRef.current, {
          y: 8,
          rotation: -0.5,
          scale: 0.99,
          duration: 4,
          ease: "sine.inOut",
        })
        .to(meRef.current, {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 4,
          ease: "sine.inOut",
        });
    }

    // Glasses glow animation
    if (glassesRef.current) {
      gsap.to(glassesRef.current, {
        opacity: 0.9,
        filter: isDark
          ? "drop-shadow(0 4px 12px rgba(20, 184, 166, 0.6)) drop-shadow(0 0 20px rgba(20, 184, 166, 0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.3)) drop-shadow(0 0 10px rgba(20, 184, 166, 0.2))",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }

    return () => {
      tl.kill();
    };
  }, [isDark]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      const maxDistance = Math.max(rect.width, rect.height) / 2;
      const normalizedX = Math.max(-1, Math.min(1, mouseX / maxDistance));
      const normalizedY = Math.max(-1, Math.min(1, mouseY / maxDistance));

      // Face and inner face movement
      if (faceRef.current) {
        gsap.to(faceRef.current, {
          x: normalizedX * 8,
          y: normalizedY * 6,
          rotation: normalizedX * 2,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      if (innerFaceRef.current) {
        gsap.to(innerFaceRef.current, {
          x: normalizedX * 12,
          y: normalizedY * 8,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // Mouth expressions - Fixed to use actual path changes
      if (mouthRef.current) {
        let newPath = "M98 107.52s6.06 3.62 12 1.59"; // default smile

        if (normalizedY < -0.5) {
          newPath = "M98 108s6 -3 12 -1";
          // surprised/open mouth
        } else if (normalizedY > 0.5) {
          // sad/frown
          newPath = "M95 107c3 4 10 6 18 2";
        }

        mouthRef.current.setAttribute("d", newPath);
      }

      // Ear movement
      if (earRightRef.current) {
        gsap.to(earRightRef.current, {
          x: normalizedX * 2,
          y: normalizedY * 6,
          rotation: -normalizedX * 1.5,
          duration: 0.8,
          ease: "power2.out",
          transformOrigin: "center center",
        });
      }

      if (earLeftRef.current) {
        gsap.to(earLeftRef.current, {
          x: normalizedX * 2,
          y: normalizedY * 6,
          rotation: -normalizedX * 1.5,
          duration: 0.8,
          ease: "power2.out",
          transformOrigin: "center center",
        });
      }

      // Hair movement
      if (hairFrontRef.current) {
        gsap.to(hairFrontRef.current, {
          x: normalizedX * 6,
          y: normalizedY * 4,
          rotation: normalizedX * 1,
          duration: 1.2,
          ease: "power2.out",
          transformOrigin: "center bottom",
        });
      }

      if (hairBackRef.current) {
        gsap.to(hairBackRef.current, {
          x: normalizedX * 5,
          y: normalizedY * 3,
          rotation: normalizedX * 0.5,
          duration: 1.5,
          ease: "power2.out",
          transformOrigin: "center center",
        });
      }

      // Eyebrow movement - Fixed to work properly
      if (eyebrowLeftRef.current && eyebrowRightRef.current) {
        let browY = normalizedY * 3;
        let browRotation = 0;

        // Surprise = raised brows
        if (normalizedY < -0.5) {
          browY = -5;
          browRotation = normalizedX * 2;
        }
        // Sad/angry = lowered brows
        else if (normalizedY > 0.5) {
          browY = -3;
          browRotation = -normalizedX * 3;
        }

        gsap.to(eyebrowLeftRef.current, {
          y: browY,
          rotation: -browRotation,
          duration: 0.5,
          ease: "power2.out",
          transformOrigin: "center center",
        });

        gsap.to(eyebrowRightRef.current, {
          y: browY,
          rotation: browRotation,
          duration: 0.5,
          ease: "power2.out",
          transformOrigin: "center center",
        });
      }

      // Eye tracking
      if (eyeLeftRef.current && eyeRightRef.current) {
        gsap.to([eyeLeftRef.current, eyeRightRef.current], {
          x: normalizedX * 2,
          y: normalizedY * 1.5,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Body elements movement
      const bodyElements = document.querySelectorAll(
        ".neck, .top, .shoulder, .neckShadow"
      );
      if (bodyElements.length > 0) {
        gsap.to(bodyElements, {
          x: normalizedX * 6,
          y: Math.min(0, normalizedY * 4),
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // Shadow movement
      const shadowElements = document.querySelectorAll(".shadow");
      if (shadowElements.length > 0) {
        gsap.to(shadowElements, {
          x: -normalizedX * 4,
          y: -normalizedY * 2,
          duration: 1.0,
          ease: "power2.out",
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (eyeLeftRef.current && eyeRightRef.current) {
        setIsBlinking(true);
        const blinkTl = gsap.timeline();
        blinkTl
          .to([eyeLeftRef.current, eyeRightRef.current], {
            scaleY: 0.1,
            duration: 0.08,
            ease: "power2.inOut",
            transformOrigin: "center center",
          })
          .to([eyeLeftRef.current, eyeRightRef.current], {
            scaleY: 1,
            duration: 0.12,
            ease: "power2.inOut",
            transformOrigin: "center center",
            onComplete: () => setIsBlinking(false),
          });
      }
    }, Math.random() * 4000 + 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const skinColor = "#f3e4cf";
  const skinShadow = "#dbc8af";
  const hairColor = "#4a3629";
  const hairHighlight = "#5b4435";
  const bgColor = "#14b8a6";
  const shirtColor = "#115e59";
  const noseColor = "#e3cdb4";
  const mouthColor = "#c8a896";
  const eyeColor = "#1e293b";

  return (
    <div
      ref={containerRef}
      className="avatar-container relative flex itmes-center justify-center"
    >
      <svg
        ref={svgRef}
        viewBox="0 10 211.73 180"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-75 h-70 md:w-200 md:h-110 relative z-10"
        style={{
          filter: isDark
            ? isMobile
              ? "drop-shadow(0 10px 20px rgba(20,184,166,0.2))"
              : "drop-shadow(0 25px 50px rgba(20,184,166,0.4))"
            : "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
        }}
      >
        <defs>
          <clipPath id="background-clip">
            <path
              d="M39 153.73s31.57 19.71 77.26 15.21 90.18-37.23 90.36-72.33-8.82-80.28-33.59-86.29C136.84-6.57 114.13-5.82 88-2.82S34.73 11.45 16.71 48.24C-1.5 66.64-4.88 125.2 39 153.73z"
              fill="none"
            />
          </clipPath>
          <linearGradient
            id="skin-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={skinColor} />
            <stop offset="100%" stopColor={skinShadow} />
          </linearGradient>
          <linearGradient
            id="hair-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={hairHighlight} />
            <stop offset="100%" stopColor={hairColor} />
          </linearGradient>
          <radialGradient id="eye-gradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor={eyeColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={eyeColor} />
          </radialGradient>
          <linearGradient
            id="glasses-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={
                isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.3)"
              }
            />
            <stop
              offset="50%"
              stopColor={isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)"}
            />
            <stop
              offset="100%"
              stopColor={isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)"}
            />
          </linearGradient>
          <radialGradient id="bg-gradient" cx="50%" cy="50%" r="80%">
            {isMobile ? (
              <>
                <stop
                  offset="0%"
                  stopColor={isDark ? "rgb(20, 184, 166)" : "rgb(16, 185, 129)"}
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor={isDark ? "rgb(20, 184, 166)" : "rgb(16, 185, 129)"}
                  stopOpacity="1"
                />
              </>
            ) : (
              <>
                <stop
                  offset="0%"
                  stopColor={isDark ? "rgb(20, 184, 166)" : "rgb(16, 185, 129)"}
                  stopOpacity="0.5"
                />
                <stop offset="50%" stopColor={bgColor} stopOpacity="0.5" />
                <stop
                  offset="100%"
                  stopColor={isDark ? "rgb(6, 182, 212)" : "rgb(5, 150, 105)"}
                  stopOpacity="0.5"
                />
              </>
            )}
          </radialGradient>
        </defs>

        <path
          ref={backgroundRef}
          className="bg"
          d="M39 153.73s31.57 19.71 77.26 15.21 100.18-37.23 90.36-72.33-10.51-57-35.28-63-50.22 17-76.31 20-60.12-15.88-78.32 2.51S-4.88 125.2 39 153.73z"
          fill="url(#bg-gradient)"
        />

        <g clipPath="url(#background-clip)">
          <g ref={meRef} className="me">
            <g className="body">
              {/* Shadow */}
              <path
                className="shadow"
                d="M130,40c6,4,14,10,18,20s4,16,4,16-3,8-6,12-7,9-7,9-4-7-8-8.5c-4-2.5-7,6-10,7s-12,3-16,2-14-4-18-5c-4-1.5-7-2-9-5s-3-7-2-9,2-6,2-6l-5-3c-3-2.5-3,6-3,6s-4-4-6-6c-2.5-2.5-2-9,1.5-11.5s7-5,13-6.5,16-9,16-9,11-9,22-9S125,43,127,40Z"
                opacity="0.15"
                style={{ isolation: "isolate" }}
              />

              {/* Back Hair */}
              <path
                ref={hairBackRef}
                className="hair-back hair"
                d="M125,40c6,4,14,10,18,20s4,16,4,16-3,8-6,12-7,9-7,9-4-7-8-8.5c-4-2.5-7,6-10,7s-12,3-16,2-14-4-18-5c-4-1.5-7-2-9-5s-3-7-2-9,2-6,2-6l-5-3c-3-2.5-3,6-3,6s-4-4-6-6c-2.5-2.5-2-9,1.5-11.5s7-5,13-6.5,16-9,16-9,11-9,22-9S125,43,127,40Z"
                fill="url(#hair-gradient)"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                }}
              />

              {/* Neck */}
              <path
                className="neck"
                d="M114.26 143.16v-5a9.22 9.22 0 10-18.43 0v5c-15.27 2.84-24.74 15.08-24.74 27.33H139c0-12.24-9.5-24.49-24.74-27.33z"
                fill="url(#skin-gradient)"
              />

              {/* Shirt */}
              <path
                className="top"
                d="M112.61 160c-35.17 0-30.36-35-30.36 20.84h15.35l30-2.14c-.05-55.79 5.17-18.7-29.99-18.7z"
                fill={shirtColor}
                stroke={isDark ? "#0f766e" : "#14b8a6"}
                strokeWidth="1"
                style={{
                  filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
                }}
              />

              {/* Shoulders */}
              <path
                className="shoulder"
                d="M90.82 142.87c-21 1.84-34.37 19.5-34.37 40h34.37z"
                fill={shirtColor}
              />
              <path
                className="shoulder"
                d="M119.23 142.67c20.76 1.85 34 19.6 34 40.2h-34z"
                fill={shirtColor}
              />
            </g>

            {/* Neck shadow */}
            <path
              className="neckShadow"
              d="M95.82 122.36h18.41v14.31s-10.5 5.54-18.41 0z"
              fill={skinShadow}
            />

            <g className="head">
              {/* Ears */}
              <g ref={earLeftRef} className="ear-left ear">
                <path
                  d="M63.52 98.14c1.5-4 5.5-7.14 8.5-7.14s7 3.14 8.5 7.14c1 2.5 1 5 0 7.5-1.5 4-5.5 7.14-8.5 7.14s-7-3.14-8.5-7.14c-1-2.5-1-5 0-7.5z"
                  fill="url(#skin-gradient)"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                  }}
                />
                <path
                  d="M67.54 99.48c2.5-.5 5.5-1 7.5 0a.4.4 0 00.5-.6c-1.5-2.5-6-2-8-1.5a.3.3 0 00-.2.4c.1.2.2.2.2.3z"
                  fill={isDark ? "#d4b8a5" : "#c4a895"}
                />
              </g>

              <g ref={earRightRef} className="ear-right ear">
                <path
                  d="M144.37 98.24c-1.5-4-5.5-7.14-8.5-7.14s-7 3.14-8.5 7.14c-1 2.5-1 5 0 7.5 1.5 4 5.5 7.14 8.5 7.14s7-3.14 8.5-7.14c1-2.5 1-5 0-7.5z"
                  fill="url(#skin-gradient)"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                  }}
                />
                <path
                  d="M139.6 99.48c-2.5-.5-6.5-1-8 1.5a.4.4 0 00.5.6c2-.9 5-.5 7.5 0a.3.3 0 00.2-.4.3.3 0 00-.2-.3z"
                  fill={isDark ? "#d4b8a5" : "#c4a895"}
                />
              </g>

              <g ref={faceRef} className="face">
                {/* Face shape */}
                <rect
                  x="73.99"
                  y="48.26"
                  width="61.54"
                  height="80.49"
                  rx="26.08"
                  transform="rotate(180 104.76 88.5)"
                  fill="url(#skin-gradient)"
                  style={{
                    filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
                  }}
                />

                {/* Face contouring */}
                <ellipse
                  cx="105"
                  cy="95"
                  rx="25"
                  ry="35"
                  fill={skinShadow}
                  opacity="0.3"
                />

                <g ref={innerFaceRef} className="inner-face">
                  {/* Eyebrows */}
                  <path
                    ref={eyebrowRightRef}
                    className="eyebrow-right"
                    d="M120.73 79a9 9 0 00-4-1.22 9.8 9.8 0 00-4.19.87"
                    fill="none"
                    stroke={hairColor}
                    strokeWidth="3.5"
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                      transformOrigin: "center center",
                    }}
                  />
                  <path
                    ref={eyebrowLeftRef}
                    className="eyebrow-left"
                    d="M97.12 79.41a9.53 9.53 0 00-4-1.11 10.58 10.58 0 00-4.2.76"
                    fill="none"
                    stroke={hairColor}
                    strokeWidth="3.5"
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                      transformOrigin: "center center",
                    }}
                  />

                  {/* Mouth */}
                  <path
                    ref={mouthRef}
                    className="mouth"
                    d="M98 107.52s6.06 3.62 12 1.59"
                    fill="none"
                    stroke={mouthColor}
                    strokeWidth="2"
                  />

                  {/* Eyes */}
                  <g className="eyes">
                    <path
                      ref={eyeLeftRef}
                      className="eye-left eye"
                      d="M89.48 87.37c-.07 2.08 1.25 3.8 2.94 3.85s3.1-1.59 3.16-3.67-1.25-3.8-2.94-3.85-3.1 1.59-3.16 3.67z"
                      fill="url(#eye-gradient)"
                      style={{
                        transformOrigin: "center center",
                        filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
                      }}
                    />
                    <path
                      ref={eyeRightRef}
                      className="eye-right eye"
                      d="M113.67 87.37c-.07 2.08 1.25 3.8 2.94 3.85s3.1-1.59 3.16-3.67-1.25-3.8-2.94-3.85-3.1 1.59-3.16 3.67z"
                      fill="url(#eye-gradient)"
                      style={{
                        transformOrigin: "center center",
                        filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
                      }}
                    />
                    {/* Eye highlights */}
                    <circle
                      cx="91"
                      cy="86"
                      r="0.8"
                      fill="white"
                      opacity="0.9"
                    />
                    <circle
                      cx="115"
                      cy="86"
                      r="0.8"
                      fill="white"
                      opacity="0.9"
                    />
                  </g>

                  {/* Nose */}
                  <path
                    className="nose"
                    d="M102.39 101.13s3.09 1.55 5.78 0"
                    fill="none"
                    stroke={noseColor}
                    strokeWidth="1.8"
                    opacity="1"
                    style={{
                      filter: "drop-shadow(0 0.5px 1px rgba(0,0,0,0.1))",
                    }}
                  />

                  {/* Glasses */}
                  <path
                    d="M133.54 81.76c-4.7-1.42-15.29-2.42-19.83-.45-5.82 2.17-3.18 1.57-8.55 1.17-5.36.4-2.74 1-8.55-1.18-7.3-2.55-15.58-.24-22.25.72v2.75c2.46.24 1.26 6.78 3.06 10.32 2.13 7.23 12.69 9.55 18.19 5.49 3.9-2 7.08-10.32 7.21-12.86 0-1.64 4.15-2.57 4.61.24.11 2.53 3.42 10.69 7.28 12.62 5.5 4 16 1.74 18.17-5.49 1.8-3.54 1.69-9.92 2.88-10.32s.74-2.67 0-2.75-1.02-.1-2.22-.26zM97.25 97.49C90.94 104.81 79 101.2 78 92.3c-.7-2.62-1-7.3 1.27-9.12s6.88-1.87 9.23-2c11.14-.26 16.62 5.6 8.75 16.31zm35.12-5.19c-3.71 17.2-27.26 7.42-22.09-7.36 1.87-3.11 9.09-3.84 11.55-3.73 8.07-.04 12.7 1.79 10.54 11.09z"
                    fill="url(#glasses-gradient)"
                  />

                  {/* Glasses reflections */}
                  <ellipse
                    cx="92"
                    cy="88"
                    rx="8"
                    ry="6"
                    fill="rgba(255,255,255,0.2)"
                    opacity="0.6"
                  />
                  <ellipse
                    cx="118"
                    cy="88"
                    rx="8"
                    ry="6"
                    fill="rgba(255,255,255,0.2)"
                    opacity="0.6"
                  />

                  <path
                    ref={glassesRef}
                    className="glasses"
                    d="M133.54 81.76c-4.7-1.42-15.29-2.42-19.83-.45-5.82 2.17-3.18 1.57-8.55 1.17-5.36.4-2.74 1-8.55-1.18-7.3-2.55-15.58-.24-22.25.72v2.75c2.46.24 1.26 6.78 3.06 10.32 2.13 7.23 12.69 9.55 18.19 5.49 3.9-2 7.08-10.32 7.21-12.86 0-1.64 4.15-2.57 4.61.24.11 2.53 3.42 10.69 7.28 12.62 5.5 4 16 1.74 18.17-5.49 1.8-3.54 1.69-9.92 2.88-10.32s.74-2.67 0-2.75-1.02-.1-2.22-.26zM97.25 97.49C90.94 104.81 79 101.2 78 92.3c-.7-2.62-1-7.3 1.27-9.12s6.88-1.87 9.23-2c11.14-.26 16.62 5.6 8.75 16.31zm35.12-5.19c-3.71 17.2-27.26 7.42-22.09-7.36 1.87-3.11 9.09-3.84 11.55-3.73 8.07-.04 12.7 1.79 10.54 11.09z"
                    fill="#000"
                    opacity=".48"
                  />
                </g>

                <g transform="translate(0, 5)">
                  <path
                    ref={hairFrontRef}
                    className="hair-front hair"
                    d="M130,47c-10-5-8.5-8-12-9s-10-12-19.5-5.5-8.5,8-20,9-6,20-4.5,25c0.5,1,4-1.5,8-3,2.5-0.5,5-1.5,6-2.5,1,2,1,4,1.5,8.5,3-2,9-2.5,17.6-2.5s1.5,1,2,5.5c2-0.5,6-1.5,1-2s5,0,2.5,0.5,3.5,1,5,1.5c0-3,0-7,0.5-8.5,0.5-1.5,1.5,1.5,2.5,5,2.5,1.5,5,2.5,7,2.5,0-2.5,1-5,0.5-7,0,0,2.5,3.5,2,6.5,2,3,5,8,8,5s5-15,2-22c-3-7-10-10-19-18s-8-3-20-4Z"
                    fill="url(#hair-gradient)"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>

      <style jsx>{`
        // .avatar-container {
        //   cursor: none;
        // }
        .eye,
        .mouth,
        .hair,
        .face,
        .ear {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
