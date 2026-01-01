import { Plus, Save, X } from "lucide-react";
import { useState } from "react";

const EditModal = ({ node, onSave, onClose }) => {
    const [editedNode, setEditedNode] = useState(node);
    const [newChildTitle, setNewChildTitle] = useState('');

    if (!node) return null;

    const handleSave = () => {
        onSave(editedNode);
        onClose();
    };

    const handleAddChild = () => {
        if (!newChildTitle.trim()) return;

        const newChild = {
            id: `node_${Date.now()}`,
            title: newChildTitle,
            summary: 'New node summary',
            description: 'Add description here',
            color: editedNode.level === 0 ? '#86EFAC' : '#FCD34D',
            children: []
        };

        setEditedNode({
            ...editedNode,
            children: [...(editedNode.children || []), newChild]
        });
        setNewChildTitle('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Node</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={editedNode.title}
                            onChange={(e) => setEditedNode({ ...editedNode, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                        <input
                            type="text"
                            value={editedNode.summary}
                            onChange={(e) => setEditedNode({ ...editedNode, summary: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={editedNode.description}
                            onChange={(e) => setEditedNode({ ...editedNode, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Add Child Node</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newChildTitle}
                                onChange={(e) => setNewChildTitle(e.target.value)}
                                placeholder="New child node title"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddChild()}
                            />
                            <button
                                onClick={handleAddChild}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                    </div>

                    {editedNode.children && editedNode.children.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Child Nodes</label>
                            <div className="space-y-2">
                                {editedNode.children.map((child, index) => (
                                    <div key={child.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                                        <span className="flex-1 text-sm">{child.title}</span>
                                        <button
                                            onClick={() => {
                                                const newChildren = editedNode.children.filter((_, i) => i !== index);
                                                setEditedNode({ ...editedNode, children: newChildren });
                                            }}
                                            className="text-red-600 hover:text-red-700 text-xs"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;