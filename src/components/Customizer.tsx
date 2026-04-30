import React, { useState } from "react";
import { X, Palette, Type, Image as ImageIcon, Save, Sparkles, Upload, RotateCcw, Footprints, Droplets, Flame, Star, Heart, Zap, Check, LayoutGrid, Pipette } from "lucide-react";
import { Widget, ThemePreset, THEME_PRESETS, WidgetFont } from "../types";

interface CustomizerProps {
  initialWidget: Partial<Widget>;
  onSave: (widget: Partial<Widget>) => void;
  onClose: () => void;
}

export const Customizer: React.FC<CustomizerProps> = ({
  initialWidget,
  onSave,
  onClose,
}) => {
  const [widget, setWidget] = useState<Partial<Widget>>({
    title: "",
    description: "",
    color: "#ffffff",
    textColor: "#000000",
    font: "sans",
    punches: Array(31).fill(false),
    totalSlots: 31,
    bgZoom: 100,
    bgOffset: { x: 50, y: 50 },
    punchIcon: "check",
    punchShape: "rounded",
    punchColor: undefined,
    gridColumns: 7,
    resetInterval: "manual",
    lastResetAt: Date.now(),
    ...initialWidget,
  });

  const updateSlots = (newTotal: number) => {
    setWidget(prev => {
      const currentPunches = prev.punches || [];
      let newPunches = [...currentPunches];
      if (newTotal > currentPunches.length) {
        newPunches = [...currentPunches, ...Array(newTotal - currentPunches.length).fill(false)];
      } else {
        newPunches = currentPunches.slice(0, newTotal);
      }
      return { ...prev, totalSlots: newTotal, punches: newPunches };
    });
  };

  const shapes: { id: Widget["punchShape"]; name: string }[] = [
    { id: "square", name: "Square" },
    { id: "rounded", name: "Rounded" },
    { id: "circle", name: "Circle" },
    { id: "pill", name: "Pill" },
    { id: "leaf", name: "Leaf" },
  ];

  const getShapeStyle = (shape: Widget["punchShape"]) => {
    switch(shape) {
      case 'circle': return { borderRadius: '100%' };
      case 'rounded': return { borderRadius: '8px' };
      case 'square': return { borderRadius: '0' };
      case 'pill': return { borderRadius: '16px' };
      case 'leaf': return { borderRadius: '24px 0 24px 0' };
      default: return {};
    }
  };

  const applyPreset = (preset: ThemePreset) => {
    setWidget((prev) => ({
      ...prev,
      color: preset.color,
      textColor: preset.textColor,
      font: preset.font,
      backgroundImage: preset.backgroundImage,
      bgZoom: 100,
      bgOffset: { x: 50, y: 50 },
      resetInterval: prev.resetInterval || "manual",
    }));
  };

  const intervals: { id: Widget["resetInterval"]; name: string }[] = [
    { id: "manual", name: "Manual Only" },
    { id: "12h", name: "Every 12h" },
    { id: "24h", name: "Every 24h" },
    { id: "weekly", name: "Weekly" },
    { id: "monthly", name: "Monthly" },
  ];

  const openDropper = async (targetField: "color" | "textColor" | "punchColor") => {
    // @ts-ignore - EyeDropper is a modern web API not yet fully in TS lib
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        // @ts-ignore
        const dropper = new window.EyeDropper();
        const result = await dropper.open();
        setWidget(prev => ({ ...prev, [targetField]: result.sRGBHex }));
      } catch (e) {
        console.error("EyeDropper error:", e);
      }
    } else {
      alert("EyeDropper API is not supported in this browser. Try Chrome, Edge or Opera.");
    }
  };

  const fonts: { id: WidgetFont; name: string }[] = [
    { id: "sans", name: "Modern Sans" },
    { id: "serif", name: "Classic Serif" },
    { id: "mono", name: "Tech Mono" },
    { id: "pixel", name: "Retro Pixel" },
    { id: "display", name: "Punchy Black" },
  ];

  const punchIcons: { id: Widget["punchIcon"]; icon: any }[] = [
    { id: "check", icon: Check },
    { id: "footprints", icon: Footprints },
    { id: "droplet", icon: Droplets },
    { id: "flame", icon: Flame },
    { id: "star", icon: Star },
    { id: "heart", icon: Heart },
    { id: "zap", icon: Zap },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWidget({ ...widget, backgroundImage: event.target?.result as string, bgZoom: 100, bgOffset: { x: 50, y: 50 } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]">
        
        {/* Left Side: Preview */}
        <div className="md:w-2/5 p-8 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto">
          <div className="w-full max-w-[320px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">Live Preview</p>
            <div 
              className="p-6 rounded-3xl shadow-xl overflow-hidden min-h-[400px] flex flex-col transition-all"
              style={{ 
                backgroundColor: widget.color, 
                color: widget.textColor,
                backgroundImage: widget.backgroundImage ? `url(${widget.backgroundImage})` : 'none',
                backgroundSize: widget.backgroundImage ? `${widget.bgZoom}%` : 'cover',
                backgroundPosition: widget.backgroundImage ? `${widget.bgOffset?.x}% ${widget.bgOffset?.y}%` : 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="mb-6">
                <h3 className={`text-xl leading-tight mb-1 transition-all ${
                  widget.font === 'pixel' ? 'font-pixel uppercase text-[10px] leading-none' :
                  widget.font === 'display' ? 'font-black uppercase tracking-tighter text-3xl font-display' : 
                  widget.font === 'serif' ? 'font-serif text-2xl' :
                  widget.font === 'mono' ? 'font-mono text-lg' : 'font-sans text-xl font-bold'
                }`}>
                  {widget.title || "Your Goal Title"}
                </h3>
                <p className="opacity-70 text-xs font-medium">{widget.description || "Short description here"}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                <div 
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${widget.gridColumns || 7}, minmax(0, 1fr))` }}
                >
                  {Array(widget.totalSlots || 0).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className="aspect-square border border-current/20 flex flex-col items-center justify-center relative"
                      style={getShapeStyle(widget.punchShape || 'rounded')}
                    >
                      {widget.showDayLabels && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[5px] font-bold opacity-40 uppercase whitespace-nowrap">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7]}
                        </span>
                      )}
                      {i < 3 && (
                        <div 
                          className="w-full h-full flex items-center justify-center p-0.5"
                          style={{ 
                            backgroundColor: widget.punchColor || widget.textColor,
                            ...getShapeStyle(widget.punchShape || 'rounded')
                          }}
                        >
                          {(() => {
                            const item = punchIcons.find(icon => icon.id === widget.punchIcon);
                            if (item) {
                              const Icon = item.icon;
                              return <Icon size={8} className="stroke-[4px]" style={{ color: widget.color }} />;
                            }
                            return <span className="text-[6px] font-bold" style={{ color: widget.color }}>{widget.punchIcon}</span>;
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-[8px] uppercase tracking-widest font-bold opacity-30 text-center mt-4">
                Punch Card Preview
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="md:w-3/5 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-orange-500" size={24} />
              Refine Widget
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Title & Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 text-left">Goal Title</label>
                <input
                  type="text"
                  value={widget.title}
                  onChange={(e) => setWidget({ ...widget, title: e.target.value })}
                  placeholder="e.g. Daily Workout"
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-shadow"
                  id="input-title"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 text-left text-nowrap">Goal Configuration</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button 
                    onClick={() => {
                      updateSlots(7);
                      setWidget(prev => ({ ...prev, gridColumns: 7, showDayLabels: true }));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all uppercase tracking-wider ${
                      widget.totalSlots === 7 && widget.showDayLabels 
                        ? "bg-black text-white border-black" 
                        : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    7 Days (Weekly)
                  </button>
                  <button 
                    onClick={() => {
                      updateSlots(31);
                      setWidget(prev => ({ ...prev, gridColumns: 7, showDayLabels: false }));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all uppercase tracking-wider ${
                      widget.totalSlots === 31 && !widget.showDayLabels 
                        ? "bg-black text-white border-black" 
                        : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    31 Days (Monthly)
                  </button>
                  <button 
                    onClick={() => setWidget(prev => ({ ...prev, showDayLabels: !prev.showDayLabels }))}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all uppercase tracking-wider ${
                      widget.showDayLabels 
                        ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20" 
                        : "bg-white text-gray-400 border-gray-200 hover:border-orange-200"
                    }`}
                  >
                    Day Labels: {widget.showDayLabels ? "ON" : "OFF"}
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={widget.totalSlots || 31}
                    onChange={(e) => updateSlots(parseInt(e.target.value))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <input
                    type="number"
                    min="1"
                    max="366"
                    value={widget.totalSlots || 31}
                    onChange={(e) => updateSlots(Math.min(366, parseInt(e.target.value) || 1))}
                    className="w-16 px-3 py-2 bg-gray-100 rounded-xl text-sm font-bold border border-gray-200 outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 text-left text-nowrap">Goal Description</label>
              <input
                type="text"
                value={widget.description}
                onChange={(e) => setWidget({ ...widget, description: e.target.value })}
                placeholder="Short purpose of this habit..."
                className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-shadow"
                id="input-desc"
              />
            </div>

            {/* Punch Icon Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <Sparkles size={14} /> Punch Symbol
              </label>
              <div className="flex flex-wrap gap-2">
                {punchIcons.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setWidget({ ...widget, punchIcon: item.id })}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 ${
                      widget.punchIcon === item.id 
                        ? "bg-black text-white border-black" 
                        : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200"
                    }`}
                    id={`icon-${item.id}`}
                  >
                    <item.icon size={18} />
                  </button>
                ))}
                <div className="flex items-center gap-2 px-2 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400">Custom:</span>
                  <input 
                    type="text" 
                    maxLength={2}
                    value={punchIcons.some(p => p.id === widget.punchIcon) ? "" : widget.punchIcon}
                    onChange={(e) => setWidget({ ...widget, punchIcon: e.target.value })}
                    placeholder="⚡"
                    className="w-10 h-8 text-center bg-transparent outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Typography with Preview */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <Type size={14} /> Typography Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {fonts.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setWidget({ ...widget, font: f.id })}
                    className={`px-4 py-4 rounded-2xl text-left transition-all border-2 flex flex-col ${
                      widget.font === f.id 
                        ? "bg-black text-white border-black" 
                        : "bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-300"
                    }`}
                    id={`font-${f.id}`}
                  >
                    <span className="text-[10px] opacity-60 mb-1 uppercase tracking-tighter">{f.name}</span>
                    <span className={`text-base leading-none ${
                       f.id === 'pixel' ? 'font-pixel text-[8px] uppercase leading-none' :
                       f.id === 'display' ? 'font-display font-black uppercase tracking-tighter' : 
                       f.id === 'serif' ? 'font-serif italic' :
                       f.id === 'mono' ? 'font-mono' : 'font-sans font-bold'
                    }`}>Preview Text</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Reset Logic */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <RotateCcw size={14} /> Auto-Reset Frequency
              </label>
              <div className="flex flex-wrap gap-2">
                {intervals.map((int) => (
                  <button
                    key={int.id}
                    onClick={() => setWidget({ ...widget, resetInterval: int.id })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      widget.resetInterval === int.id 
                        ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20" 
                        : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300"
                    }`}
                    id={`interval-${int.id}`}
                  >
                    {int.name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-gray-400 font-medium italic">
                Automatically clears the punch card after the selected duration.
              </p>
            </div>

            {/* Grid & Shape Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="space-y-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <LayoutGrid size={14} /> Grid Layout
                </label>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Columns</span>
                    <span>{widget.gridColumns || 7}</span>
                  </div>
                  <input
                    type="range" min="2" max="12" step="1"
                    value={widget.gridColumns || 7}
                    onChange={(e) => setWidget({...widget, gridColumns: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Punch Shape</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {shapes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setWidget({...widget, punchShape: s.id})}
                      className={`h-11 border-2 transition-all flex items-center justify-center ${
                        widget.punchShape === s.id ? "bg-black text-white border-black shadow-lg" : "bg-white border-gray-100 hover:border-gray-200"
                      }`}
                      style={getShapeStyle(s.id)}
                    >
                      <span className="text-[10px] font-bold uppercase">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Colors Section Enhanced */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">Card Color</label>
                <div className="flex gap-2 p-2 bg-gray-50 rounded-xl items-center border border-gray-100 group">
                  <div className="relative">
                    <input
                      type="color"
                      value={widget.color}
                      onChange={(e) => setWidget({ ...widget, color: e.target.value })}
                      className="w-6 h-6 rounded-full overflow-hidden border-none shrink-0 cursor-pointer opacity-0 absolute inset-0 z-10"
                    />
                    <div className="w-6 h-6 rounded-full border border-black/5" style={{ backgroundColor: widget.color }} />
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 min-w-0">
                    <div className="w-3 h-3 rounded shadow-inner shrink-0" style={{ backgroundColor: widget.color }} />
                    <input 
                      type="text" 
                      value={widget.color} 
                      onChange={(e) => setWidget({ ...widget, color: e.target.value })}
                      className="text-[10px] font-mono uppercase bg-transparent outline-none w-full"
                    />
                  </div>
                  <button 
                    onClick={() => openDropper("color")}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
                    title="Pick color from screen"
                  >
                    <Pipette size={12} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">Text Color</label>
                 <div className="flex gap-2 p-2 bg-gray-50 rounded-xl items-center border border-gray-100 group">
                  <div className="relative">
                    <input
                      type="color"
                      value={widget.textColor}
                      onChange={(e) => setWidget({ ...widget, textColor: e.target.value })}
                      className="w-6 h-6 rounded-full overflow-hidden border-none shrink-0 cursor-pointer opacity-0 absolute inset-0 z-10"
                    />
                    <div className="w-6 h-6 rounded-full border border-black/5" style={{ backgroundColor: widget.textColor }} />
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 min-w-0">
                    <div className="w-3 h-3 rounded shadow-inner shrink-0" style={{ backgroundColor: widget.textColor }} />
                    <input 
                      type="text" 
                      value={widget.textColor} 
                      onChange={(e) => setWidget({ ...widget, textColor: e.target.value })}
                      className="text-[10px] font-mono uppercase bg-transparent outline-none w-full"
                    />
                  </div>
                  <button 
                    onClick={() => openDropper("textColor")}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
                    title="Pick color from screen"
                  >
                    <Pipette size={12} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">Punch Ink</label>
                 <div className="flex gap-2 p-2 bg-gray-50 rounded-xl items-center border border-gray-100 group">
                  <div className="relative">
                    <input
                      type="color"
                      value={widget.punchColor || widget.textColor}
                      onChange={(e) => setWidget({ ...widget, punchColor: e.target.value })}
                      className="w-6 h-6 rounded-full overflow-hidden border-none shrink-0 cursor-pointer opacity-0 absolute inset-0 z-10"
                    />
                    <div className="w-6 h-6 rounded-full border border-black/5" style={{ backgroundColor: widget.punchColor || widget.textColor }} />
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 min-w-0">
                    <div className="w-3 h-3 rounded shadow-inner shrink-0" style={{ backgroundColor: widget.punchColor || widget.textColor }} />
                    <input 
                      type="text" 
                      value={widget.punchColor || widget.textColor} 
                      onChange={(e) => setWidget({ ...widget, punchColor: e.target.value })}
                      className="text-[10px] font-mono uppercase bg-transparent outline-none w-full"
                    />
                  </div>
                  <button 
                    onClick={() => openDropper("punchColor")}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
                    title="Pick color from screen"
                  >
                    <Pipette size={12} />
                  </button>
                  <button 
                    onClick={() => setWidget({...widget, punchColor: undefined})}
                    className={`text-[8px] font-bold shrink-0 transition-opacity ${!widget.punchColor ? 'opacity-30 cursor-default' : 'text-blue-500 hover:underline'}`}
                    disabled={!widget.punchColor}
                  >Match</button>
                </div>
              </div>
            </div>

            {/* Background Tools */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <ImageIcon size={14} /> Background Media
                </label>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => document.getElementById('image-upload-input')?.click()}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-2xl text-sm font-bold border-2 border-dashed border-gray-300 hover:border-black transition-all"
                >
                  <Upload size={16} /> Upload Device
                </button>
                <input 
                  id="image-upload-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {[
                    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400",
                    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=400",
                  ].map((img) => (
                    <button
                      key={img}
                      onClick={() => setWidget({ ...widget, backgroundImage: img, bgZoom: 100, bgOffset: { x: 50, y: 50 } })}
                      className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 border-transparent hover:border-black"
                    >
                      <img src={img} className="w-full h-full object-cover" alt="Preset" />
                    </button>
                  ))}
                  <button 
                    onClick={() => setWidget({ ...widget, backgroundImage: undefined })}
                    className="shrink-0 w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Cropping/Resizing Controls */}
              {widget.backgroundImage && (
                <div className="p-5 bg-gray-50 border border-gray-100 rounded-[2rem] space-y-4">
                   <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Fine-tune Crop & Zoom</span>
                    <button onClick={() => setWidget({...widget, bgZoom: 100, bgOffset: { x: 50, y: 50 }})} className="text-[10px] text-blue-500 font-bold hover:underline">Reset</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span>Zoom</span>
                        <span>{widget.bgZoom}%</span>
                      </div>
                      <input 
                        type="range" min="100" max="300" step="1"
                        value={widget.bgZoom}
                        onChange={(e) => setWidget({...widget, bgZoom: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span>Horizontal Pos</span>
                          <span>{widget.bgOffset?.x}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" step="1"
                          value={widget.bgOffset?.x}
                          onChange={(e) => setWidget({...widget, bgOffset: { ...widget.bgOffset!, x: parseInt(e.target.value) }})}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span>Vertical Pos</span>
                          <span>{widget.bgOffset?.y}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" step="1"
                          value={widget.bgOffset?.y}
                          onChange={(e) => setWidget({...widget, bgOffset: { ...widget.bgOffset!, y: parseInt(e.target.value) }})}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onSave(widget)}
              disabled={!widget.title}
              className="w-full py-5 bg-black text-white rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10"
              id="save-widget-btn"
            >
              <Save size={20} />
              Confirm and Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
