export type CtaVariant = "primary" | "secondary";

export interface Slide {
  heading: string;
  subheading: string;
  text: string;
  ctaLabel: string;
  ctaTo: string;
  ctaVariant?: CtaVariant;
}
