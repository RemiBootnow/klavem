import { cn } from "@/lib/utils";
import { Headline } from "@/components/components/headline";
import { buttonVariants } from "@/components/components/ui/button-variants";
import { FallbackImage } from "@/components/components/fallback-image";
import { formatName, type Vehicle } from "@/lib/vehicles";

interface VehicleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  vehicle: Vehicle;
}

function VehicleCard({ vehicle, className, ...props }: VehicleCardProps) {
  const name = formatName(vehicle);
  const href = `/vehicules/${vehicle.slug}`;

  return (
    <div
      data-slot="vehicle-card"
      className={cn(
        "flex flex-col gap-4 overflow-hidden rounded-2xl bg-muted",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 px-6 pt-8">
        <span className="text-base text-muted-foreground">{vehicle.bodyType}</span>
        <Headline level={3} className="text-center">
          {name}
        </Headline>
      </div>
      <FallbackImage
        src={vehicle.image}
        alt={`${name} — location VTC Île-de-France — Klavem Fleet`}
        className="w-full"
      />
      <div className="flex items-end justify-between px-6 pb-6 pt-4">
        <div className="flex flex-col">
          {vehicle.tarifJournalier !== null ? (
            <>
              <span className="text-3xl font-bold tracking-[-0.03em]">{vehicle.tarifJournalier} €</span>
              <span className="text-sm text-muted-foreground">par jour TTC</span>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold tracking-[-0.03em]">Sur demande</span>
              <span className="text-sm text-muted-foreground">Tarif journalier</span>
            </>
          )}
        </div>
        <a
          href={href}
          className={buttonVariants({ variant: "neutral", size: "xl" })}
        >
          Voir le véhicule
        </a>
      </div>
    </div>
  );
}

export { VehicleCard };
export type { VehicleCardProps };
