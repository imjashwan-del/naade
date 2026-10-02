"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const gallery = images.length > 0 ? images : ["/images/hero.jpg"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-offwhite)]">
        <Image
          key={gallery[active]}
          src={gallery[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-500 ease-out"
        />
      </div>
      {gallery.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {gallery.map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative aspect-square overflow-hidden bg-[var(--color-offwhite)] transition-opacity ${
                active === index ? "opacity-100 ring-1 ring-[var(--color-charcoal)]" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={image} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
