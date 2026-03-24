import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WaveformProps {
  isRecording?: boolean;
  isPlaying?: boolean;
  className?: string;
}

export function Waveform({ isRecording, isPlaying, className }: WaveformProps) {
  const bars = Array.from({ length: 18 });
  const active = isRecording || isPlaying;

  const getHeight = (i: number) => {
    const center = 8;
    const dist = Math.abs(i - center);
    const base = Math.max(0.15, 1 - dist * 0.09);
    return base;
  };

  return (
    <div className={cn("flex items-center justify-center gap-[3px]", className)} style={{ height: 40, width: 96 }}>
      {bars.map((_, i) => {
        const baseHeight = getHeight(i);
        return (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: 3,
              background: isRecording
                ? "rgba(248,113,113,0.85)"
                : isPlaying
                ? "rgba(96,165,250,0.85)"
                : "rgba(255,255,255,0.12)",
              boxShadow: active
                ? isRecording
                  ? "0 0 6px rgba(248,113,113,0.4)"
                  : "0 0 6px rgba(96,165,250,0.35)"
                : "none",
            }}
            animate={{
              height: active
                ? [
                    `${baseHeight * 20}%`,
                    `${Math.min(100, baseHeight * 100 * (0.6 + Math.random() * 0.4))}%`,
                    `${baseHeight * 20}%`,
                  ]
                : `${baseHeight * 18}%`,
              opacity: active ? 1 : 0.5,
            }}
            transition={{
              duration: active ? 0.5 + (i % 3) * 0.15 : 0.4,
              repeat: active ? Infinity : 0,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: active ? (i * 0.04) % 0.3 : 0,
            }}
          />
        );
      })}
    </div>
  );
}
