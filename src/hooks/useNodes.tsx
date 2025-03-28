
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Node } from "@/components/nodes/NodeGrid";

// Mock data generation
const generateMockNodes = (): Node[] => {
  return [
    {
      id: "node-1",
      name: "Node A",
      status: "online",
      usedStorage: 128,
      totalStorage: 512,
      filesCount: 42,
      uptimeHours: 124,
      ipAddress: "192.168.1.101",
    },
    {
      id: "node-2",
      name: "Node B",
      status: "online",
      usedStorage: 320,
      totalStorage: 512,
      filesCount: 78,
      uptimeHours: 96,
      ipAddress: "192.168.1.102",
    },
    {
      id: "node-3",
      name: "Node C",
      status: "degraded",
      usedStorage: 115,
      totalStorage: 256,
      filesCount: 36,
      uptimeHours: 62,
      ipAddress: "192.168.1.103",
    },
    {
      id: "node-4",
      name: "Node D",
      status: "online",
      usedStorage: 200,
      totalStorage: 512,
      filesCount: 51,
      uptimeHours: 120,
      ipAddress: "192.168.1.104",
    },
    {
      id: "node-5",
      name: "Node E",
      status: "offline",
      usedStorage: 0,
      totalStorage: 512,
      filesCount: 0,
      uptimeHours: 0,
      ipAddress: "192.168.1.105",
    },
    {
      id: "node-6",
      name: "Node F",
      status: "syncing",
      usedStorage: 98,
      totalStorage: 256,
      filesCount: 19,
      uptimeHours: 24,
      ipAddress: "192.168.1.106",
    },
    {
      id: "node-7",
      name: "Node G",
      status: "online",
      usedStorage: 156,
      totalStorage: 256,
      filesCount: 29,
      uptimeHours: 72,
      ipAddress: "192.168.1.107",
    },
    {
      id: "node-8",
      name: "Node H",
      status: "online",
      usedStorage: 76,
      totalStorage: 256,
      filesCount: 14,
      uptimeHours: 48,
      ipAddress: "192.168.1.108",
    },
  ];
};

export function useNodes() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        // Simulate API fetch delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Set mock data
        setNodes(generateMockNodes());
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const restartNode = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update node status
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === id 
            ? { 
                ...node, 
                status: "online",
                uptimeHours: 0 
              } 
            : node
        )
      );
      
      toast.success(`Node ${id} restarted successfully`);
    } catch (err) {
      toast.error(`Failed to restart node: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Get node health statistics
  const getNodeStats = () => {
    const totalNodes = nodes.length;
    const activeNodes = nodes.filter(node => node.status === "online").length;
    
    const totalStorage = nodes.reduce((sum, node) => sum + node.totalStorage, 0);
    const usedStorage = nodes.reduce((sum, node) => sum + node.usedStorage, 0);
    
    const totalFiles = nodes.reduce((sum, node) => sum + node.filesCount, 0);
    
    // Calculate availability based on nodes status
    const availability = totalNodes > 0 
      ? ((activeNodes / totalNodes) * 100 * 0.5) + 50 // Ensure minimum 50% availability
      : 0;
    
    // Check if any node is syncing
    const isResyncing = nodes.some(node => node.status === "syncing");
    
    return {
      totalNodes,
      activeNodes,
      totalStorage,
      usedStorage,
      totalFiles,
      availability,
      isResyncing,
    };
  };

  return { 
    nodes, 
    loading, 
    error, 
    restartNode,
    getNodeStats
  };
}
