"use client";

import { useEffect, useRef, useState } from "react";

interface ImageSequenceProps {
  scrollProgress: number; // 0 to 1
  totalFrames?: number; // Total number of images in sequence
  startFrame?: number; // Starting index (e.g. 0 or 1)
  folder?: string; // Path inside public/
  prefix?: string; // Prefix of file names
  digits?: number; // Zero padding (e.g. 3 digits = 001)
  extension?: string; // File extension
  isActive?: boolean; // Controls whether this canvas draws
}

export default function ImageSequenceCanvas({
  scrollProgress,
  totalFrames = 60,
  startFrame = 0,
  folder = "/images/sequence",
  prefix = "frame_",
  digits = 3,
  extension = "png",
  isActive = true,
}: ImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const requestRef = useRef<number | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);

  // Helper to format frame numbers (e.g., 1 -> "001")
  const formatIndex = (index: number) => {
    return String(index).padStart(digits, "0");
  };

  // Preload images on mount
  useEffect(() => {
    imagesRef.current = [];
    let loaded = 0;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const frameNum = startFrame + i;
      const filename = `${prefix}${formatIndex(frameNum)}.${extension}`;
      img.src = `${folder}/${filename}`;
      img.onload = () => {
        loaded++;
        if (loaded === totalFrames || loaded % 15 === 0) {
          setLoadedCount(loaded);
        }
      };
      img.onerror = () => {
        console.error("Failed to load image frame:", img.src);
      };
      imagesRef.current.push(img);
    }
  }, [totalFrames, startFrame, folder, prefix, digits, extension]);

  // Draw active frame to Canvas
  useEffect(() => {
    if (!isActive) return;

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    const drawFrame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const frameIndex = Math.min(
        Math.max(Math.floor(scrollProgress * (totalFrames - 1)), 0),
        totalFrames - 1
      );

      // Find the active image, fall back to nearest loaded frame if current isn't loaded
      let activeImage = imagesRef.current[frameIndex];
      if (!activeImage || !activeImage.complete || activeImage.naturalWidth === 0) {
        let found = false;
        // Search outwards
        for (let dist = 1; dist < totalFrames; dist++) {
          const prevIdx = frameIndex - dist;
          const nextIdx = frameIndex + dist;
          if (prevIdx >= 0) {
            const img = imagesRef.current[prevIdx];
            if (img && img.complete && img.naturalWidth > 0) {
              activeImage = img;
              found = true;
              break;
            }
          }
          if (nextIdx < totalFrames) {
            const img = imagesRef.current[nextIdx];
            if (img && img.complete && img.naturalWidth > 0) {
              activeImage = img;
              found = true;
              break;
            }
          }
        }
      }

      if (activeImage && activeImage.complete && activeImage.naturalWidth > 0) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Object fit Cover logic
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = activeImage.naturalWidth;
        const imgHeight = activeImage.naturalHeight;

        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;

        if (imgRatio > canvasRatio) {
          drawWidth = canvasHeight * imgRatio;
        } else {
          drawHeight = canvasWidth / imgRatio;
        }

        // Scale image to 100% of calculated size (no border)
        const scale = 1.0;
        const finalWidth = drawWidth * scale;
        const finalHeight = drawHeight * scale;

        // Centering math
        const offsetX = (canvasWidth - finalWidth) / 2;
        const offsetY = (canvasHeight - finalHeight) / 2;

        ctx.drawImage(activeImage, offsetX, offsetY, finalWidth, finalHeight);
      }
    };

    requestRef.current = requestAnimationFrame(drawFrame);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [scrollProgress, loadedCount, totalFrames, isActive]);

  // Resize handler to maintain full-screen aspect
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Force redraw
      setLoadedCount(prev => prev + 0.00001);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none bg-white" style={{ zIndex: 1 }}>
      <canvas ref={canvasRef} className="w-full h-full block opacity-100" />
    </div>
  );
}
