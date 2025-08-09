// app/share/[slug]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SharePage({ params }: { params: { slug: string } }) {
  const [bundle, setBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const res = await fetch(`/api/bundles/${params.slug}`);
        if (!res.ok) throw new Error("Failed to fetch bundle");
        const data = await res.json();
        setBundle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, [params.slug]);

  if (loading) return <p>Loading...</p>;
  if (!bundle) return <p>Bundle not found</p>;

  return (
    <div>
      <h1>Files in Bundle: {bundle.slug}</h1>
      <ul>
        {/* {bundle.files.map((file: any) => (
          <li key={file.id}>
            <Link href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </Link>{" "}
            ({(file.size / 1024).toFixed(2)} KB)
          </li>
        ))} */}
        {bundle.files.map((file: any) => (
          <li key={file.id} className="flex items-center gap-2">
            <span>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </span>
            <Button
              onClick={async () => {
                const res = await fetch(file.url);
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                window.URL.revokeObjectURL(url);
              }}
            >
              <Download />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
