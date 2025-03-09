"use client";

import FluidShader from "../components/fluid-shader";
import { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';
import GridLayout from "@/components/AdditionalActivity";
import ProjectsCP from "@/components/codepen";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import GitHubStats from "@/components/GithubStats";
import Projects from "@/components/projects";
import TerminalSec from "@/components/Terminal";
import Timeline from "@/components/timeline";

export default function Home() {
  return (
    <main className="transition-opacity duration-1000 ease-in-out">
                        <FluidShader />
                        <TerminalSec/>
                        <GitHubStats/>
                        <GridLayout/>
                        <Timeline/>
                        <Projects/>
                        <ProjectsCP/>
                        <ContactSection/>
                        <Footer/>
        </main>
  );
}