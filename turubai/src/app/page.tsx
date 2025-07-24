"use client";

import { useEffect, useRef, useState } from "react";
import  fabric  from "fabric";
import Toolbar from "../components/Toolbar";

export default function EditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 900,
      height: 600,
      backgroundColor: "#fff",
    });
    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Toolbar à gauche */}
      <aside className="w-56 border-r border-gray-300 p-4 bg-gray-100">
        <Toolbar canvas={canvas} />
      </aside>

      {/* Zone Canvas */}
      <main className="flex-grow flex justify-center items-center bg-gray-300">
        <canvas ref={canvasRef} />
      </main>
    </div>
  );
}
