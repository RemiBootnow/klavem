"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string;
  alt: string;
}

function FallbackImage({
  src,
  fallback = "/vehicules/kia.png",
  alt,
  className,
  ...props
}: FallbackImageProps) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [src]);

  return (
    <img
      src={errored ? fallback : src}
      alt={alt}
      className={cn(className)}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}

export { FallbackImage };
