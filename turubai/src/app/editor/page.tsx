"use client";
import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

export default function EditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 800,
        backgroundColor: "#fff",
      });
    }
    return () => {
      fabricRef.current?.dispose();
    };
  }, []);

  const addText = () => {
    if (fabricRef.current) {
      const text = new fabric.IText("Nouveau texte", {
        left: 100,
        top: 100,
        fontSize: 24,
        fill: "#222"
      });
      fabricRef.current.add(text).setActiveObject(text);
    }
  };

  const addRect = () => {
    if (fabricRef.current) {
      const rect = new fabric.Rect({
        left: 150,
        top: 150,
        fill: "#4F46E5",
        width: 120,
        height: 80,
        rx: 8,
        ry: 8,
      });
      fabricRef.current.add(rect).setActiveObject(rect);
    }
  };

  const addCircle = () => {
    if (fabricRef.current) {
      const circle = new fabric.Circle({
        left: 250,
        top: 250,
        fill: "#22D3EE",
        radius: 40,
      });
      fabricRef.current.add(circle).setActiveObject(circle);
    }
  };

  // Pour rafraîchir la toolbar lors de la sélection
  const [selected, setSelected] = React.useState<fabric.Object | null>(null);

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const handleSelection = () => {
      setSelected(canvas.getActiveObject() || null);
    };
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setSelected(null));
    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared");
    };
  }, []);

  // Suppression de l'objet sélectionné
  const deleteSelected = () => {
    if (fabricRef.current && selected) {
      fabricRef.current.remove(selected);
      fabricRef.current.discardActiveObject();
      fabricRef.current.requestRenderAll();
      setSelected(null);
    }
  };

  // Centrer l'objet sélectionné
  const centerSelected = () => {
    if (fabricRef.current && selected) {
      const canvas = fabricRef.current;
      selected.set({
        left: (canvas.getWidth()! - selected.getScaledWidth()) / 2,
        top: (canvas.getHeight()! - selected.getScaledHeight()) / 2,
      });
      selected.setCoords();
      canvas.requestRenderAll();
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Toolbar latérale */}
      <div style={{
        width: 140,
        background: "#F1F5F9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 0"
      }}>
        <button onClick={addText} style={{ margin: "0.5rem 0" }}>Ajouter texte</button>
        <button onClick={addRect} style={{ margin: "0.5rem 0" }}>Ajouter rectangle</button>
        <button onClick={addCircle} style={{ margin: "0.5rem 0" }}>Ajouter cercle</button>
        <hr style={{ width: "80%", margin: "1rem 0" }} />
        <button onClick={deleteSelected} disabled={!selected} style={{ margin: "0.5rem 0", color: !selected ? '#aaa' : '#ef4444' }}>Supprimer</button>
        <button onClick={centerSelected} disabled={!selected} style={{ margin: "0.5rem 0" }}>Centrer</button>
      </div>
      {/* Zone de canvas */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: "#E0E7EF" }}>
        <canvas ref={canvasRef} width={600} height={800} style={{ border: "2px solid #64748B", background: "#fff" }} />
      </div>
    </div>
  );
}

