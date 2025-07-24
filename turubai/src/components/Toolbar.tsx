"use client";

import  fabric  from "fabric";

export default function Toolbar({ canvas }: { canvas: fabric.Canvas }) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => {
          const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: "blue",
            width: 100,
            height: 100,
          });
          canvas.add(rect);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Ajouter Rectangle
      </button>
      {/* Ajoute ici "texte", "image", etc. */}
    </div>
  );
}
