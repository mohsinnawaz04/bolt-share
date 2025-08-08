import { FileMetadata } from "@/hooks/use-file-upload"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function saveInitialFilesToLocalStorage(initialFiles: FileMetadata[]) {
   if (typeof window !== "undefined") {
    localStorage.setItem("initialFiles", JSON.stringify(initialFiles));
  }
}

