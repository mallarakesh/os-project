
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  FileText,
  HardDrive,
  Database
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TransitionLayout from "@/components/ui/TransitionLayout";
import FileUpload from "@/components/files/FileUpload";
import FileList from "@/components/files/FileList";
import { useFiles } from "@/hooks/useFiles";
import { useNodes } from "@/hooks/useNodes";

const Files = () => {
  const { files, loading, uploadFile, downloadFile, deleteFile } = useFiles();
  const { getNodeStats } = useNodes();
  const [activeTab, setActiveTab] = useState("browse");
  
  const nodeStats = getNodeStats();
  
  // Calculate storage stats
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const formatTotalSize = () => {
    if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} KB`;
    if (totalSize < 1024 * 1024 * 1024) return `${(totalSize / 1024 / 1024).toFixed(1)} MB`;
    return `${(totalSize / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };
  
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
            File Management
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground"
          >
            Upload, download and manage files in your distributed storage system.
          </motion.p>
        </div>
        
        {/* Storage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Files Card */}
          <Card className="border-border/60 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                Files
              </CardTitle>
              <CardDescription>
                Total files in system
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center">
                {loading ? (
                  <Skeleton className="h-8 w-16 mx-auto" />
                ) : (
                  <div className="text-4xl font-bold mb-2">
                    {files.length}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Distributed across {nodeStats.activeNodes} nodes
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Storage Card */}
          <Card className="border-border/60 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Database className="w-4 h-4 mr-2 text-primary" />
                Storage
              </CardTitle>
              <CardDescription>
                Total data stored
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center">
                {loading ? (
                  <Skeleton className="h-8 w-28 mx-auto" />
                ) : (
                  <div className="text-4xl font-bold mb-2">
                    {formatTotalSize()}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Raw size without replication
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Replication Card */}
          <Card className="border-border/60 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <HardDrive className="w-4 h-4 mr-2 text-primary" />
                Replication
              </CardTitle>
              <CardDescription>
                Fault tolerance factor
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  3x
                </div>
                <div className="text-sm text-muted-foreground">
                  Each file stored on 3 nodes
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* File Management */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <Tabs 
            defaultValue="browse" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="browse" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Browse Files
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="browse" className="m-0">
                {loading ? (
                  <Skeleton className="h-[500px] w-full" />
                ) : (
                  <FileList 
                    files={files}
                    onDownload={downloadFile}
                    onDelete={deleteFile}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="upload" className="m-0">
                <div className="max-w-2xl mx-auto">
                  <Card className="border-border/60">
                    <CardHeader>
                      <CardTitle>Upload File</CardTitle>
                      <CardDescription>
                        Files will be distributed across multiple nodes with 3x replication
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileUpload onUpload={uploadFile} />
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Upload Guidelines</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                          <FileText className="h-3 w-3" />
                        </span>
                        <span>Files are automatically distributed across multiple nodes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                          <HardDrive className="h-3 w-3" />
                        </span>
                        <span>Each file is stored with 3x replication for fault tolerance</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                          <Database className="h-3 w-3" />
                        </span>
                        <span>Maximum file size: 2GB per file</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </TransitionLayout>
  );
};

export default Files;
