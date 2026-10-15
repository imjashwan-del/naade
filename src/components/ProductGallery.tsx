"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const gallery = images.length > 0 ? images : ["/images/hero.jpg"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-cotton)] flex items-center justify-center border border-[var(--color-line)]">
        <Image
          key={gallery[active]}
          src={gallery[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-2 sm:p-4 transition-opacity duration-500 ease-out"
        />
      </div>
      {gallery.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
          {gallery.map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative aspect-square overflow-hidden bg-[var(--color-cotton)] border transition-all ${
                active === index
                  ? "border-[var(--color-oxblood)] ring-1 ring-[var(--color-oxblood)] opacity-100"
                  : "border-[var(--color-line)] opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={image} alt="" fill sizes="120px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
