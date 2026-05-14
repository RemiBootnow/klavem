"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  PaperPlaneTilt,
  WarningCircle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/components/ui/button";
import { Checkbox } from "@/components/components/ui/checkbox";
import { FallbackImage } from "@/components/components/fallback-image";

type Location = "idf" | "autre";
type CardStatus = "oui" | "non";
type VehicleSituation = "propre" | "loue" | "aucun";
type Timing = "asap" | "1mois" | "renseigne";

const UNDECIDED = "__undecided__";

interface VehicleOption {
  slug: string;
  name: string;
  bodyType: string;
  yearLabel: string;
  category: number;
  tarifJournalier: number | null;
  image: string;
}

interface FormState {
  vehicleSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: Location | "";
  consent: boolean;
  cardStatus: CardStatus | "";
  vehicleSituation: VehicleSituation | "";
  timing: Timing | "";
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function buildInitialState(initialVehicleSlug: string | null): FormState {
  return {
    vehicleSlug: initialVehicleSlug ?? "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    consent: false,
    cardStatus: "",
    vehicleSituation: "",
    timing: "",
  };
}

const locationOptions: { value: Location; label: string }[] = [
  { value: "idf", label: "Ile-de-France" },
  { value: "autre", label: "Autre région" },
];

const cardStatusOptions: { value: CardStatus; label: string }[] = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
];

const vehicleSituationOptions: { value: VehicleSituation; label: string }[] = [
  { value: "propre", label: "J'ai mon propre véhicule" },
  { value: "loue", label: "Je loue déjà un véhicule" },
  { value: "aucun", label: "Je n'ai pas encore de véhicule" },
];

const timingOptions: { value: Timing; label: string }[] = [
  { value: "asap", label: "Dès que possible" },
  { value: "1mois", label: "Dans 1 mois ou plus" },
  { value: "renseigne", label: "Je me renseigne" },
];

const inputClasses = cn(
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors",
  "placeholder:text-muted-foreground",
  "focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/20",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
);

interface ContactFormProps {
  vehicles: VehicleOption[];
  initialVehicleSlug: string | null;
  onVehicleChange?: (slug: string) => void;
}

function scoreVehicleSituation(s: VehicleSituation | ""): number {
  if (s === "loue" || s === "aucun") return 3;
  if (s === "propre") return 1;
  return 0;
}

function scoreTiming(t: Timing | ""): number {
  if (t === "asap") return 3;
  if (t === "1mois") return 2;
  if (t === "renseigne") return 1;
  return 0;
}

function leadPriority(score: number): "hot" | "warm" | "cold" {
  if (score >= 5) return "hot";
  if (score >= 3) return "warm";
  return "cold";
}

function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

function ContactForm({
  vehicles,
  initialVehicleSlug,
  onVehicleChange,
}: ContactFormProps) {
  const [step, setStep] = useState(initialVehicleSlug ? 2 : 1);
  const [submitted, setSubmitted] = useState(false);
  const [mdqlPushed, setMdqlPushed] = useState(false);
  const [attemptedStep, setAttemptedStep] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(() =>
    buildInitialState(initialVehicleSlug)
  );

  useEffect(() => {
    onVehicleChange?.(form.vehicleSlug);
  }, [form.vehicleSlug, onVehicleChange]);

  const blockedOutsideIdf = form.location === "autre";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleLocationChange(value: Location) {
    setForm((prev) => ({ ...prev, location: value }));
    if (value === "autre" && !mdqlPushed) {
      pushDataLayer({
        event: "MDQL",
        lead_score: null,
        lead_priority: null,
        lead_vehicle: form.vehicleSlug || null,
        disqualification_reason: "outside_idf",
      });
      setMdqlPushed(true);
    }
  }

  const stepValid = useMemo(() => {
    if (step === 1) {
      return true;
    }
    if (step === 2) {
      return Boolean(
        form.firstName.trim() &&
          form.lastName.trim() &&
          /\S+@\S+\.\S+/.test(form.email) &&
          form.phone.trim() &&
          form.location === "idf" &&
          form.consent
      );
    }
    if (step === 3) {
      return Boolean(form.cardStatus && form.vehicleSituation && form.timing);
    }
    return false;
  }, [step, form]);

  const errors = useMemo(() => {
    if (attemptedStep !== step) return {} as Record<string, boolean>;
    if (step === 2) {
      return {
        firstName: !form.firstName.trim(),
        lastName: !form.lastName.trim(),
        email: !/\S+@\S+\.\S+/.test(form.email),
        phone: !form.phone.trim(),
        location: form.location !== "idf",
        consent: !form.consent,
      };
    }
    if (step === 3) {
      return {
        cardStatus: !form.cardStatus,
        vehicleSituation: !form.vehicleSituation,
        timing: !form.timing,
      };
    }
    return {};
  }, [attemptedStep, step, form]);

  function next() {
    if (!stepValid) {
      setAttemptedStep(step);
      return;
    }
    if (step === 1 && !form.vehicleSlug) {
      update("vehicleSlug", UNDECIDED);
    }
    setAttemptedStep(null);
    setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setAttemptedStep(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step !== 3) return;
    if (!stepValid) {
      setAttemptedStep(step);
      return;
    }

    const isMql = form.location === "idf" && form.cardStatus === "oui";
    const score = isMql
      ? scoreVehicleSituation(form.vehicleSituation) + scoreTiming(form.timing)
      : null;

    pushDataLayer({
      event: isMql ? "MQL" : "MDQL",
      lead_score: score,
      lead_priority: score !== null ? leadPriority(score) : null,
      lead_vehicle: form.vehicleSlug || null,
      disqualification_reason: isMql ? null : "no_vtc_card",
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SuccessState
        onReset={() => {
          setForm(buildInitialState(initialVehicleSlug));
          setStep(initialVehicleSlug ? 2 : 1);
          setSubmitted(false);
          setMdqlPushed(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col pb-32 lg:pb-0">
      <div className="flex min-h-105 flex-col">
        {step === 1 && (
          <StepShell
            kicker="Étape 1 / 3"
            title="Choisissez votre véhicule"
            subtitle="Sélectionnez un modèle disponible ou laissez-nous vous orienter."
          >
            <VehicleSelectionStep
              vehicles={vehicles}
              selectedSlug={form.vehicleSlug}
              onSelect={(slug) => {
                update("vehicleSlug", slug);
                setAttemptedStep(null);
                setStep(2);
              }}
            />
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            kicker="Étape 2 / 3"
            onBack={back}
            title="Vos coordonnées"
            subtitle="Pour vous recontacter dans la journée avec une proposition adaptée."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Prénom"
                htmlFor="firstName"
                error={errors.firstName ? "Renseignez votre prénom" : undefined}
              >
                <input
                  id="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  aria-invalid={errors.firstName || undefined}
                  className={inputClasses}
                  placeholder="Jean"
                />
              </Field>
              <Field
                label="Nom"
                htmlFor="lastName"
                error={errors.lastName ? "Renseignez votre nom" : undefined}
              >
                <input
                  id="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  aria-invalid={errors.lastName || undefined}
                  className={inputClasses}
                  placeholder="Dupont"
                />
              </Field>
            </div>

            <Field
              label="Email"
              htmlFor="email"
              error={
                errors.email ? "Renseignez une adresse email valide" : undefined
              }
            >
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={errors.email || undefined}
                className={inputClasses}
                placeholder="jean@exemple.fr"
              />
            </Field>

            <Field
              label="Téléphone"
              htmlFor="phone"
              error={
                errors.phone ? "Renseignez votre numéro de téléphone" : undefined
              }
            >
              <div className="flex gap-2">
                <span
                  className={cn(
                    inputClasses,
                    "w-20 shrink-0 cursor-default text-center font-medium"
                  )}
                >
                  +33
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  aria-invalid={errors.phone || undefined}
                  className={inputClasses}
                  placeholder="6 12 34 56 78"
                />
              </div>
            </Field>

            <Field
              label="Où exercez-vous ?"
              error={
                errors.location ? "Sélectionnez votre zone d'activité" : undefined
              }
            >
              <RadioCards
                name="location"
                value={form.location}
                onChange={(v) => handleLocationChange(v as Location)}
                options={locationOptions}
                invalid={errors.location}
              />
            </Field>

            {blockedOutsideIdf && (
              <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
                <WarningCircle
                  size={20}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-destructive"
                />
                <p>
                  Désolé, nous intervenons uniquement en Ile-de-France. Nous ne
                  sommes pas en mesure de traiter votre demande.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border bg-background p-4 text-sm transition-colors",
                  errors.consent
                    ? "border-destructive ring-3 ring-destructive/20"
                    : "border-border"
                )}
              >
                <Checkbox
                  checked={form.consent}
                  onCheckedChange={(checked) => update("consent", checked)}
                  className="mt-0.5"
                />
                <span className="text-muted-foreground">
                  J&apos;accepte d&apos;être recontacté par Klavem Fleet au sujet
                  de ma demande. Mes données ne sont pas transmises à des tiers
                  et peuvent être supprimées à tout moment.
                </span>
              </label>
              {errors.consent && (
                <span className="text-xs font-medium text-destructive">
                  Vous devez accepter pour continuer
                </span>
              )}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            kicker="Étape 3 / 3"
            onBack={back}
            title="Qualifions votre projet"
            subtitle="Trois questions rapides pour vous proposer le bon véhicule au bon moment."
          >
            <Field
              label="Avez-vous déjà votre carte VTC ?"
              error={errors.cardStatus ? "Sélectionnez une option" : undefined}
            >
              <RadioCards
                name="cardStatus"
                value={form.cardStatus}
                onChange={(v) => update("cardStatus", v as CardStatus)}
                options={cardStatusOptions}
                invalid={errors.cardStatus}
              />
            </Field>

            <Field
              label="Comment roulez-vous actuellement ?"
              error={
                errors.vehicleSituation
                  ? "Sélectionnez une option"
                  : undefined
              }
            >
              <RadioCards
                name="vehicleSituation"
                value={form.vehicleSituation}
                onChange={(v) =>
                  update("vehicleSituation", v as VehicleSituation)
                }
                options={vehicleSituationOptions}
                invalid={errors.vehicleSituation}
              />
            </Field>

            <Field
              label="Quand souhaitez-vous démarrer votre location ?"
              error={errors.timing ? "Sélectionnez une option" : undefined}
            >
              <RadioCards
                name="timing"
                value={form.timing}
                onChange={(v) => update("timing", v as Timing)}
                options={timingOptions}
                invalid={errors.timing}
              />
            </Field>
          </StepShell>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:static lg:mt-8 lg:justify-end lg:border-t-0 lg:px-0 lg:pt-0 lg:pb-0">
        {step < 3 ? (
          <Button
            key="continue"
            type="button"
            size="xl"
            onClick={next}
            className="flex-1"
          >
            Continuer
          </Button>
        ) : (
          <Button
            key="submit"
            type="submit"
            size="xl"
            className="flex-1"
          >
            Envoyer ma demande
            <PaperPlaneTilt size={18} weight="bold" />
          </Button>
        )}
      </div>
    </form>
  );
}

function StepShell({
  kicker,
  title,
  subtitle,
  onBack,
  children,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Étape précédente"
            className="-ml-2 flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
        )}
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {kicker}
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const Tag = htmlFor ? "label" : "div";
  return (
    <Tag {...(htmlFor ? { htmlFor } : {})} className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? (
        <span className="text-xs font-medium text-destructive">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </Tag>
  );
}

function RadioCards<T extends string>({
  name,
  value,
  onChange,
  options,
  invalid,
}: {
  name: string;
  value: string;
  onChange: (value: T) => void;
  options: { value: T; label: string; hint?: string }[];
  invalid?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <label
            key={opt.value}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors",
              selected
                ? "border-primary bg-primary/5 text-primary"
                : invalid
                  ? "border-destructive text-foreground"
                  : "border-border text-foreground hover:border-foreground/30"
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {selected ? <Check size={14} weight="bold" /> : null}
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function VehicleSelectionStep({
  vehicles,
  selectedSlug,
  onSelect,
}: {
  vehicles: VehicleOption[];
  selectedSlug: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {vehicles.map((vehicle) => {
        const selected = selectedSlug === vehicle.slug;
        return (
          <label
            key={vehicle.slug}
            className="group/row relative isolate flex cursor-pointer items-center gap-4"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-2 -z-10 rounded-[20px] bg-muted/40 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100"
            />
            <input
              type="radio"
              name="vehicle"
              value={vehicle.slug}
              checked={selected}
              onChange={() => onSelect(vehicle.slug)}
              className="sr-only"
            />
            <div
              className={cn(
                "relative h-21 w-30 shrink-0 overflow-hidden rounded-xl",
                selected && "ring-2 ring-foreground ring-inset"
              )}
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgb(236, 236, 236) 0%, rgb(250, 250, 250) 33%, rgb(250, 250, 250) 67%, rgb(236, 236, 236) 100%)",
              }}
            >
              <FallbackImage
                src={vehicle.image}
                alt={`${vehicle.name} — location VTC Klavem`}
                className="absolute inset-0 h-full w-full object-contain p-1.5"
              />
              {selected && (
                <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <Check size={12} weight="bold" />
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-base font-semibold text-foreground">
                  {vehicle.name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {vehicle.bodyType} de {vehicle.yearLabel}
                </p>
              </div>
              <p className="text-sm text-foreground">
                {vehicle.tarifJournalier
                  ? `${vehicle.tarifJournalier * 7}€/semaine`
                  : "Sur demande"}
              </p>
            </div>
          </label>
        );
      })}
      <label className="group/row relative isolate flex cursor-pointer items-center gap-4">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-2 -z-10 rounded-[20px] bg-muted/40 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100"
        />
        <input
          type="radio"
          name="vehicle"
          value={UNDECIDED}
          checked={selectedSlug === UNDECIDED}
          onChange={() => onSelect(UNDECIDED)}
          className="sr-only"
        />
        <div
          className={cn(
            "relative flex h-21 w-30 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/30 text-muted-foreground",
            selectedSlug === UNDECIDED &&
              "border-solid ring-2 ring-foreground ring-inset"
          )}
        >
          <span className="text-2xl font-semibold">?</span>
          {selectedSlug === UNDECIDED && (
            <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Check size={12} weight="bold" />
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-base font-semibold text-foreground">
            Je ne sais pas encore
          </p>
          <p className="text-sm text-muted-foreground">
            Un conseiller vous orientera selon votre activité et votre budget.
          </p>
        </div>
      </label>
    </div>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle size={36} weight="fill" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Demande envoyée
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Notre équipe revient vers vous en moins de 2h ouvrées avec une
          proposition personnalisée.
        </p>
      </div>
      <Button variant="outline" onClick={onReset}>
        Faire une nouvelle demande
      </Button>
    </div>
  );
}

export { ContactForm, UNDECIDED };
