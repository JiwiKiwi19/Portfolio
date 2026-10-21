import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="slug text-primary">§404 · Not found</p>
        <h1 className="mt-4 font-display text-6xl font-normal leading-none text-foreground">This street <em>doesn't exist.</em></h1>
        <p className="mt-3 text-muted-foreground">The page you're looking for isn't here.</p>
        <a
          href="/"
          className="mt-8 inline-flex border border-foreground px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          Return to Home
        </a>
      </div>
    </main>
  );
};

export default NotFound;
