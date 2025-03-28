
import React from "react";
import { motion } from "framer-motion";
import NodeCard, { NodeStatus } from "./NodeCard";

export interface Node {
  id: string;
  name: string;
  status: NodeStatus;
  usedStorage: number;
  totalStorage: number;
  filesCount: number;
  uptimeHours: number;
  ipAddress: string;
}

interface NodeGridProps {
  nodes: Node[];
  onRestartNode: (id: string) => void;
}

const NodeGrid: React.FC<NodeGridProps> = ({ nodes, onRestartNode }) => {
  // Grid animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {nodes.map((node) => (
        <NodeCard
          key={node.id}
          id={node.id}
          name={node.name}
          status={node.status}
          usedStorage={node.usedStorage}
          totalStorage={node.totalStorage}
          filesCount={node.filesCount}
          uptimeHours={node.uptimeHours}
          ipAddress={node.ipAddress}
          onRestart={onRestartNode}
        />
      ))}
    </motion.div>
  );
};

export default NodeGrid;
