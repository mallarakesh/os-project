
import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { 
  HardDrive, 
  Upload, 
  Download, 
  FileText, 
  Activity,
  RefreshCw,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TransitionLayout from "@/components/ui/TransitionLayout";
import SystemHealth from "@/components/dashboard/SystemHealth";
import NodeCard from "@/components/nodes/NodeCard";
import { useNodes } from "@/hooks/useNodes";
import { useFiles } from "@/hooks/useFiles";
import { useNavigate } from "react-router-dom";

// Mock chart data
const generateActivityData = () => {
  const result = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - i);
    
    result.push({
      time: timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      uploads: Math.floor(Math.random() * 5),
      downloads: Math.floor(Math.random() * 8),
      operations: Math.floor(Math.random() * 10 + 5),
    });
  }
  
  return result;
};

const activityData = generateActivityData();

const Index = () => {
  const { nodes, loading: nodesLoading, restartNode, getNodeStats } = useNodes();
  const { files, loading: filesLoading } = useFiles();
  const navigate = useNavigate();
  
  // Get the most active nodes
  const activeNodes = [...nodes]
    .sort((a, b) => b.filesCount - a.filesCount)
    .slice(0, 3);
  
  // Get the most recent files
  const recentFiles = [...files]
    .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
    .slice(0, 3);
  
  // Get node statistics
  const nodeStats = getNodeStats();
  
  return (
    <TransitionLayout>
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            Distributed File System
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground"
          >
            Monitor your distributed storage with fault tolerance and high availability.
          </motion.p>
        </div>

        {/* System Health Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {nodesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-[150px] w-full" />
                ))}
              </div>
            </div>
          ) : (
            <SystemHealth
              totalNodes={nodeStats.totalNodes}
              activeNodes={nodeStats.activeNodes}
              totalFiles={nodeStats.totalFiles}
              replicationFactor={3}
              storageUsed={nodeStats.usedStorage}
              storageTotal={nodeStats.totalStorage}
              availability={nodeStats.availability}
              isResyncing={nodeStats.isResyncing}
            />
          )}
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">System Activity</h2>
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activityData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }} 
                      stroke="#9ca3af"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      stroke="#9ca3af"
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "0.5rem",
                        border: "1px solid #e5e7eb"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="uploads" 
                      name="Uploads"
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="downloads" 
                      name="Downloads"
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="operations" 
                      name="Operations"
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Nodes and Recent Files */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Nodes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Active Nodes</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/nodes")}
              >
                <HardDrive className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {nodesLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-[120px] w-full" />
                ))
              ) : activeNodes.length > 0 ? (
                activeNodes.map(node => (
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
                    onRestart={restartNode}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active nodes found.
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Files */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recent Files</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/files")}
              >
                <FileText className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {filesLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-[80px] w-full" />
                ))
              ) : recentFiles.length > 0 ? (
                recentFiles.map(file => {
                  // Format file size
                  const formatFileSize = (bytes: number) => {
                    if (bytes < 1024) return `${bytes} B`;
                    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
                    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
                    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
                  };

                  // Status icon mapping
                  const statusIcon = {
                    "available": <Activity className="w-4 h-4 text-green-500" />,
                    "syncing": <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />,
                    "degraded": <Clock className="w-4 h-4 text-amber-500" />,
                  };

                  return (
                    <Card 
                      key={file.id} 
                      className="overflow-hidden border-border/60 hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "p-2 rounded-md",
                              file.type.startsWith("image/") ? "bg-purple-500/10" : 
                              file.type.includes("pdf") ? "bg-red-500/10" :
                              file.type.includes("zip") ? "bg-amber-500/10" :
                              "bg-primary/10"
                            )}>
                              <FileText className={cn(
                                "w-5 h-5",
                                file.type.startsWith("image/") ? "text-purple-500" : 
                                file.type.includes("pdf") ? "text-red-500" :
                                file.type.includes("zip") ? "text-amber-500" :
                                "text-primary"
                              )} />
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium truncate max-w-[180px]">
                                {file.name}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span className="mr-3">{formatFileSize(file.size)}</span>
                                <div className="flex items-center">
                                  {statusIcon[file.status]}
                                  <span className="ml-1 capitalize">{file.status}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No files have been uploaded yet.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate("/files")}
            >
              <Upload className="w-6 h-6" />
              <span>Upload Files</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={() => navigate("/nodes")}
            >
              <HardDrive className="w-6 h-6" />
              <span>Manage Nodes</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={() => navigate("/files")}
            >
              <FileText className="w-6 h-6" />
              <span>Browse Files</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </TransitionLayout>
  );
};

export default Index;
