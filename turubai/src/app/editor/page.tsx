"use client";
import React, { useEffect, useRef, useState } from "react";
// import dynamique de fabric dans le useEffect

export default function EditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricRef, setFabricRef] = useState<any>(null); // Fabric.Canvas
  const [fabricNS, setFabricNS] = useState<any>(null); // Namespace Fabric

  useEffect(() => {
    let fabricInstance: any;
    let fabricNSLocal: any;
    let disposed = false;
    import("fabric").then((mod) => {
      if (!canvasRef.current) return;
      // Correction robuste pour tous les cas d'import
      if (mod.Canvas) {
        fabricNSLocal = mod;
      } else if (mod.fabric && mod.fabric.Canvas) {
        fabricNSLocal = mod.fabric;
      } else {
        throw new Error("Impossible de trouver Fabric.Canvas dans l'import dynamique !");
      }
      setFabricNS(fabricNSLocal);
      fabricInstance = new fabricNSLocal.Canvas(canvasRef.current, {
        width: 600,
        height: 800,
        backgroundColor: "#fff",
      });
      setFabricRef(fabricInstance);
    });
    return () => {
      disposed = true;
      if (fabricInstance) fabricInstance.dispose();
    };
  }, []);

  const addText = () => {
    if (fabricRef && fabricNS) {
      const text = new fabricNS.IText("Nouveau texte", {
        left: 100,
        top: 100,
        fontSize: 24,
        fill: "#222"
      });
      fabricRef.add(text).setActiveObject(text);
    }
  };

  const addRect = () => {
    if (fabricRef && fabricNS) {
      const rect = new fabricNS.Rect({
        left: 150,
        top: 150,
        fill: "#4F46E5",
        width: 120,
        height: 80,
        rx: 8,
        ry: 8,
      });
      fabricRef.add(rect).setActiveObject(rect);
    }
  };

  const addCircle = () => {
    if (fabricRef && fabricNS) {
      const circle = new fabricNS.Circle({
        left: 250,
        top: 250,
        fill: "#22D3EE",
        radius: 40,
      });
      fabricRef.add(circle).setActiveObject(circle);
    }
  };

  // Pour rafraîchir la toolbar lors de la sélection
  const [selected, setSelected] = React.useState<any>(null);

  useEffect(() => {
    if (!fabricRef) return;
    const canvas = fabricRef;
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
  }, [fabricRef]);

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

