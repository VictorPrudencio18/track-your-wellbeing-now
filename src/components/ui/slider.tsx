
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-gradient-to-r from-navy-700/80 to-navy-600/80 border border-navy-500/30 shadow-inner">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg transition-all duration-300" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="relative block h-7 w-7 rounded-full border-3 border-white/90 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 shadow-xl ring-4 ring-indigo-500/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 hover:shadow-2xl hover:ring-6 hover:ring-indigo-400/30 cursor-grab active:cursor-grabbing active:scale-95 group-hover:animate-pulse">
      {/* Grip lines indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col gap-0.5">
          <div className="w-2 h-0.5 bg-white/80 rounded-full"></div>
          <div className="w-2 h-0.5 bg-white/80 rounded-full"></div>
          <div className="w-2 h-0.5 bg-white/80 rounded-full"></div>
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/50 via-purple-500/50 to-pink-500/50 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Drag hint tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <div className="bg-navy-800/95 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg border border-indigo-400/30 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8L22 12L18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 8L2 12L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Arraste</span>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-navy-800/95"></div>
          </div>
        </div>
      </div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
