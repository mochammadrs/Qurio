"use client";

interface BubbleConfig {
  size: string;
  position: string;
  color: string;
  animation: string;
}

interface AnimatedBackgroundProps {
  variant?: 'home' | 'play' | 'result' | 'dashboard';
}

const bubbleConfigs: Record<string, BubbleConfig[]> = {
  home: [
    { size: 'w-72 h-72', position: 'top-20 left-10', color: 'bg-blue-200/30', animation: 'animate-float' },
    { size: 'w-96 h-96', position: 'top-40 right-20', color: 'bg-purple-200/30', animation: 'animate-float-delayed' },
    { size: 'w-64 h-64', position: 'bottom-20 left-1/4', color: 'bg-emerald-200/30', animation: 'animate-float-slow' },
    { size: 'w-80 h-80', position: 'bottom-40 right-1/3', color: 'bg-amber-200/30', animation: 'animate-float' },
  ],
  play: [
    { size: 'w-64 h-64', position: 'top-10 right-10', color: 'bg-blue-200/30', animation: 'animate-float' },
    { size: 'w-80 h-80', position: 'bottom-20 left-10', color: 'bg-indigo-200/30', animation: 'animate-float-delayed' },
    { size: 'w-48 h-48', position: 'top-1/2 right-1/3', color: 'bg-purple-200/30', animation: 'animate-float-slow' },
  ],
  result: [
    { size: 'w-72 h-72', position: 'top-20 left-20', color: 'bg-purple-200/30', animation: 'animate-float' },
    { size: 'w-80 h-80', position: 'bottom-20 right-20', color: 'bg-pink-200/30', animation: 'animate-float-delayed' },
    { size: 'w-64 h-64', position: 'top-1/2 right-10', color: 'bg-blue-200/30', animation: 'animate-float-slow' },
  ],
  dashboard: [
    { size: 'w-80 h-80', position: 'top-10 right-10', color: 'bg-purple-200/30', animation: 'animate-float' },
    { size: 'w-72 h-72', position: 'bottom-20 left-10', color: 'bg-blue-200/30', animation: 'animate-float-delayed' },
    { size: 'w-64 h-64', position: 'top-1/3 left-1/4', color: 'bg-indigo-200/30', animation: 'animate-float-slow' },
    { size: 'w-48 h-48', position: 'bottom-1/3 right-1/4', color: 'bg-emerald-200/30', animation: 'animate-float' },
  ],
};

const decorativeShapes: Record<string, Array<{ size: string; position: string; shape: string; animation: string }>> = {
  home: [
    { size: 'w-24 h-24', position: 'top-1/4 right-10', shape: 'border-4 border-blue-300/40 rounded-xl rotate-12', animation: 'animate-spin-slow' },
    { size: 'w-32 h-32', position: 'bottom-1/3 left-20', shape: 'border-4 border-purple-300/40 rounded-full', animation: 'animate-pulse-slow' },
    { size: 'w-20 h-20', position: 'top-1/2 right-1/4', shape: 'border-4 border-emerald-300/40 rotate-45', animation: 'animate-bounce-slow' },
  ],
  play: [],
  result: [],
  dashboard: [
    { size: 'w-20 h-20', position: 'top-1/4 right-1/4', shape: 'border-4 border-purple-300/40 rounded-xl rotate-12', animation: 'animate-spin-slow' },
    { size: 'w-28 h-28', position: 'bottom-1/4 left-1/3', shape: 'border-4 border-blue-300/40 rounded-full', animation: 'animate-pulse-slow' },
  ],
};

export function AnimatedBackground({ variant = 'home' }: AnimatedBackgroundProps) {
  const bubbles = bubbleConfigs[variant] || bubbleConfigs.home;
  const shapes = decorativeShapes[variant] || [];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble, index) => (
        <div
          key={`bubble-${index}`}
          className={`absolute ${bubble.size} ${bubble.position} ${bubble.color} rounded-full blur-3xl ${bubble.animation}`}
        />
      ))}
      
      {shapes.map((shape, index) => (
        <div
          key={`shape-${index}`}
          className={`absolute ${shape.size} ${shape.position} ${shape.shape} ${shape.animation}`}
        />
      ))}
    </div>
  );
}
