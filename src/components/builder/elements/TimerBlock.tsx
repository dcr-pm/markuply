"use client";

import { useEffect, useState, useCallback } from "react";
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

export function TimerBlock({ element, onSelect }: TimerBlockProps) {
  const getTime = useCallback(() => calcTimeLeft(element.targetDate), [element.targetDate]);
  const [time, setTime] = useState(getTime);

  // Immediately recalculate when targetDate changes AND tick every second
  useEffect(() => {
    setTime(calcTimeLeft(element.targetDate));
    const interval = setInterval(() => {
      setTime(calcTimeLeft(element.targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [element.targetDate]);

  const timerColor = element.timerColor || "#4F46E5";
  const labelColor = element.labelColor || "#666666";
  const fontFamily = element.styles.fontFamily || "Arial, sans-serif";
  const fontSize = element.styles.fontSize || "24px";
  const textAlign = element.styles.textAlign || "center";

  return (
    <div onClick={onSelect} className="cursor-pointer rounded-lg">
      <div
        style={{
          textAlign: textAlign as React.CSSProperties["textAlign"],
          padding: element.styles.padding || "20px",
          fontFamily,
          backgroundColor: element.styles.backgroundColor || "transparent",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "14px",
            color: labelColor,
            fontFamily,
          }}
        >
          {element.label}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(4px, 1.5vw, 8px)",
            flexWrap: "wrap",
          }}
        >
          {([
            ["days", time.days],
            ["hours", time.hours],
            ["min", time.minutes],
            ["sec", time.seconds],
          ] as [string, number][]).map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: timerColor,
                color: "#ffffff",
                fontSize: `clamp(16px, 3vw, ${fontSize})`,
                fontWeight: "bold",
                padding: "clamp(6px, 1.5vw, 12px) clamp(8px, 2vw, 16px)",
                borderRadius: element.styles.borderRadius || "8px",
                minWidth: "clamp(36px, 8vw, 56px)",
                textAlign: "center",
                fontFamily,
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ lineHeight: 1.2 }}>
                {String(value).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: "clamp(8px, 1.2vw, 11px)",
                  color: labelColor,
                  marginTop: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: "normal",
                  opacity: 0.9,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
