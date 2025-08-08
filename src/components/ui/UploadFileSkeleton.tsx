import { Skeleton } from "./skeleton";

export default function UploadFileSkeleton() {
    return (
        <div className="flex flex-col items-center gap-2 border border-dashed rounded-xl min-h-52 p-4">
            <Skeleton className="size-11 rounded-full" />
            <Skeleton className="w-40 h-2" />
            <Skeleton className="w-40 h-2" />
            <Skeleton className="w-9 h-5 w-40" />
        </div>
    );
}