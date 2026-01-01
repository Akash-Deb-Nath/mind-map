import { useState } from 'react'
import data from '../public/demoData.json'
import MindmapCanvas from './components/MindmapCanvas';
import SidePanel from './components/SidePanel';
import EditModal from './utility/editModal';

function App() {
  const [mindmapData, setMindmapData] = useState(data);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const updateNodeInTree = (tree, updatedNode) => {
    if (tree.id === updatedNode.id) {
      return { ...tree, ...updatedNode, children: updatedNode.children || tree.children };
    }

    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map((child) => updateNodeInTree(child, updatedNode)),
      };
    }

    return tree;
  };

  const handleSaveNode = (updatedNode) => {
    const updatedTree = updateNodeInTree(mindmapData, updatedNode);
    setMindmapData(updatedTree);
    if (selectedNode?.id === updatedNode.id) {
      setSelectedNode(updatedNode);
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowDetails(true);
  };

  return (
    <div className="h-screen flex bg-gray-800">
      <div className="flex-1 relative">
        <MindmapCanvas
          data={mindmapData}
          onNodeClick={handleNodeClick}
          selectedNode={selectedNode}
          onNodeEdit={setEditingNode}
        />
      </div>

      {showDetails && (
        <div className="w-96">
          <SidePanel
            node={selectedNode || mindmapData}
            onClose={() => {
              setSelectedNode(null);
              setShowDetails(false);
            }}
          />
        </div>
      )}

      {editingNode && (
        <EditModal
          node={editingNode}
          onSave={handleSaveNode}
          onClose={() => setEditingNode(null)}
          allData={mindmapData}
          setAllData={setMindmapData}
        />
      )}
    </div>
  );
}

export default App
