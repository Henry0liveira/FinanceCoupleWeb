import Link from "next/link";

type GradientHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export default function GradientHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel
}: GradientHeaderProps) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="bg-gradient-to-r from-brandPink via-brandPurple to-brandBlue px-3 py-4 text-white sm:px-4 sm:py-5 md:px-5 md:py-6">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">{eyebrow}</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
            {description ? <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-white/85">{description}</p> : null}
          </div>
          {actionHref && actionLabel ? (
            <Link href={actionHref} className="btn-secondary w-full bg-white/90 text-navy-900 hover:bg-white sm:w-auto flex-shrink-0">
              {actionLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
