import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackHotels } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import SearchInput from "@/components/layout/SearchInput";
import { getSiteImages } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Hotels Near Hospitals",
  description: "Find comfortable accommodation near partner hospitals for your medical stay in India.",
};

export default async function HotelsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const supabase = await createServerSupabaseClient();
  const [{ data: raw }, images] = await Promise.all([
    supabase.from("hotels").select("*").limit(50),
    getSiteImages(),
  ]);
  const query = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const normalizedQuery = query.toLowerCase();

  const hotelFallbackImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
  ];

  const fetchedHotels = raw?.map((hotel, index) => ({
    name: hotel.name,
    address: hotel.address,
    stars: hotel.stars || 3,
    price: hotel.price_range || "$$",
    near: "",
    photo_url: hotel.photo_url || hotelFallbackImages[index % hotelFallbackImages.length],
  })) || [];

  const allHotels = fetchedHotels.length > 0 ? fetchedHotels : fallbackHotels;
  const hotels = normalizedQuery
    ? allHotels.filter((hotel) =>
        [hotel.name, hotel.address, hotel.near]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : allHotels;

  return (
    <>
      <PageHero
        eyebrow="Accommodation"
        title="Hotels Near Hospitals"
        description="Comfortable accommodation options near our partner hospitals for your medical stay."
        imageUrl={images.image_hotels_hero}
      />

      <section className="bg-canvas-cream py-12 border-b border-hairline-light">
        <div className="container-cinematic">
          <SearchInput
            placeholder="Search hotels by area or hospital..."
            label="Search hotels"
            resultCount={hotels.length}
          />
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          {hotels.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-lg p-10 bg-canvas-cream">
              <h2 className="font-display text-heading-lg text-ink">No hotels found</h2>
              <p className="text-body-md text-shade-50 mt-2">Try a different area, hospital, or hotel name.</p>
              <Link href="/hotels" className="btn-primary mt-6">
                Clear Search
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div key={`${hotel.name}-${hotel.address}`} className="overflow-hidden bg-canvas-cream rounded-lg border border-hairline-light hover:shadow-elevation-3 transition-all">
                  <div className="relative h-44 bg-canvas-light">
                    <Image
                      src={hotel.photo_url}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: hotel.stars }).map((_, index) => (
                        <Star key={index} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <h2 className="font-display text-heading-md text-ink mb-2">{hotel.name}</h2>
                    <div className="flex items-center gap-1 text-caption text-shade-40 mb-2">
                      <MapPin size={14} /><span>{hotel.address}</span>
                    </div>
                    <span className="text-body-md text-ink font-medium">{hotel.price}</span>
                    {hotel.near && <p className="text-caption text-shade-40 mt-2">Near {hotel.near}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
