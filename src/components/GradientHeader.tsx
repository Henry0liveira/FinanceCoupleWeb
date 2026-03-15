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
      <div className="bg-gradient-to-r from-brandPink via-brandPurple to-brandBlue px-5 py-6 text-white sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">{eyebrow}</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
            {description ? <p className="mt-2 text-sm text-white/85">{description}</p> : null}
          </div>
          {actionHref && actionLabel ? (
            <Link href={actionHref} className="btn-secondary w-full bg-white/90 text-navy-900 hover:bg-white sm:w-auto">
              {actionLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
