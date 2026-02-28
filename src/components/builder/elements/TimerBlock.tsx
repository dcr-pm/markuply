"use client";

import { useEffect, useState } from "react";
import type { TimerElement } from "@/types/builder";

interface TimerBlockProps {
  element: TimerElement;
  selected: boolean;
  onSelect: () => void;
  onChange: (el: TimerElement) => void;
}

function calcTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function TimerBlock({ element, selected, onSelect }: TimerBlockProps) {
  const [time, setTime] = useState(calcTimeLeft(element.targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calcTimeLeft(element.targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [element.targetDate]);

  const digitStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: element.timerColor || "#4F46E5",
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
    padding: "10px 14px",
    borderRadius: "8px",
    margin: "0 3px",
    minWidth: "48px",
    textAlign: "center",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "10px",
    color: element.labelColor || "#666666",
    marginTop: "4px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "normal",
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg transition-all ${
        selected ? "ring-2 ring-indigo-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
      }`}
    >
      <div
        style={{
          textAlign: "center",
          padding: element.styles.padding || "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p style={{ margin: "0 0 10px", fontSize: "14px", color: element.labelColor || "#666" }}>
          {element.label}
        </p>
        <div>
          {([
            ["days", time.days],
            ["hours", time.hours],
            ["min", time.minutes],
            ["sec", time.seconds],
          ] as [string, number][]).map(([label, value]) => (
            <span key={label} style={digitStyle}>
              {String(value).padStart(2, "0")}
              <span style={labelStyle}>{label}</span>
            </span>
          ))}
        </div>
      </div>
      {selected && (
        <div className="absolute -top-3 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white">
          Timer
        </div>
      )}
    </div>
  );
}
