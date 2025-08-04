import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ThreeJSPhotographyGallery = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshesRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sample image URLs - replace with your actual images
  const imageUrls = [
    '1.jpeg',
    '2.jpeg',
    '3.jpeg',
    '4.jpeg',
    '5.jpeg',
    '6.jpeg'
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Load textures and create image planes
    const loader = new THREE.TextureLoader();
    const meshes = [];

    imageUrls.forEach((url, index) => {
      loader.load(url, (texture) => {
        // Create geometry for the image plane
        const geometry = new THREE.PlaneGeometry(2, 1.5);
        const material = new THREE.MeshLambertMaterial({ 
          map: texture,
          side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position images in a circular arrangement
        const angle = (index / imageUrls.length) * Math.PI * 2;
        const radius = 4;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;
        mesh.position.y = (Math.random() - 0.5) * 2;
        
        // Rotate to face center
        mesh.lookAt(0, mesh.position.y, 0);
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        scene.add(mesh);
        meshes.push(mesh);
        
        if (meshes.length === imageUrls.length) {
          setIsLoaded(true);
        }
      });
    });

    meshesRef.current = meshes;

    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate camera around the scene based on mouse
      const time = Date.now() * 0.0005;
      camera.position.x = Math.cos(time + mouse.x * 0.5) * 8;
      camera.position.z = Math.sin(time + mouse.x * 0.5) * 8;
      camera.position.y = mouse.y * 2;
      camera.lookAt(0, 0, 0);

      // Gently rotate each image
      meshes.forEach((mesh, index) => {
        if (mesh) {
          mesh.rotation.y += 0.001;
          mesh.position.y += Math.sin(time * 2 + index) * 0.002;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      meshes.forEach(mesh => {
        if (mesh) {
          mesh.geometry.dispose();
          mesh.material.dispose();
          if (mesh.material.map) mesh.material.map.dispose();
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden">
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-white text-xl">Loading Gallery...</div>
        </div>
      )}
      
      {/* Three.js canvas container */}
      <div ref={mountRef} className="w-full h-full" />
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-2">Photography Gallery</h1>
          <p className="text-gray-300">Move your mouse to explore the 3D space</p>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
        <div className="text-white text-center">
          <p className="text-sm text-gray-400">
            Mouse movement controls camera • Images rotate automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeJSPhotographyGallery;