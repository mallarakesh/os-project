
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  HardDrive, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  RefreshCw,
  Loader2,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

export type NodeStatus = "online" | "offline" | "degraded" | "syncing";

interface NodeCardProps {
  id: string;
  name: string;
  status: NodeStatus;
  usedStorage: number;
  totalStorage: number;
  filesCount: number;
  uptimeHours: number;
  ipAddress: string;
  onRestart: (id: string) => void;
}

const NodeCard: React.FC<NodeCardProps> = ({
  id,
  name,
  status,
  usedStorage,
  totalStorage,
  filesCount,
  uptimeHours,
  ipAddress,
  onRestart,
}) => {
  const [isRestarting, setIsRestarting] = useState(false);

  // Status icon mapping
  const statusConfig = {
    online: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      label: "Online",
    },
    offline: {
      icon: <XCircle className="w-4 h-4" />,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      label: "Offline",
    },
    degraded: {
      icon: <AlertCircle className="w-4 h-4" />,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      label: "Degraded",
    },
    syncing: {
      icon: <RefreshCw className="w-4 h-4" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      label: "Syncing",
    },
  };

  const storagePercentage = Math.round((usedStorage / totalStorage) * 100);
  const storageLabel = `${usedStorage} GB / ${totalStorage} GB`;

  const handleRestart = () => {
    setIsRestarting(true);
    onRestart(id);
    // Simulate restart time
    setTimeout(() => setIsRestarting(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="glass-card rounded-lg overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-primary/5 mr-3">
              <HardDrive className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{name}</h3>
              <div className="text-xs text-muted-foreground">{ipAddress}</div>
            </div>
          </div>

          <div 
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1",
              statusConfig[status].bgColor,
              statusConfig[status].color
            )}
          >
            {statusConfig[status].icon}
            <span>{statusConfig[status].label}</span>
          </div>
        </div>

        <div className="space-y-3 mb-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Storage</span>
              <span className="text-xs font-medium">{storageLabel}</span>
            </div>
            <Progress 
              value={storagePercentage} 
              className={cn(
                "h-1.5",
                storagePercentage > 90 ? "text-red-500" : 
                storagePercentage > 75 ? "text-amber-500" : 
                "text-primary"
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Files</span>
              <span className="font-medium">{filesCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Uptime</span>
              <span className="font-medium">{uptimeHours} hrs</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  disabled={isRestarting}
                  onClick={handleRestart}
                >
                  {isRestarting ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                  )}
                  Restart
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Restart node {name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  <BarChart className="w-4 h-4 mr-1.5" />
                  Details
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View detailed statistics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
};

export default NodeCard;
