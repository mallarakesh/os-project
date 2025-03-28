import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Upload, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  UploadCloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setStatus("uploading");
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 150);
    
    try {
      await onUpload(file);
      setTimeout(() => {
        setStatus("success");
      }, 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setProgress(0);
    setStatus("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const statusConfig = {
    idle: {
      icon: <Upload className="w-5 h-5" />,
      color: "text-primary",
      title: "Ready to upload",
    },
    uploading: {
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
      color: "text-primary",
      title: "Uploading...",
    },
    success: {
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-green-500",
      title: "Upload successful",
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-500",
      title: "Upload failed",
    },
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "w-full border-2 border-dashed rounded-lg p-6 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          file ? "bg-secondary/50" : "bg-transparent"
        )}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-4",
              status === "idle" ? "bg-primary/10" : 
              status === "uploading" ? "bg-primary/10" :
              status === "success" ? "bg-green-500/10" : 
              "bg-red-500/10"
            )}
          >
            {file ? (
              <span className={cn("text-2xl", statusConfig[status].color)}>
                {statusConfig[status].icon}
              </span>
            ) : (
              <UploadCloud className="w-8 h-8 text-primary/70" />
            )}
          </motion.div>
          
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3 w-full"
              >
                <div>
                  <h3 className={cn("font-medium text-lg", statusConfig[status].color)}>
                    {statusConfig[status].title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 break-all">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
                
                {status === "uploading" && (
                  <div className="w-full space-y-1">
                    <Progress value={progress} className="h-1" />
                    <p className="text-xs text-right text-muted-foreground">
                      {progress}%
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  {status === "idle" && (
                    <Button 
                      onClick={handleUpload} 
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  )}
                  
                  {status !== "uploading" && (
                    <Button 
                      variant="outline" 
                      onClick={handleReset}
                      className={status === "idle" ? "flex-1" : "w-full"}
                    >
                      {status === "idle" ? "Cancel" : "Upload Another File"}
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div>
                  <h3 className="font-medium text-lg">Upload a file</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag and drop a file here, or click to select a file
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select File
                </Button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
