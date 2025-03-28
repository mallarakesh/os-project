
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  HardDrive, 
  FileText, 
  Database,
  Loader2,
  ShieldCheck,
  Network
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SystemHealthProps {
  totalNodes: number;
  activeNodes: number;
  totalFiles: number;
  replicationFactor: number;
  storageUsed: number;
  storageTotal: number;
  availability: number;
  isResyncing: boolean;
}

const SystemHealth: React.FC<SystemHealthProps> = ({
  totalNodes,
  activeNodes,
  totalFiles,
  replicationFactor,
  storageUsed,
  storageTotal,
  availability,
  isResyncing,
}) => {
  const storagePercentage = Math.round((storageUsed / storageTotal) * 100);
  const nodesPercentage = Math.round((activeNodes / totalNodes) * 100);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">System Overview</h2>
        {isResyncing && (
          <div className="flex items-center text-blue-500 animate-pulse">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span className="text-sm font-medium">Resyncing...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Database className="w-4 h-4 mr-2 text-primary" />
                Storage
              </CardTitle>
              <CardDescription>
                System storage usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">
                    {storagePercentage}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {storageUsed.toFixed(1)} GB / {storageTotal} GB
                  </div>
                </div>
                <Progress 
                  value={storagePercentage} 
                  className={cn(
                    "h-2",
                    storagePercentage > 90 ? "text-red-500" : 
                    storagePercentage > 75 ? "text-amber-500" : 
                    "text-primary"
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <HardDrive className="w-4 h-4 mr-2 text-primary" />
                Nodes
              </CardTitle>
              <CardDescription>
                Active node status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">
                    {activeNodes}/{totalNodes}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {nodesPercentage}% online
                  </div>
                </div>
                <Progress 
                  value={nodesPercentage} 
                  className={cn(
                    "h-2",
                    nodesPercentage < 50 ? "text-red-500" : 
                    nodesPercentage < 75 ? "text-amber-500" : 
                    "text-green-500"
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="overflow-hidden border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                Files
              </CardTitle>
              <CardDescription>
                Distributed file count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {totalFiles}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Network className="w-4 h-4 mr-1.5" />
                    {replicationFactor}x replication
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Each file is stored on {replicationFactor} different nodes for redundancy.
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="overflow-hidden border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Activity className="w-4 h-4 mr-2 text-primary" />
                Availability
              </CardTitle>
              <CardDescription>
                System health status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">
                    {availability.toFixed(2)}%
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 bg-green-500/10 text-green-500">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    <span>Protected</span>
                  </div>
                </div>
                <Progress 
                  value={availability} 
                  className={cn(
                    "h-2",
                    availability < 99 ? "text-red-500" : 
                    availability < 99.9 ? "text-amber-500" : 
                    "text-green-500"
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemHealth;
