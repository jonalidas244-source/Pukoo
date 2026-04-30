import { useState, useEffect } from "react";
import { Plus, AppWindow, LayoutGrid, Sparkles } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { Widget } from "./types";
import { WidgetCard } from "./components/WidgetCard";
import { Customizer } from "./components/Customizer";

export default function App() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | undefined>(undefined);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("punched_widgets");
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved widgets", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("punched_widgets", JSON.stringify(widgets));
  }, [widgets]);

  // Handle Auto Reset
  useEffect(() => {
    const checkResets = () => {
      const now = Date.now();
      const today = new Date();
      let hasChanges = false;

      const updatedWidgets = widgets.map((w) => {
        if (w.resetInterval === "manual") return w;

        const lastReset = new Date(w.lastResetAt);
        let shouldReset = false;

        const diffMs = now - w.lastResetAt;

        if (w.resetInterval === "12h" && diffMs >= 12 * 60 * 60 * 1000) shouldReset = true;
        if (w.resetInterval === "24h" && diffMs >= 24 * 60 * 60 * 1000) shouldReset = true;
        
        if (w.resetInterval === "weekly") {
          // Simplistic week start check (Sunday)
          const weekStart = new Date(today);
          weekStart.setHours(0, 0, 0, 0);
          weekStart.setDate(today.getDate() - today.getDay());
          if (w.lastResetAt < weekStart.getTime()) shouldReset = true;
        }

        if (w.resetInterval === "monthly") {
          if (today.getMonth() !== lastReset.getMonth() || today.getFullYear() !== lastReset.getFullYear()) {
            shouldReset = true;
          }
        }

        if (shouldReset) {
          hasChanges = true;
          return { ...w, punches: Array(w.totalSlots || 31).fill(false), lastResetAt: now };
        }
        return w;
      });

      if (hasChanges) {
        setWidgets(updatedWidgets);
      }
    };

    checkResets();
    const interval = setInterval(checkResets, 60000);
    return () => clearInterval(interval);
  }, [widgets]);

  const handlePunch = (widgetId: string, punchIndex: number) => {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id === widgetId) {
          const newPunches = [...w.punches];
          newPunches[punchIndex] = !newPunches[punchIndex];
          return { ...w, punches: newPunches };
        }
        return w;
      })
    );
  };

  const handleSaveWidget = (updatedData: Partial<Widget>) => {
    if (editingWidget) {
      setWidgets((prev) =>
        prev.map((w) => (w.id === editingWidget.id ? ({ ...w, ...updatedData } as Widget) : w))
      );
    } else {
      const newWidget: Widget = {
        id: crypto.randomUUID(),
        title: updatedData.title || "Untitled",
        description: updatedData.description || "",
        color: updatedData.color || "#ffffff",
        textColor: updatedData.textColor || "#000000",
        font: updatedData.font || "sans",
        backgroundImage: updatedData.backgroundImage,
        bgZoom: updatedData.bgZoom || 100,
        bgOffset: updatedData.bgOffset || { x: 50, y: 50 },
        punchIcon: updatedData.punchIcon || "check",
        punchColor: updatedData.punchColor,
        punchShape: updatedData.punchShape || "rounded",
        gridColumns: updatedData.gridColumns || 7,
        resetInterval: updatedData.resetInterval || "manual",
        lastResetAt: updatedData.lastResetAt || Date.now(),
        totalSlots: updatedData.totalSlots || 31,
        punches: updatedData.punches || Array(updatedData.totalSlots || 31).fill(false),
        createdAt: Date.now(),
        goalType: "habit",
      };
      setWidgets((prev) => [newWidget, ...prev]);
    }
    setIsCustomizing(false);
    setEditingWidget(undefined);
  };

  const handleDeleteWidget = (id: string) => {
    if (confirm("Are you sure you want to delete this widget?")) {
      setWidgets((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const handleResetWidget = (id: string) => {
    if (confirm("Reset all punches for this widget?")) {
      setWidgets((prev) =>
        prev.map((w) => (w.id === id ? { ...w, punches: Array(w.totalSlots || 31).fill(false), lastResetAt: Date.now() } : w))
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#141414] selection:bg-black selection:text-white font-sans overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#F0F0F0]/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
              <AppWindow size={20} />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none">WidgetPunch</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Your Daily Goal Board</p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingWidget(undefined);
              setIsCustomizing(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-black/10"
            id="add-widget-top-btn"
          >
            <Plus size={18} />
            New Widget
          </button>
        </div>
      </header>

      <main className="pt-32 pb-40 px-6 max-w-7xl mx-auto">
        {widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6 text-gray-300">
              <LayoutGrid size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-2">No widgets yet</h2>
            <p className="text-gray-500 max-w-xs mb-8">
              Start by creating your first daily goal widget. Customize the style to match your vibe.
            </p>
            <button
              onClick={() => setIsCustomizing(true)}
              className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-black rounded-3xl font-bold hover:bg-black hover:text-white transition-all shadow-xl"
              id="empty-state-add-btn"
            >
              <Sparkles className="text-orange-500" size={20} />
              Craft Your First Widget
            </button>
          </div>
        ) : (
          <Reorder.Group 
            axis="y" 
            values={widgets} 
            onReorder={setWidgets}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {widgets.map((w) => (
                <Reorder.Item 
                  key={w.id} 
                  value={w}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="cursor-default"
                  dragListener={true}
                >
                  <WidgetCard
                    widget={w}
                    onPunch={(idx) => handlePunch(w.id, idx)}
                    onDelete={() => handleDeleteWidget(w.id)}
                    onEdit={() => {
                      setEditingWidget(w);
                      setIsCustomizing(true);
                    }}
                    onReset={() => handleResetWidget(w.id)}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </main>

      {/* Floating UI Overlay for Customizer */}
      <AnimatePresence>
        {isCustomizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Customizer
              initialWidget={editingWidget || {}}
              onSave={handleSaveWidget}
              onClose={() => {
                setIsCustomizing(false);
                setEditingWidget(undefined);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
