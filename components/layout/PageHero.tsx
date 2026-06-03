import Image from "next/image";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

export default function PageHero({ eyebrow, title, description, imageUrl, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-canvas-night text-on-primary">
      {imageUrl && (
        <div className="absolute inset-0">
          <Image src={imageUrl} alt="" fill priority className="object-cover opacity-25" />
        </div>
      )}
      <div className="absolute inset-0 bg-canvas-night/80" />
      <div className="container-cinematic relative z-10 py-16 sm:py-20 lg:py-24">
        {children}
        <span className="pill-tag mb-4 inline-block">{eyebrow}</span>
        <h1 className="font-display text-3xl leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">
          {title}
        </h1>
        <p className="text-body-lg text-link-cool-2 max-w-2xl">{description}</p>
      </div>
    </section>
  );
}
