import { Sun } from 'lucide-react';
import React from 'react';

const SidePanel = ({ node, onClose }) => {
    if (!node) return null;

    return (
        <div className="h-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white overflow-y-auto">
            <div className="flex justify-between items-start mb-4 p-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-blue-100">{node.title}</h3>
                    <div>
                        <h4 className="text-sm font-semibold uppercase mb-2">SUMMARY:</h4>
                        <p className="text-white leading-relaxed">{node.description || node.summary}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors">
                        <Sun className="w-5 h-5 text-gray-900" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default SidePanel;