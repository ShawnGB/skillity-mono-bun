import { useFetcher, useLocation, Link } from "react-router";
import { Button } from "@/components/ui/button";

interface RegisterButtonProps {
  isAuthenticated: boolean;
  workshopId: string;
}

export default function RegisterButton({ isAuthenticated, workshopId }: RegisterButtonProps) {
  const fetcher = useFetcher<{ error?: string }>();
  const location = useLocation();
  const isPending = fetcher.state !== "idle";
  const error = fetcher.data?.error;

  if (isAuthenticated) {
    return (
      <div className="space-y-2">
        <fetcher.Form method="post" action={`/api/book/${workshopId}`}>
          <Button size="lg" className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Booking..." : "Register for Workshop"}
          </Button>
        </fetcher.Form>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  const redirectParam = encodeURIComponent(location.pathname);

  return (
    <div className="flex flex-col gap-2">
      <Button asChild size="lg" className="w-full">
        <Link to={`/login?redirect=${redirectParam}`}>Sign In to Register</Link>
      </Button>
      <Button asChild variant="outline" size="lg" className="w-full">
        <Link to={`/register?redirect=${redirectParam}`}>Create an Account</Link>
      </Button>
    </div>
  );
}
