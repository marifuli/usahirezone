import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center py-16">
      <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
      <p className="mt-2 text-muted-foreground max-w-md">
        The page or job listing you are looking for does not exist or has been removed.
      </p>
      <div className="mt-6 flex gap-4">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>
    </div>
  );
}