"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface AvatarUploadProps {
  value?: string | null;
  onChange: (file: File | null) => void;
  apiUrl?: string;
  onPreviewChange?: (open: boolean) => void;
}

export default function AvatarUpload({ value, onChange, apiUrl, onPreviewChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getAvatarUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${apiUrl}${url}`;
  };

  const avatarSrc = preview || getAvatarUrl(value) || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    onPreviewChange?.(previewOpen);
  }, [previewOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setPreviewOpen(false);
      }
    };

    if (previewOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [previewOpen]);

  return (
    <>
      <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
      {avatarSrc && (
        <div className="relative w-fit mt-3">
          <img
            src={avatarSrc}
            alt="avatar"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewOpen(true);
            }}
            className="
              w-20 h-20 rounded-xl object-cover 
              border shadow-md 
              cursor-pointer 
              hover:opacity-80 
              transition duration-200
            "
          />

          <button
            type="button"
            onClick={handleRemove}
            className="
              absolute -top-2 -right-2
              bg-black/80 hover:bg-black
              text-white
              rounded-full p-1.5
              transition
            "
          >
            <X size={14} />
          </button>
        </div>
      )}

      {previewOpen &&
        avatarSrc &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setPreviewOpen(false)}
          >
            <button
              type="button"
              className="absolute top-6 right-6 w-12 h-12 z-[100001] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition pointer-events-auto cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewOpen(false);
              }}
            >
              <X size={28} />
            </button>

            <img
              src={avatarSrc}
              alt="preview"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
