"use client";

import { useRef } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Container } from "@/components/components/container";
import { Button } from "@/components/components/ui/button";
import {
  TestimonialCard,
  type Testimonial,
} from "@/components/blocks/testimonial-card";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function slide(direction: "previous" | "next") {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left:
        direction === "next"
          ? scroller.clientWidth * 0.8
          : scroller.clientWidth * -0.8,
      behavior: "smooth",
    });
  }

  return (
    <>
      <div
        ref={scrollerRef}
        className="overflow-x-auto scrollbar-hide pl-[max(1.5rem,calc((100vw-1080px)/2+1.5rem))]"
      >
        <TestimonialCard testimonials={testimonials} />
      </div>
      <Container>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            aria-label="Voir les témoignages précédents"
            onClick={() => slide("previous")}
          >
            <CaretLeft size={20} weight="bold" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            aria-label="Voir les témoignages suivants"
            onClick={() => slide("next")}
          >
            <CaretRight size={20} weight="bold" />
          </Button>
        </div>
      </Container>
    </>
  );
}

export { TestimonialsCarousel };
