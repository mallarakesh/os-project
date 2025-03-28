
import React, { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { 
  RefreshCw, 
  Search, 
  HardDrive,
  Plus,
  Server,
  ShieldAlert,
  ShieldCheck,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import TransitionLayout from "@/components/ui/TransitionLayout";
import NodeGrid from "@/components/nodes/NodeGrid";
import { useNodes } from "@/hooks/useNodes";

const Nodes = () => {
  const { nodes, loading, restartNode, getNodeStats } = useNodes();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const nodeStats = getNodeStats();
  
  // Filter nodes based on search and active tab
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.ipAddress.includes(searchTerm);
      
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && node.status === activeTab;
  });
  
  // Node status count for chart
  const statusCounts = {
    online: nodes.filter(node => node.status === "online").length,
    offline: nodes.filter(node => node.status === "offline").length,
    degraded: nodes.filter(node => node.status === "degraded").length,
    syncing: nodes.filter(node => node.status === "syncing").length,
  };
  
  const chartData = [
    { name: "Online", value: statusCounts.online, color: "#10b981" },
    { name: "Offline", value: statusCounts.offline, color: "#ef4444" },
    { name: "Degraded", value: statusCounts.degraded, color: "#f59e0b" },
    { name: "Syncing", value: statusCounts.syncing, color: "#3b82f6" },
  ];
  
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
            Node Management
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground"
          >
            Monitor and manage storage nodes in your distributed file system.
          </motion.p>
        </div>
        
        {/* Dashboard Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Node Status Card */}
          <Card className="border-border/60 md:col-span-2 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Node Status</CardTitle>
              <CardDescription>
                Current health of storage nodes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="h-[180px] w-[180px]">
                  {loading ? (
                    <Skeleton className="h-full w-full rounded-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth={2}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            borderRadius: "0.5rem",
                            border: "1px solid #e5e7eb"
                          }}
                          formatter={(value) => [`${value} nodes`, ""]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {chartData.map((status) => (
                    <div key={status.name} className="flex flex-col">
                      <div className="flex items-center space-x-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-sm font-medium">{status.name}</span>
                      </div>
                      <p className="text-2xl font-bold">{status.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((status.value / nodes.length) * 100) || 0}% of nodes
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* System Health Card */}
          <Card className="border-border/60 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">System Health</CardTitle>
              <CardDescription>
                Fault tolerance status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                      {nodeStats.availability > 90 ? (
                        <ShieldCheck className="w-12 h-12 text-green-500" />
                      ) : (
                        <ShieldAlert className="w-12 h-12 text-amber-500" />
                      )}
                    </motion.div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {nodeStats.availability.toFixed(2)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    System availability
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold">
                      {nodes.length > 0 ? nodeStats.activeNodes : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active nodes
                    </p>
                  </div>
                  <div>
                    <div className="text-xl font-bold">3x</div>
                    <p className="text-xs text-muted-foreground">
                      Replication factor
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Nodes List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search nodes by name or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="shrink-0">
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button className="flex items-center gap-2 shrink-0">
                <PlusCircle className="h-4 w-4" />
                <span>Add Node</span>
              </Button>
            </div>
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="relative">
                All
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {nodes.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="online" className="relative">
                Online
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {statusCounts.online}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="offline" className="relative">
                Offline
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {statusCounts.offline}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="degraded" className="relative">
                Degraded
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {statusCounts.degraded}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="syncing" className="relative">
                Syncing
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {statusCounts.syncing}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array(8).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full" />
                  ))}
                </div>
              ) : filteredNodes.length > 0 ? (
                <NodeGrid nodes={filteredNodes} onRestartNode={restartNode} />
              ) : (
                <div className="text-center py-16">
                  <Server className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No nodes found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? "Try a different search term or filter" 
                      : "Add a node to get started"}
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Node
                  </Button>
                </div>
              )}
            </div>
          </Tabs>
        </motion.div>
      </div>
    </TransitionLayout>
  );
};

export default Nodes;
