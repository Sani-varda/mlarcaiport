"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface CitadelCanvasProps {
  scrollProgress: number; // 0 to 1
  dayNightProgress: number; // 0 (Day/Sunset) to 1 (Night)
}

export default function CitadelCanvas({
  scrollProgress,
  dayNightProgress,
}: CitadelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Animation refs to update values in the loop or dynamically
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const moonLightRef = useRef<THREE.DirectionalLight | null>(null);
  const pointLightsRef = useRef<THREE.PointLight[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const columnsRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Volumetric fog (starts warm gold-black)
    const initialFogColor = new THREE.Color("#0c0907");
    scene.fog = new THREE.FogExp2(initialFogColor, 0.04);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 15);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(initialFogColor, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    // Ambient light
    const ambientLight = new THREE.AmbientLight("#111", 0.6);
    scene.add(ambientLight);

    // Sun light (warm gold for day)
    const sunLight = new THREE.DirectionalLight("#fdf2d0", 2.0);
    sunLight.position.set(10, 15, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Moon light (silver-blue for night, initially dimmed)
    const moonLight = new THREE.DirectionalLight("#a6c5ff", 0.0);
    moonLight.position.set(-10, 12, -8);
    moonLight.castShadow = true;
    scene.add(moonLight);
    moonLightRef.current = moonLight;

    // 5. Scenery (Procedural Colonnade Ruins)
    const columnsGroup = new THREE.Group();
    scene.add(columnsGroup);
    columnsRef.current = columnsGroup;

    // Materials
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b2b30,
      roughness: 0.85,
      metalness: 0.1,
    });

    const pillarGeometry = new THREE.CylinderGeometry(0.35, 0.4, 6, 8);
    const capitalGeometry = new THREE.BoxGeometry(1.0, 0.3, 1.0);
    const baseGeometry = new THREE.BoxGeometry(1.1, 0.4, 1.1);

    // Build two parallel rows of columns representing a grand hallway
    const numColumns = 12;
    const spacing = 4.5;
    const rowOffset = 3.0;

    for (let i = 0; i < numColumns; i++) {
      const zPos = -i * spacing + 10;
      
      // Left row columns
      const leftCol = new THREE.Group();
      leftCol.position.set(-rowOffset, 3, zPos);
      
      const pillarL = new THREE.Mesh(pillarGeometry, stoneMaterial);
      pillarL.castShadow = true;
      pillarL.receiveShadow = true;
      
      const capL = new THREE.Mesh(capitalGeometry, stoneMaterial);
      capL.position.y = 3.15;
      capL.castShadow = true;
      
      const baseL = new THREE.Mesh(baseGeometry, stoneMaterial);
      baseL.position.y = -3.1;
      baseL.receiveShadow = true;
      
      leftCol.add(pillarL, capL, baseL);
      columnsGroup.add(leftCol);

      // Right row columns
      const rightCol = new THREE.Group();
      rightCol.position.set(rowOffset, 3, zPos);

      const pillarR = new THREE.Mesh(pillarGeometry, stoneMaterial);
      pillarR.castShadow = true;
      pillarR.receiveShadow = true;
      
      const capR = new THREE.Mesh(capitalGeometry, stoneMaterial);
      capR.position.y = 3.15;
      capR.castShadow = true;

      const baseR = new THREE.Mesh(baseGeometry, stoneMaterial);
      baseR.position.y = -3.1;
      baseR.receiveShadow = true;

      rightCol.add(pillarR, capR, baseR);
      columnsGroup.add(rightCol);

      // Add a small glowing point light under some columns to represent digital energy nodes
      if (i % 2 === 0) {
        const energyNode = new THREE.PointLight("#3b82f6", 1.5, 6);
        energyNode.position.set(-rowOffset, 0.5, zPos);
        scene.add(energyNode);
        pointLightsRef.current.push(energyNode);

        const energyNodeR = new THREE.PointLight("#c5a059", 1.5, 6);
        energyNodeR.position.set(rowOffset, 0.5, zPos);
        scene.add(energyNodeR);
        pointLightsRef.current.push(energyNodeR);
      }
    }

    // Architraves (roof beams spanning the columns)
    const beamGeometry = new THREE.BoxGeometry(0.8, 0.4, spacing * numColumns + 2);
    const beamL = new THREE.Mesh(beamGeometry, stoneMaterial);
    beamL.position.set(-rowOffset, 6.4, -spacing * (numColumns / 2) + 12.25);
    columnsGroup.add(beamL);

    const beamR = new THREE.Mesh(beamGeometry, stoneMaterial);
    beamR.position.set(rowOffset, 6.4, -spacing * (numColumns / 2) + 12.25);
    columnsGroup.add(beamR);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(100, 100, 1, 1);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111113,
      roughness: 0.9,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. Dust Particles System (Sandstorm / Digital Dust)
    const particleCount = 6000;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Scatter in a box around the colonnade
      positions[i] = (Math.random() - 0.5) * 35; // X
      positions[i + 1] = Math.random() * 12; // Y
      positions[i + 2] = (Math.random() - 0.5) * 60; // Z
      speeds[i / 3] = 0.05 + Math.random() * 0.1;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    // Shader-like glowing points material
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xe5c07b,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 7. Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Drift particles forward and down slightly
      const positionsArr = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        // Move particles along Z
        positionsArr[idx + 2] += speeds[i] * 0.15;
        // Swirl in X
        positionsArr[idx] += Math.sin(elapsedTime * 0.5 + i) * 0.005;

        // Reset if out of bounds
        if (positionsArr[idx + 2] > 25) {
          positionsArr[idx + 2] = -35;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Pulse the digital energy lights base
      pointLightsRef.current.forEach((light, index) => {
        light.intensity = (1.2 + Math.sin(elapsedTime * 2 + index) * 0.5) * (1 - dayNightProgress * 0.4);
      });

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // 8. Window Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        containerRef.current?.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose Geometries and Materials
      pillarGeometry.dispose();
      capitalGeometry.dispose();
      baseGeometry.dispose();
      floorGeo.dispose();
      particleGeo.dispose();
      stoneMaterial.dispose();
      floorMat.dispose();
      particleMat.dispose();
    };
  }, []);

  // Update lighting and camera dynamically on progress props change
  useEffect(() => {
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const sunLight = sunLightRef.current;
    const moonLight = moonLightRef.current;
    const particles = particlesRef.current;

    if (!camera || !scene || !renderer) return;

    // 1. Camera Fly-through path based on scroll progress
    // We fly the camera down the colonnade along the Z axis (from 15 to -30)
    const targetZ = 15 - scrollProgress * 48;
    const targetY = 1.8 + Math.sin(scrollProgress * Math.PI) * 0.5; // slight wave in height
    const targetX = Math.sin(scrollProgress * Math.PI * 2) * 0.7; // slight horizontal weave
    
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.1);

    // Look slightly ahead
    const lookAtPos = new THREE.Vector3(0, 1.4, targetZ - 10);
    camera.lookAt(lookAtPos);

    // 2. Day-Night Color Interpolation
    // Day (Sunset): Warm Gold (#0c0907 clear, #c5a059 fog, #fdf2d0 sun)
    // Night: Cool Indigo-Silver (#030407 clear, #0f172a fog, #a6c5ff moon)
    const dayBg = new THREE.Color("#0c0907");
    const nightBg = new THREE.Color("#040508");
    const blendedBg = dayBg.clone().lerp(nightBg, dayNightProgress);

    renderer.setClearColor(blendedBg, 1);
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.copy(blendedBg);
    }

    if (sunLight && moonLight) {
      // Crossfade sun and moon intensities
      sunLight.intensity = (1 - dayNightProgress) * 2.2;
      moonLight.intensity = dayNightProgress * 1.6;
    }

    if (particles && particles.material) {
      const mat = particles.material as THREE.PointsMaterial;
      const dayColor = new THREE.Color("#e5c07b"); // gold particles
      const nightColor = new THREE.Color("#a3c4f3"); // blue-silver particles
      mat.color.copy(dayColor.clone().lerp(nightColor, dayNightProgress));
    }

  }, [scrollProgress, dayNightProgress]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
