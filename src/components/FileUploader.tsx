"use client";

import { useState } from "react";
import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";

import {
  FileMetadata,
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { saveInitialFilesToLocalStorage } from "@/lib/utils";
import { uploadFiles } from "@/lib/uploadFiles";
import { toast } from "sonner";
import { randomBytes } from "crypto";

const isBrowser = typeof window !== "undefined";

const initialFiles: FileMetadata[] = isBrowser
  ? JSON.parse(localStorage.getItem("initialFiles")! || "[]")
  : [];

// It will update the initialFiles array after removing a file so it gives a nice clean UX
const updateInitialFilesArray = (
  fileId: string,
  initialFilesArray: FileMetadata[]
) => {
  const index = initialFilesArray.findIndex((file) => file.id === fileId);
  if (index !== -1) {
    initialFiles.splice(index, 1);
  }

  saveInitialFilesToLocalStorage(initialFiles);
};

const clearInitialFiles = () => {
  initialFiles.splice(0, initialFiles.length);
  saveInitialFilesToLocalStorage(initialFiles);
};

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const iconMap = {
    pdf: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes("pdf") ||
        name.endsWith(".pdf") ||
        type.includes("word") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx"),
    },
    archive: {
      icon: FileArchiveIcon,
      conditions: (type: string, name: string) =>
        type.includes("zip") ||
        type.includes("archive") ||
        name.endsWith(".zip") ||
        name.endsWith(".rar"),
    },
    excel: {
      icon: FileSpreadsheetIcon,
      conditions: (type: string, name: string) =>
        type.includes("excel") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx"),
    },
    video: {
      icon: VideoIcon,
      conditions: (type: string) => type.includes("video/"),
    },
    audio: {
      icon: HeadphonesIcon,
      conditions: (type: string) => type.includes("audio/"),
    },
    image: {
      icon: ImageIcon,
      conditions: (type: string) => type.startsWith("image/"),
    },
  };

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className="size-5 opacity-60" />;
    }
  }

  return <FileIcon className="size-5 opacity-60" />;
};

const getFilePreview = (file: {
  file: File | { type: string; name: string; url?: string };
}) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const renderImage = (src: string) => (
    <img
      src={src}
      alt={fileName}
      className="size-full rounded-t-[inherit] object-cover"
    />
  );

  return (
    <div className="bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]">
      {fileType.startsWith("image/") ? (
        file.file instanceof File ? (
          (() => {
            const previewUrl = URL.createObjectURL(file.file);
            return renderImage(previewUrl);
          })()
        ) : file.file.url ? (
          renderImage(file.file.url)
        ) : (
          <ImageIcon className="size-5 opacity-60" />
        )
      ) : (
        getFileIcon(file)
      )}
    </div>
  );
};

const addFilesToArray = (file: FileWithPreview) => {
  const fileObj = {
    name: file.file.name,
    size: file.file.size,
    type: file.file.type,
    url: file.preview ?? "",
    id: file.id,
  };

  initialFiles.push(fileObj);

  saveInitialFilesToLocalStorage(initialFiles);
};

// Type for tracking upload progress
type UploadProgress = {
  fileId: string;
  progress: number;
  completed: boolean;
};

// Function to simulate file upload with more realistic timing and progress
// Updated simulateUpload that only handles increments until stopped
function simulateUpload(
  totalBytes: number,
  onProgress: (progress: number) => void
) {
  let uploaded = 0;
  const speed = totalBytes / 50; // adjust for speed
  const interval = setInterval(() => {
    uploaded += speed;
    const progress = Math.min(Math.round((uploaded / totalBytes) * 100), 95);
    onProgress(progress);
  }, 100);

  // stop increments when real upload finishes
  return () => clearInterval(interval);
}

export default function FileUploader() {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
  const maxFiles = 6;

  // State to track upload progress for each file
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  // Function to handle newly added files
  // const handleFilesAdded = (addedFiles: FileWithPreview[]) => {
  //   // Initialize progress tracking for each new file
  //   const newProgressItems = addedFiles.map((file) => ({
  //     fileId: file.id,
  //     progress: 0,
  //     completed: false,
  //   }));

  //   // Add new progress items to state
  //   setUploadProgress((prev) => [...prev, ...newProgressItems]);

  //   // Store cleanup functions
  //   const cleanupFunctions: Array<() => void> = [];

  //   // Start simulated upload for each file
  //   addedFiles.forEach((file) => {
  //     const fileSize =
  //       file.file instanceof File ? file.file.size : file.file.size;

  //     // Save FIles to InitialFiles Array
  //     addFilesToArray(file);

  //     // Start the upload simulation and store the cleanup function
  //     const cleanup = simulateUpload(
  //       fileSize,
  //       // Progress callback
  //       (progress) => {
  //         setUploadProgress((prev) =>
  //           prev.map((item) =>
  //             item.fileId === file.id ? { ...item, progress } : item
  //           )
  //         );
  //       },
  //       // Complete callback
  //       () => {
  //         setUploadProgress((prev) =>
  //           prev.map((item) =>
  //             item.fileId === file.id ? { ...item, completed: true } : item
  //           )
  //         );
  //       }
  //     );

  //     cleanupFunctions.push(cleanup);
  //   });

  //   // Return a cleanup function that cancels all animations
  //   return () => {
  //     cleanupFunctions.forEach((cleanup) => cleanup());
  //   };
  // };

  // Remove the progress tracking for the file
  // const handleFileRemoved = (fileId: string) => {
  //   setUploadProgress((prev) => prev.filter((item) => item.fileId !== fileId));

  //   // Also Update the initialFiles Array saved in localStorage
  //   updateInitialFilesArray(fileId, initialFiles);
  // };

  // const handleUpload = async () => {
  //   const fileList = files.filter(
  //     (f) => f.file instanceof File
  //   ) as FileWithPreview[];

  //   fileList.forEach((file) => {
  //     setUploadProgress((prev) => [
  //       ...prev,
  //       { fileId: file.id, progress: 0, completed: false },
  //     ]);

  //     // Start simulated progress immediately on click
  //     const cleanup = simulateUpload(
  //       file.file.size,
  //       (progress) => {
  //         setUploadProgress((prev) =>
  //           prev.map((item) =>
  //             item.fileId === file.id ? { ...item, progress } : item
  //           )
  //         );
  //       },
  //       () => {
  //         setUploadProgress((prev) =>
  //           prev.map((item) =>
  //             item.fileId === file.id
  //               ? { ...item, completed: true, progress: 100 }
  //               : item
  //           )
  //         );
  //       }
  //     );

  //     // Actual Supabase upload
  //     uploadFiles([file.file as File])
  //       .then(() => {
  //         cleanup(); // stop simulation early if done
  //         setUploadProgress((prev) =>
  //           prev.map((item) =>
  //             item.fileId === file.id
  //               ? { ...item, completed: true, progress: 100 }
  //               : item
  //           )
  //         );
  //       })
  //       .catch(() => {
  //         cleanup();
  //         // optionally handle failure
  //       });
  //   });
  // };

  const handleUpload = async () => {
    const fileList = files.filter(
      (f) => f.file instanceof File
    ) as FileWithPreview[];

    // Initialize progress for all files
    fileList.forEach((file) => {
      setUploadProgress((prev) => [
        ...prev,
        { fileId: file.id, progress: 0, completed: false },
      ]);
    });

    const slug = randomBytes(3).toString("hex"); // generate only once

    const uploads = fileList.map(
      (file) =>
        new Promise<void>((resolve, reject) => {
          const stopSim = simulateUpload(file.file.size, (progress) => {
            setUploadProgress((prev) =>
              prev.map((item) =>
                item.fileId === file.id ? { ...item, progress } : item
              )
            );
          });

          uploadFiles([file.file as File], slug)
            .then(() => {
              stopSim();
              setUploadProgress((prev) =>
                prev.map((item) =>
                  item.fileId === file.id
                    ? { ...item, progress: 100, completed: true }
                    : item
                )
              );
              resolve();
            })
            .catch((err) => {
              stopSim();
              reject(err);
            });
        })
    );

    try {
      await Promise.all(uploads);
      toast("Upload complete", {
        description: "All files have been successfully uploaded",
      });
    } catch (err) {
      toast("Upload failed", {
        description: "Some files could not be uploaded",
        action: {
          label: "Retry Upload",
          onClick: () => handleUpload(),
        },
      });
    }
  };

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    initialFiles,
    // onFilesAdded: handleFilesAdded,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row sm:gap-2">
              <h3 className="truncate text-sm font-medium">
                Files ({files.length})
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={openFileDialog}>
                  <UploadIcon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Add files
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Clear all progress tracking
                    setUploadProgress([]);
                    clearFiles();
                    clearInitialFiles();
                  }}
                >
                  <Trash2Icon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Remove all
                </Button>
              </div>
            </div>

            <div className="w-full space-y-2">
              {files.map((file) => {
                // Find the upload progress for this file once to avoid repeated lookups
                const fileProgress = uploadProgress.find(
                  (p) => p.fileId === file.id
                );
                const isUploading = fileProgress && !fileProgress.completed;

                return (
                  <div
                    key={file.id}
                    data-uploading={isUploading || undefined}
                    className="bg-background flex flex-col gap-1 rounded-lg border p-2 pe-3 transition-opacity duration-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 overflow-hidden in-data-[uploading=true]:opacity-50">
                        <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                          {getFileIcon(file)}
                        </div>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="truncate text-[13px] font-medium">
                            {file.file instanceof File
                              ? file.file.name
                              : file.file.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatBytes(
                              file.file instanceof File
                                ? file.file.size
                                : file.file.size
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                        onClick={() => {
                          // handleFileRemoved(file.id);
                          removeFile(file.id);
                        }}
                        aria-label="Remove file"
                      >
                        <XIcon className="size-4" aria-hidden="true" />
                      </Button>
                    </div>

                    {/* Upload progress bar */}
                    {fileProgress &&
                      (() => {
                        const progress = fileProgress.progress || 0;
                        const completed = fileProgress.completed || false;

                        if (completed) return null;

                        return (
                          <div className="mt-1 flex items-center gap-2">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="bg-primary h-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-muted-foreground w-10 text-xs tabular-nums">
                              {progress}%
                            </span>
                          </div>
                        );
                      })()}
                  </div>
                );
              })}
              <div className="flex justify-end">
                <Button
                  variant={"default"}
                  onClick={handleUpload}
                  // onClick={() =>
                  //   uploadFiles(
                  //     files
                  //       .filter((f) => f.file instanceof File)
                  //       .map((f) => f.file as File)
                  //   )
                  // }
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your files here</p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} files ∙ Up to {maxSizeMB}MB
            </p>
            <Button variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select images
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* <p
        aria-live="polite"
        role="region"
        className="text-muted-foreground mt-2 text-center text-xs"
      >
        With simulated progress track ∙{" "}
        <a
          href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
          className="hover:text-foreground underline"
          target="_blank"
        >
          API
        </a>
      </p> */}
    </div>
  );
}
