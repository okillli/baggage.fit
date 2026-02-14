import { cn } from '@/lib/utils';
import type { BagType } from '@/types';
import { Briefcase, Backpack, Package } from 'lucide-react';

interface BagTypeCardProps {
  type: BagType;
  title: string;
  description: string;
  imageSrc?: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

const icons: Record<BagType, typeof Briefcase> = {
  cabin: Briefcase,
  underseat: Backpack,
  checked: Package,
};

export function BagTypeCard({
  type,
  title,
  description,
  imageSrc,
  isSelected,
  onClick,
  className,
}: BagTypeCardProps) {
  const Icon = icons[type];

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        'relative group text-left rounded-xl overflow-hidden transition-all duration-300',
        'border-2',
        isSelected
          ? 'border-accent bg-accent/10'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
        className
      )}
    >
      {/* Image or Icon */}
      <div className="relative h-32 overflow-hidden">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <Icon
              className={cn(
                'w-12 h-12 transition-colors',
                isSelected ? 'text-accent' : 'text-muted-foreground'
              )}
            />
          </div>
        )}
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
            <svg className="w-4 h-4 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-lg mb-1 flex items-center gap-2">
          <Icon className={cn('w-5 h-5', isSelected ? 'text-accent' : 'text-muted-foreground')} />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Hover lift effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none',
          isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
        )}
        style={{
          boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
        }}
      />
    </button>
  );
}
