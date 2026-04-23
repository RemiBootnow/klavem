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
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="absolute inset-0 size-full object-cover -z-10"
            />
          )}
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <img
            src="/testimonials/Gradient.png"
            alt=""
            className="absolute bottom-0 left-0 -z-10 w-full"
          />
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
