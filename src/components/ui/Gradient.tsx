import React from 'react';

interface WaveGradientProps {
    className?: string;
}

export default function WaveGradient({ className = "" }: WaveGradientProps) {
    return (
        <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
        {/* Base deep purple background */}
        <div className="absolute inset-0 transition-all duration-1000 wave-gradient-base"/>
        
        {/* Clean oscillating layer 1 - Purple undertones */}
        <div className="absolute inset-0 wave-layer-1"/>
        
        {/* Clean oscillating layer 2 - Blue-purple blend */}
        <div className="absolute inset-0 wave-layer-2"/>
        
        {/* Clean oscillating layer 3 - Deep purple flow */}
        <div className="absolute inset-0 wave-layer-3"/>
        </div>
    );
}