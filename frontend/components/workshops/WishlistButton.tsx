import { useFetcher } from "react-router";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  workshopId: string;
  isSaved: boolean;
  className?: string;
}

export default function WishlistButton({ workshopId, isSaved, className }: WishlistButtonProps) {
  const fetcher = useFetcher();
  const optimisticSaved =
    fetcher.state !== "idle"
      ? fetcher.formData?.get("intent") === "save"
      : isSaved;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fetcher.submit(
      { intent: isSaved ? "remove" : "save" },
      { method: "post", action: `/api/wishlist/${workshopId}` },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={fetcher.state !== "idle"}
      className={cn(
        "rounded-full p-1.5 transition-colors",
        optimisticSaved
          ? "text-red-500 hover:text-red-600"
          : "text-white/70 hover:text-white",
        className,
      )}
      aria-label={optimisticSaved ? "Remove from saved" : "Save workshop"}
    >
      <Heart className={cn("size-5", optimisticSaved && "fill-current")} />
    </button>
  );
}
