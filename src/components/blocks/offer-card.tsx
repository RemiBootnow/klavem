import { cn } from "@/lib/utils";
import { Headline } from "@/components/components/headline";

interface Offer {
  title: string;
  description: string;
}

interface OfferCardProps extends React.HTMLAttributes<HTMLDivElement> {
  offers: Offer[];
}

function OfferCard({ offers, className, ...props }: OfferCardProps) {
  return (
    <div
      data-slot="offer-card"
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-3",
        className
      )}
      {...props}
    >
      {offers.map((offer, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border p-6"
        >
          <Headline level={4}>{offer.title}</Headline>
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
            {offer.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export { OfferCard };
export type { OfferCardProps, Offer };
