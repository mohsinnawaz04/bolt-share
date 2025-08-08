import FileUploader from "@/components/FileUploader";
import UploadFileSkeleton from "@/components/ui/UploadFileSkeleton";
import { Suspense } from "react";

export default function Page() {
  return <section className="hero">
    <div className="container">
      <Suspense fallback={<UploadFileSkeleton />}>
        <FileUploader />
      </Suspense>
    </div>
  </section>;
}
