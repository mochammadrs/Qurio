import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Header Component
 * Simple header dengan logo dan branding
 */
export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Enhanced Logo with decorative elements */}
            <div className="relative w-12 h-12">
              {/* Glow effect background */}
              <div className="absolute inset-0 bg-blue-400/40 rounded-2xl blur-xl group-hover:bg-blue-500/60 transition-all duration-300" />
              
              {/* Main logo container */}
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-xl shadow-blue-500/50 border-2 border-white/30">
                {/* Sparkle decoration top-right */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-90 group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-yellow-400/50" />
                
                {/* Q letter with enhanced styling */}
                <span className="text-white text-2xl font-bold font-heading relative">
                  Q
                  {/* Dot decoration inside Q */}
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse-slow" />
                </span>
                
                {/* Bottom-left accent */}
                <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-purple-400 rounded-full opacity-70 group-hover:scale-125 transition-transform duration-300" />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-heading font-bold text-blue-500">
                Qurio
              </h1>
              <div className="flex items-center gap-1 -mt-1">
                <Sparkles className="w-3 h-3 text-[#5B8CFF]" />
                <p className="text-xs text-gray-500 font-medium">Where Curiosity Begins</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
