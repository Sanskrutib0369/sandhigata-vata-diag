import React from 'react';

interface BodyMapProps {
  selectedJoints: string[];
  onChange: (joints: string[]) => void;
  readOnly?: boolean;
}

const BodyMap: React.FC<BodyMapProps> = ({ selectedJoints, onChange, readOnly = false }) => {
  
  const toggleJoint = (joint: string) => {
    if (readOnly) return;
    if (selectedJoints.includes(joint)) {
      onChange(selectedJoints.filter(j => j !== joint));
    } else {
      onChange([...selectedJoints, joint]);
    }
  };

  const JointPoint = ({ x, y, name, label }: { x: number; y: number; name: string; label?: string }) => {
    const isSelected = selectedJoints.includes(name);
    return (
      <g 
        onClick={() => toggleJoint(name)} 
        className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} transition-all duration-200 hover:opacity-80`}
      >
        <circle 
            cx={x} 
            cy={y} 
            r="12" 
            fill={isSelected ? "#ef4444" : "#e5e7eb"} 
            stroke={isSelected ? "#991b1b" : "#9ca3af"}
            strokeWidth="2"
        />
        <text x={x} y={y + 24} textAnchor="middle" fontSize="10" fill="#374151" className="font-semibold select-none">
            {label || name}
        </text>
        {isSelected && (
            <circle cx={x} cy={y} r="4" fill="white" />
        )}
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner">
      <h3 className="text-lg font-semibold mb-4 text-ayur-800">Select Affected Joints</h3>
      <svg viewBox="0 0 300 500" className="w-full max-w-[300px] h-auto drop-shadow-md">
        {/* Silhouette */}
        <g stroke="#d1d5db" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Head */}
            <circle cx="150" cy="40" r="25" />
            {/* Spine */}
            <path d="M150 65 L150 200" />
            {/* Shoulders */}
            <path d="M100 80 L200 80" />
            {/* Arms */}
            <path d="M100 80 L80 160 L60 220" /> {/* Left Arm */}
            <path d="M200 80 L220 160 L240 220" /> {/* Right Arm */}
            {/* Hips */}
            <path d="M110 200 L190 200" /> 
            {/* Legs */}
            <path d="M110 200 L100 320 L90 440" /> {/* Left Leg */}
            <path d="M190 200 L200 320 L210 440" /> {/* Right Leg */}
        </g>

        {/* Joints */}
        {/* Cervical */}
        <JointPoint x={150} y={75} name="Cervical Spine" label="Neck" />
        {/* Lumbar */}
        <JointPoint x={150} y={180} name="Lumbar Spine" label="Lower Back" />
        
        {/* Shoulders */}
        <JointPoint x={100} y={80} name="R. Shoulder" label="R.Shldr" />
        <JointPoint x={200} y={80} name="L. Shoulder" label="L.Shldr" />
        
        {/* Elbows */}
        <JointPoint x={80} y={160} name="R. Elbow" label="R.Elbow" />
        <JointPoint x={220} y={160} name="L. Elbow" label="L.Elbow" />
        
        {/* Wrists */}
        <JointPoint x={60} y={220} name="R. Wrist" label="R.Wrist" />
        <JointPoint x={240} y={220} name="L. Wrist" label="L.Wrist" />
        
        {/* Hips */}
        <JointPoint x={110} y={200} name="R. Hip" />
        <JointPoint x={190} y={200} name="L. Hip" />
        
        {/* Knees */}
        <JointPoint x={100} y={320} name="R. Knee" />
        <JointPoint x={200} y={320} name="L. Knee" />
        
        {/* Ankles */}
        <JointPoint x={90} y={440} name="R. Ankle" />
        <JointPoint x={210} y={440} name="L. Ankle" />

      </svg>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Tap on the circles to mark affected joints.
      </div>
    </div>
  );
};

export default BodyMap;
