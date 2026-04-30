import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Circle, Trash2, Edit3, RotateCcw, Footprints, Droplets, Flame, Star, Heart, Zap, GripVertical } from "lucide-react";
import { Widget } from "../types";

const PUNCH_ICONS = {
  check: Check,
  footprints: Footprints,
  droplet: Droplets,
  flame: Flame,
  star: Star,
  heart: Heart,
  zap: Zap,
};

interface WidgetCardProps {
  widget: Widget;
  onPunch: (index: number) => void;
  onDelete: () => void;
  onEdit: () => void;
  onReset: () => void;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  onPunch,
  onDelete,
  onEdit,
  onReset,
}) => {
  const fontClass = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
    display: "font-black tracking-tighter uppercase text-4xl",
    pixel: "font-pixel text-[10px] uppercase leading-none",
  }[widget.font];

  const totalPunches = widget.totalSlots || 31;
  const completedCount = widget.punches.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalPunches) * 100);

  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  }[widget.gridColumns || 7] || "grid-cols-7";

  const shapeStyles = {
    square: { className: "rounded-none" },
    rounded: { className: "rounded-lg" },
    circle: { className: "rounded-full" },
    pill: { className: "rounded-2xl" },
    leaf: { className: "rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-sm rounded-bl-sm" },
  } as const;

  const currentShape = shapeStyles[widget.punchShape || "rounded"] || shapeStyles.rounded;

  return (
    <motion.div
      layout
      className="relative group p-6 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 border-4 border-transparent hover:scale-[1.01]"
      style={{
        backgroundColor: widget.color,
        color: widget.textColor,
        backgroundImage: widget.backgroundImage ? `url(${widget.backgroundImage})` : "none",
        backgroundSize: widget.backgroundImage ? `${(widget.bgZoom || 100)}%` : "cover",
        backgroundPosition: widget.backgroundImage && widget.bgOffset 
          ? `${widget.bgOffset.x}% ${widget.bgOffset.y}%` 
          : "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better readability if background is set */}
      {widget.backgroundImage && (
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none" />
      )}

      {/* Header Actions */}
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing">
            <GripVertical size={20} />
          </div>
          <div className="flex-1">
            <h3 className={`${fontClass} leading-none mb-1 break-words`}>
              {widget.title}
            </h3>
            <p className="opacity-70 text-[10px] font-bold uppercase tracking-wider">{widget.description}</p>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Reset all progress for this habit? This cannot be undone.")) {
                onReset();
              }
            }}
            title="Reset All"
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            id={`reset-btn-${widget.id}`}
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            id={`edit-btn-${widget.id}`}
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this habit card? All data will be lost.")) {
                onDelete();
              }
            }}
            className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-500 hover:text-red-400 transition-colors"
            id={`delete-btn-${widget.id}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 mb-6">
        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full bg-current/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-current"
            style={{ backgroundColor: widget.punchColor || widget.textColor }}
          />
        </div>
      </div>

      {/* Punch Card Grid */}
      <div className={`relative z-10 grid ${gridColsClass} gap-y-6 gap-x-2 ${widget.showDayLabels ? 'pt-4' : ''}`}>
        {widget.punches.slice(0, totalPunches).map((isPunched, idx) => (
          <button
            key={idx}
            onClick={() => onPunch(idx)}
            className={`relative aspect-square flex items-center justify-center border-2 border-current/20 hover:border-current/50 transition-all hover:scale-105 active:scale-95 group/punch ${'className' in currentShape ? currentShape.className : ''}`}
            style={'style' in currentShape ? currentShape.style : {}}
            id={`punch-${widget.id}-${idx}`}
          >
            {widget.showDayLabels ? (
              <span className="absolute text-[7px] -top-4 left-1/2 -translate-x-1/2 opacity-60 font-black uppercase tracking-tight whitespace-nowrap">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx % 7]}
              </span>
            ) : (
              <span className="absolute text-[8px] top-0.5 left-1 opacity-20 font-mono">
                {idx + 1}
              </span>
            )}
            <AnimatePresence mode="wait">
              {isPunched ? (
                <motion.div
                  key="checked"
                  initial={{ scale: 2, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`w-full h-full flex items-center justify-center p-0.5 ${'className' in currentShape ? currentShape.className : ''}`}
                  style={{ 
                    backgroundColor: widget.punchColor || widget.textColor,
                    color: widget.color,
                    ...('style' in currentShape ? currentShape.style : {})
                  }}
                >
                  {(() => {
                    const iconKey = widget.punchIcon as keyof typeof PUNCH_ICONS;
                    if (PUNCH_ICONS[iconKey]) {
                      const Icon = PUNCH_ICONS[iconKey];
                      return <Icon size={14} className="stroke-[4px]" />;
                    }
                    return <span className="text-[12px] font-bold leading-none select-none">{widget.punchIcon}</span>;
                  })()}
                </motion.div>
              ) : (
                <div key="unchecked" className="opacity-0 group-hover/punch:opacity-20 transition-opacity">
                  <Circle size={10} strokeWidth={3} />
                </div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 mt-4 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
            Daily Punch Card
          </div>
          {widget.resetInterval !== "manual" && (
            <div className="text-[8px] uppercase tracking-wider font-bold opacity-30 flex items-center gap-1">
              <RotateCcw size={8} /> Auto-reset: {widget.resetInterval}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-40">
           <span className="text-[10px] font-bold">{completedCount}/{totalPunches}</span>
        </div>
      </div>

      {/* Completion Aura */}
      {progressPercent === 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="absolute inset-0 bg-white pointer-events-none"
        />
      )}
    </motion.div>
  );
};
