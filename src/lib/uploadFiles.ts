export async function uploadFiles(files: File[], slug?: string) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  if (slug) {
    formData.append("slug", slug); // pass existing slug if provided
  }

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Upload failed");
  }

  const data = await res.json();
  console.log("Response", data);
  return data;
}
