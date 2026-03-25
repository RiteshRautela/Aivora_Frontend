import { PricingSection } from "./PricingSection";

const plans = [
  {
    name: "Starter",
    price: 0,
    credits: 100,
    plan: "free",
    yearlyPrice: "15",
    period: "month",
    features: [
      "50 AI site generations per month",
      'Access to the "Generate" builder flow',
      "Responsive export presets",
      "Email support within 48 hours",
      "Perfect for side projects and experiments",
    ],
    description: "For solo builders who want a clean way to ship their first AI-powered pages.",
    buttonText: "Start Building",
    href: "/home/generate",
  },
  {
    name: "Pro",
    price: 499,
    credits: 500,
    plan: "pro",
    yearlyPrice: "39",
    period: "month",
    features: [
      "Unlimited generations and revisions",
      "Live editing with AiVora Editor",
      "Priority queue for faster outputs",
      "Team-ready collaboration workflow",
      "Priority support and roadmap previews",
    ],
    description: "The best fit for creators and startups turning ideas into polished launches every week.",
    buttonText: "Upgrade to Pro",
    href: "/home/generate",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: 1499,
    credits: 1000,
    plan: "enterprise",
    yearlyPrice: "103",
    period: "month",
    features: [
      "Everything in Pro",
      "Private onboarding and success manager",
      "Custom workflows for internal teams",
      "Security review and advanced permissions",
      "Dedicated launch planning support",
    ],
    description: "For product teams that need governance, scale, and a partner for larger rollouts.",
    buttonText: "Contact Sales",
    href: "mailto:hello@aivora.in",
  },
];

function Pricing() {
  return (
    <PricingSection
      plans={plans}
      title="Choose the plan that matches your launch speed"
      description="From first experiments to production-ready launches, AiVora gives every team a faster path from prompt to polished product."
    />
  );
}

export default Pricing;
