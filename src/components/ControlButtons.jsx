import React from 'react';
import EditModal from '../utility/editModal';

const ControlButtons = ({ onExpandAll, onCollapseAll, onFitView, onAddNode }) => {
    return (
        <div className="absolute top-4 left-4 flex gap-2 z-10 flex-wrap">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onExpandAll();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium shadow-lg"
            >
                👆 Expand All
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onCollapseAll();
                }}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm font-medium shadow-lg"
            >
                📦 Collapse All
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onFitView();
                }}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm font-medium shadow-lg"
            >
                🎯 Fit View
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onAddNode();
                }}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 text-sm font-medium shadow-lg"
            >
                ➕ Add Node
            </button>
            <button
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-lg"
            >
                📚 Full Documentation
            </button>
            <button
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium shadow-lg"
            >
                💾 Download
            </button>
        </div>
    );
};

export default ControlButtons;