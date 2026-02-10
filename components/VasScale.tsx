import React from 'react';
import { Smile, Meh, Frown, Annoyed } from 'lucide-react';

interface VasScaleProps {
  value: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
}

const VasScale: React.FC<VasScaleProps> = ({ value, onChange, readOnly = false }) => {
  const getFace = (val: number) => {
    if (val < 2) return <Smile className="w-8 h-8 text-green-500" />;
    if (val < 4) return <Smile className="w-8 h-8 text-lime-500" />;
    if (val < 6) return <Meh className="w-8 h-8 text-yellow-500" />;
    if (val < 8) return <Annoyed className="w-8 h-8 text-orange-500" />;
    return <Frown className="w-8 h-8 text-red-600" />;
  };

  const getColor = (val: number) => {
    // Gradient from green to red
    const percent = val / 10;
    // Simple interpolation for demo (not precise rgb)
    if (val < 5) return `rgba(74, 222, 128, ${0.2 + percent * 0.5})`; // Greenish
    return `rgba(248, 113, 113, ${percent})`; // Reddish
  };

  return (
    <div className="w-full py-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">No Pain</span>
        <span className="text-sm font-medium text-gray-500">Worst Possible Pain</span>
      </div>
      
      <div className="relative h-12 flex items-center mb-6">
        {/* Track */}
        <div className="absolute w-full h-3 bg-gray-200 rounded-full overflow-hidden">
             <div 
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                    width: `${value * 10}%`,
                    backgroundColor: value > 5 ? '#ef4444' : '#22c55e'
                }}
             />
        </div>

        {/* Custom Range Input (Invisible but functional) */}
        {!readOnly && (
            <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
        )}

        {/* Thumb Visual */}
        <div 
            className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-gray-300 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 pointer-events-none z-0"
            style={{ left: `calc(${value * 10}% - 1.25rem)` }}
        >
            <span className="font-bold text-gray-700">{value}</span>
        </div>
      </div>

      <div className="flex justify-between px-2">
        {[0, 2, 4, 6, 8, 10].map((v) => (
            <div key={v} className={`flex flex-col items-center transition-opacity duration-300 ${value === v ? 'opacity-100 scale-110' : 'opacity-40'}`}>
                {getFace(v)}
                <span className="text-xs mt-1 font-semibold">{v}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default VasScale;
