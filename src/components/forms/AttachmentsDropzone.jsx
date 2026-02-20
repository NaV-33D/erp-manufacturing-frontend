import React, { useRef, useState } from "react";
import FormCard from "./FormCard";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  Plus,
} from "lucide-react";
import uploadToAzureStorage from "../../../constant/uploadToAzureStorage";

const ACCEPTED_MIMES = ["application/pdf", "image/png", "image/jpeg"];
const ACCEPTED_EXT = /\.(pdf|png|jpe?g)$/i;

const isAllowed = (file) =>
  ACCEPTED_MIMES.includes(file.type) && ACCEPTED_EXT.test(file.name);

const bytesToKB = (b) => `${Math.round((b || 0) / 1024)} KB`;

const safeName = (name = "") =>
  name.replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_");

const AttachmentsDropzone = ({
  value = [],
  onChange,
  maxFiles = 10,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickFiles = () => {
    if (uploading) return;
    inputRef.current?.click();
  };

  const addFiles = async (files) => {
    const fileArr = Array.from(files || []);
    if (fileArr.length === 0) return;

    const valid = fileArr.filter(isAllowed);
    const spaceLeft = Math.max(0, maxFiles - value.length);
    const toUpload = valid.slice(0, spaceLeft);
    if (toUpload.length === 0) return;

    try {
      setUploading(true);

      const uploaded = await Promise.all(
        toUpload.map(async (f) => {
          const blobName = `attachments/${Date.now()}-${safeName(f.name)}`;

          const url = await uploadToAzureStorage(f, blobName);

          return {
            name: f.name,
            type: f.type,
            size: f.size,
            url,
          };
        }),
      );

      onChange?.([...(value || []), ...uploaded]);
    } catch (e) {
      console.error("Upload failed", e);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    await addFiles(e.dataTransfer.files);
  };

  const removeAt = (idx) => {
    const next = value.filter((_, i) => i !== idx);
    onChange?.(next);
  };

  const hasFiles = value?.length > 0;

  return (
    <FormCard title="Attachments">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
        onChange={(e) => addFiles(e.target.files)}
      />

      {hasFiles ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {value.length} file(s) attached
            </div>

            <button
              type="button"
              onClick={pickFiles}
              disabled={uploading || value.length >= maxFiles}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 disabled:opacity-50"
            >
              <Plus size={16} />
              {uploading ? "Uploading..." : "Add more"}
            </button>
          </div>

          <div className="space-y-2">
            {value.map((f, idx) => {
              const isPdf = f.type === "application/pdf";
              const isImg = f.type?.startsWith("image/");

              return (
                <div
                  key={`${f.name}-${idx}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div className="h-12 w-12 rounded-md bg-gray-50 border flex items-center justify-center overflow-hidden">
                    {isImg ? (
                      <img
                        src={f.url}
                        alt={f.name}
                        className="h-full w-full object-cover"
                      />
                    ) : isPdf ? (
                      <FileText size={18} className="text-gray-700" />
                    ) : (
                      <ImageIcon size={18} className="text-gray-700" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm font-medium text-blue-600 hover:underline truncate"
                      title={f.name}
                    >
                      {f.name}
                    </a>
                    <div className="text-xs text-gray-500">
                      {bytesToKB(f.size)}{" "}
                      <span className="text-gray-300">•</span>{" "}
                      {isPdf ? "PDF" : "Image"}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="text-gray-400 hover:text-red-600"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={onDrop}
          className={[
            "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition",
            dragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-gray-50",
            className,
          ].join(" ")}
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
            <UploadCloud className="text-blue-600" size={18} />
          </div>

          <button
            type="button"
            onClick={pickFiles}
            disabled={uploading}
            className="text-blue-600 font-medium"
          >
            {uploading ? "Uploading..." : "Click to upload"}
          </button>

          <div className="text-gray-500 text-sm">or drag and drop</div>

          <div className="text-gray-400 text-xs mt-2">
            Packing lists, invoices, or e-way bills (PDF, PNG, JPG)
          </div>
        </div>
      )}
    </FormCard>
  );
};

export default AttachmentsDropzone;
