
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StoredFile } from "@/components/files/FileList";

// Mock file data
const generateMockFiles = (): StoredFile[] => {
  return [
    {
      id: "file-1",
      name: "project_report.pdf",
      size: 2.8 * 1024 * 1024,
      type: "application/pdf",
      uploadDate: new Date(2023, 11, 10),
      replicas: 3,
      status: "available",
      nodeIds: ["node-1", "node-2", "node-4"],
    },
    {
      id: "file-2",
      name: "database_backup.sql",
      size: 155 * 1024 * 1024,
      type: "application/sql",
      uploadDate: new Date(2023, 11, 15),
      replicas: 3,
      status: "available",
      nodeIds: ["node-1", "node-3", "node-7"],
    },
    {
      id: "file-3",
      name: "product_image.jpg",
      size: 1.2 * 1024 * 1024,
      type: "image/jpeg",
      uploadDate: new Date(2023, 12, 5),
      replicas: 2,
      status: "available",
      nodeIds: ["node-2", "node-8"],
    },
    {
      id: "file-4",
      name: "system_logs.txt",
      size: 420 * 1024,
      type: "text/plain",
      uploadDate: new Date(2023, 12, 12),
      replicas: 3,
      status: "available",
      nodeIds: ["node-4", "node-7", "node-8"],
    },
    {
      id: "file-5",
      name: "application_archive.zip",
      size: 35.7 * 1024 * 1024,
      type: "application/zip",
      uploadDate: new Date(2023, 12, 20),
      replicas: 3,
      status: "syncing",
      nodeIds: ["node-1", "node-2", "node-6"],
    },
    {
      id: "file-6",
      name: "user_data.json",
      size: 1.5 * 1024 * 1024,
      type: "application/json",
      uploadDate: new Date(2024, 0, 5),
      replicas: 3,
      status: "available",
      nodeIds: ["node-1", "node-4", "node-7"],
    },
    {
      id: "file-7",
      name: "presentation.pptx",
      size: 8.2 * 1024 * 1024,
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      uploadDate: new Date(2024, 0, 10),
      replicas: 2,
      status: "degraded",
      nodeIds: ["node-3", "node-4"],
    },
    {
      id: "file-8",
      name: "backup.img",
      size: 2.1 * 1024 * 1024 * 1024,
      type: "application/octet-stream",
      uploadDate: new Date(2024, 0, 15),
      replicas: 2,
      status: "available",
      nodeIds: ["node-2", "node-8"],
    },
  ];
};

export function useFiles() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Simulate API fetch delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Set mock data
        setFiles(generateMockFiles());
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const uploadFile = async (file: File) => {
    try {
      // Simulate API upload delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create new file entry
      const newFile: StoredFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadDate: new Date(),
        replicas: 3,
        status: "syncing",
        nodeIds: ["node-1", "node-2", "node-7"],
      };
      
      // Add to files state
      setFiles(prevFiles => [newFile, ...prevFiles]);
      
      // Simulate syncing to available after delay
      setTimeout(() => {
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === newFile.id ? { ...f, status: "available" } : f
          )
        );
      }, 5000);
      
      toast.success(`File ${file.name} uploaded successfully`);
      return newFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error(`Upload failed: ${errorMessage}`);
      throw err;
    }
  };

  const downloadFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) {
      toast.error("File not found");
      return;
    }
    
    // Simulate download
    toast.success(`Downloading ${file.name}...`);
  };

  const deleteFile = (id: string) => {
    try {
      // Remove file from state
      setFiles(prevFiles => prevFiles.filter(f => f.id !== id));
      
      toast.success("File deleted successfully");
    } catch (err) {
      toast.error(`Failed to delete file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return {
    files,
    loading,
    error,
    uploadFile,
    downloadFile,
    deleteFile,
  };
}
