import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-white hover:bg-secondary/80",
        destructive: "border-transparent bg-alert text-white shadow hover:bg-alert/80",
        outline: "text-slate-400 border-slate-700",
        glass: "bg-white/10 text-white border-white/20 backdrop-blur-md",
        neon: "bg-primary/10 text-primary border-primary/20 shadow-neon-blue"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
