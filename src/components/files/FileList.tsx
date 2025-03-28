
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Download, 
  Trash2, 
  HardDriveIcon, 
  CheckCircle2,
  Clock,
  FileIcon,
  ImageIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileVideoIcon,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  replicas: number;
  status: "available" | "syncing" | "degraded";
  nodeIds: string[];
}

interface FileListProps {
  files: StoredFile[];
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onDownload, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Filter files based on search term
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get file icon based on mimetype
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (type.startsWith("audio/")) return <FileAudioIcon className="w-4 h-4" />;
    if (type.startsWith("video/")) return <FileVideoIcon className="w-4 h-4" />;
    if (type.includes("zip") || type.includes("tar") || type.includes("gzip")) 
      return <FileArchiveIcon className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  // Get status config
  const getStatusConfig = (status: StoredFile["status"]) => {
    switch (status) {
      case "available":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          label: "Available",
        };
      case "syncing":
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          label: "Syncing",
        };
      case "degraded":
        return {
          icon: <HardDriveIcon className="w-3.5 h-3.5" />,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          label: "Degraded",
        };
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-border/50"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Sort by name</DropdownMenuItem>
            <DropdownMenuItem>Sort by date</DropdownMenuItem>
            <DropdownMenuItem>Sort by size</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Filter by type</DropdownMenuItem>
            <DropdownMenuItem>Filter by status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Uploaded</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Replicas</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <AnimatePresence>
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => {
                    const statusConfig = getStatusConfig(file.status);
                    
                    return (
                      <motion.tr 
                        key={file.id}
                        initial={{ opacity: 0, backgroundColor: "var(--background-highlight)" }}
                        animate={{ opacity: 1, backgroundColor: "transparent" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedFile(file.id !== selectedFile ? file.id : null)}
                        className={cn(
                          "hover:bg-muted/30 transition-colors cursor-pointer",
                          selectedFile === file.id && "bg-muted/50"
                        )}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-1.5 rounded-md bg-primary/5 mr-3">
                              {getFileIcon(file.type)}
                            </div>
                            <div className="truncate max-w-[200px]">
                              <div className="font-medium text-sm">{file.name}</div>
                              <div className="text-xs text-muted-foreground">{file.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {format(file.uploadDate, "MMM dd, yyyy")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div 
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center space-x-1",
                              statusConfig.bgColor,
                              statusConfig.color
                            )}
                          >
                            {statusConfig.icon}
                            <span>{statusConfig.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <Badge variant="outline" className="bg-primary/5">
                              {file.replicas} {file.replicas === 1 ? "copy" : "copies"}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDownload(file.id);
                                    }}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download file</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive/70 hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDelete(file.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete file</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                        <h3 className="font-medium text-lg">No files found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm ? "Try a different search term" : "Upload a file to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileList;
