import React from 'react';

const HoverTooltip = ({ node, mousePos }) => {
    if (!node) return null;

    return (
        <div
            className="fixed z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl max-w-xs pointer-events-none"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        >
            <h4 className="font-bold text-sm mb-1">{node.title}</h4>
            <p className="text-xs text-gray-300">{node.summary}</p>
        </div>
    );
};

export default HoverTooltip;