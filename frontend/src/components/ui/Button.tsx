import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const VARIANTS = {
  primary:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none",
  secondary:
    "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500",
};

type Variant = keyof typeof VARIANTS;

/** The shared look of every button and button-like link. */
export function buttonClass(variant: Variant = "secondary", small = false) {
  const size = small ? "px-3 py-1.5" : "px-4 py-2";
  return `inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors ${size} ${VARIANTS[variant]}`;
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; small?: boolean };

export function Button({ variant, small, className = "", ...rest }: Props) {
  return <button className={`${buttonClass(variant, small)} ${className}`} {...rest} />;
}

type LinkProps = { href: string; variant?: Variant; small?: boolean; children: ReactNode };

/** A link that looks like a button, for moving between screens. */
export function ButtonLink({ href, variant, small, children }: LinkProps) {
  return (
    <Link href={href} className={buttonClass(variant, small)}>
      {children}
    </Link>
  );
}
