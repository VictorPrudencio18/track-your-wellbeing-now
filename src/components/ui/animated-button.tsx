
import React from 'react';
import { motion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-white hover:shadow-lg hover:shadow-blue-500/25",
        primary: "bg-gradient-primary text-white hover:shadow-lg hover:shadow-blue-500/25",
        destructive: "bg-gradient-secondary text-white hover:shadow-lg hover:shadow-red-500/25",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-gradient-success text-white hover:shadow-lg hover:shadow-cyan-500/25",
        accent: "bg-gradient-accent text-white hover:shadow-lg hover:shadow-green-500/25",
        glass: "glass-card backdrop-blur-md border-white/20 text-white hover:border-white/40",
        neon: "bg-black border-2 border-cyan-400 text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:bg-cyan-400/10",
        premium: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-14 rounded-xl px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  pulse?: boolean;
  glow?: boolean;
  ripple?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, pulse = false, glow = false, ripple = false, children, onClick, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const rippleElement = document.createElement('span');
        rippleElement.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        button.appendChild(rippleElement);
        
        setTimeout(() => {
          rippleElement.remove();
        }, 600);
      }
      
      onClick?.(e);
    };

    // Separate motion props from button props
    const motionProps = {
      whileHover: { 
        scale: variant === 'premium' ? 1.05 : 1.02,
        y: -2
      },
      whileTap: { scale: 0.98 },
      transition: { type: "spring", stiffness: 400, damping: 25 }
    };

    // Filter out motion-specific props that conflict with HTML button props
    const {
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      ...buttonProps
    } = props;
    
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...motionProps}
        {...buttonProps}
      >
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {pulse && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-current opacity-25"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, buttonVariants };
