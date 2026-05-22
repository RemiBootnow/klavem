import Image from "next/image";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image?: string;
}

interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  testimonials: Testimonial[];
}

function TestimonialCard({
  testimonials,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <div
      data-slot="testimonial-card"
      className={cn(
        "flex gap-6",
        className
      )}
      {...props}
    >
      {testimonials.map((testimonial, i) => (
        <blockquote
          key={i}
          data-theme="dark"
          className="relative flex w-[340px] shrink-0 flex-col justify-end gap-4 overflow-hidden rounded-2xl p-6 aspect-3/4"
        >
          {testimonial.image && (
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              sizes="340px"
              className="object-cover -z-10"
            />
          )}
          <div className="absolute inset-0 -z-10 bg-black/30" />
          <p className="flex-1 text-2xl leading-tight font-semibold text-white">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <footer className="text-sm">
            <span className="font-medium text-white">{testimonial.name}</span>
            <span className="text-white/60"> — {testimonial.role}</span>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}

export { TestimonialCard };
export type { TestimonialCardProps, Testimonial };
