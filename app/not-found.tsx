import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-display-xxl text-ink mb-4">404</h1>
      <h2 className="font-display text-heading-xl text-ink mb-4">Page Not Found</h2>
      <p className="text-body-lg text-shade-50 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
