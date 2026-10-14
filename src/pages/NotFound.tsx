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
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-foreground">This street doesn't exist.</h1>
        <p className="mt-3 text-muted-foreground">The page you're looking for isn't here.</p>
        <a
          href="/"
          className="mt-8 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Return to Home
        </a>
      </div>
    </main>
  );
};

export default NotFound;
