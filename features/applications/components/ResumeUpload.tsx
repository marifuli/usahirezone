"use client";

import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { uploadResume } from "@/lib/firebase/storage";

interface ResumeUploadProps {
  onUpload: (url: string) => void;
  value?: string;
}

export function ResumeUpload({ onUpload, value }: ResumeUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or DOC/DOCX file.");
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const uploaderId = user?.uid || `guest_${Date.now()}`;
      const url = await uploadResume(uploaderId, file);
      onUpload(url);
    } catch {
      setError("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Resume</Label>
      {value ? (
        <div className="flex items-center justify-between rounded-md border p-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Resume uploaded</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpload("")}
            aria-label="Remove resume"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          disabled={uploading}
          className="cursor-pointer"
        />
      )}
      {uploading && (
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Upload className="h-4 w-4 animate-pulse" />
          Uploading...
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}