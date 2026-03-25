"use client";

import { motion, useSpring } from "framer-motion";
import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { Slot } from "@radix-ui/react-slot";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = (event) => setMatches(event.matches);

    setMatches(media.matches);
    media.addEventListener("change", updateMatch);

    return () => media.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black shadow-[0_14px_30px_rgba(255,255,255,0.18)] hover:bg-white/90",
        outline:
          "border border-white/20 bg-white/[0.03] text-white hover:border-white/35 hover:bg-white/[0.08]",
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

function ActionLink({ href, children, className, ...props }) {
  const isInternal = href?.startsWith("/");

  if (isInternal) {
    return (
      <Button asChild className={className} {...props}>
        <Link to={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button asChild className={className} {...props}>
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
      >
        {children}
      </a>
    </Button>
  );
}

function Star({ mousePosition, containerRef }) {
  const [origin] = useState({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2,
  });

  const springConfig = { stiffness: 100, damping: 16, mass: 0.1 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    if (
      !containerRef.current ||
      mousePosition.x === null ||
      mousePosition.y === null
    ) {
      springX.set(0);
      springY.set(0);
      return;
    }

    const containerBounds = containerRef.current.getBoundingClientRect();
    const starX =
      containerBounds.left +
      (parseFloat(origin.left) / 100) * containerBounds.width;
    const starY =
      containerBounds.top +
      (parseFloat(origin.top) / 100) * containerBounds.height;

    const deltaX = mousePosition.x - starX;
    const deltaY = mousePosition.y - starY;
    const distance = Math.hypot(deltaX, deltaY);
    const influenceRadius = 420;

    if (distance < influenceRadius) {
      const force = 1 - distance / influenceRadius;
      springX.set(deltaX * force * 0.28);
      springY.set(deltaY * force * 0.28);
    } else {
      springX.set(0);
      springY.set(0);
    }
  }, [containerRef, mousePosition, origin.left, origin.top, springX, springY]);

  return (
    <motion.div
      className="absolute rounded-full bg-white/90"
      style={{
        top: origin.top,
        left: origin.left,
        width: `${origin.size}px`,
        height: `${origin.size}px`,
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.1, 1, 0.15] }}
      transition={{
        duration: 2 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 4,
      }}
    />
  );
}

function InteractiveStarfield({ mousePosition, containerRef }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 110 }).map((_, index) => (
        <Star
          key={`pricing-star-${index}`}
          mousePosition={mousePosition}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}

const PricingContext = createContext({
  isMonthly: true,
  setIsMonthly: () => {},
});

export function PricingSection({
  plans,
  title = "Simple, transparent pricing",
  description = "Choose the plan that matches your build speed, support needs, and scale.",
}) {
  const [isMonthly, setIsMonthly] = useState(true);
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  return (
    <PricingContext.Provider value={{ isMonthly, setIsMonthly }}>
      <section
        ref={containerRef}
        onMouseMove={(event) =>
          setMousePosition({ x: event.clientX, y: event.clientY })
        }
        onMouseLeave={() => setMousePosition({ x: null, y: null })}
        className="relative isolate overflow-hidden bg-[#020617] px-4 py-20 text-white sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_34%),linear-gradient(180deg,_rgba(10,10,10,0.45),_rgba(0,0,0,1))]" />
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <InteractiveStarfield
          mousePosition={mousePosition}
          containerRef={containerRef}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              AiVora Pricing
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              {description}
            </p>
          </div>

          <PricingToggle />

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
            {plans.map((plan, index) => (
              <PricingCard key={plan.name} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>
    </PricingContext.Provider>
  );
}

function PricingToggle() {
  const { isMonthly, setIsMonthly } = useContext(PricingContext);
  const monthlyRef = useRef(null);
  const annualRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const target = isMonthly ? monthlyRef.current : annualRef.current;

    if (!target) {
      return;
    }

    setIndicatorStyle({
      width: target.offsetWidth,
      transform: `translateX(${target.offsetLeft}px)`,
    });
  }, [isMonthly]);

  const handleToggle = (monthly) => {
    if (monthly === isMonthly) {
      return;
    }

    setIsMonthly(monthly);

    if (!monthly && annualRef.current) {
      const rect = annualRef.current.getBoundingClientRect();

      confetti({
        particleCount: 70,
        spread: 70,
        startVelocity: 28,
        decay: 0.94,
        gravity: 1.05,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#ffffff", "#d4d4d8", "#a1a1aa"],
      });
    }
  };

  return (
    <div className="mt-10 flex justify-center">
      <div className="relative flex items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-white shadow-[0_12px_30px_rgba(255,255,255,0.18)]"
          style={indicatorStyle}
          transition={{ type: "spring", stiffness: 460, damping: 35 }}
        />
        <button
          ref={monthlyRef}
          type="button"
          onClick={() => handleToggle(true)}
          className={cn(
            "relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors sm:px-6",
            isMonthly ? "text-black" : "text-slate-300 hover:text-white",
          )}
        >
          Monthly
        </button>
        <button
          ref={annualRef}
          type="button"
          onClick={() => handleToggle(false)}
          className={cn(
            "relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors sm:px-6",
            !isMonthly ? "text-black" : "text-slate-300 hover:text-white",
          )}
        >
          Annual
          <span
            className={cn(
              "hidden sm:inline",
              !isMonthly ? "text-slate-900/80" : "",
            )}
          >
            {" "}
            (Save 20%)
          </span>
        </button>
      </div>
    </div>
  );
}

function PricingCard({ plan, index }) {
  const { isMonthly } = useContext(PricingContext);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const amount = Number(isMonthly ? plan.price : plan.yearlyPrice);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{
        opacity: 1,
        y: plan.isPopular && isDesktop ? -16 : 0,
      }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        type: "spring",
        stiffness: 120,
        damping: 20,
      }}
      className={cn(
        "relative flex h-full flex-col rounded-[28px] border p-8 backdrop-blur-xl",
        plan.isPopular
          ? "border-white/40 bg-white/[0.08] shadow-[0_20px_60px_rgba(255,255,255,0.08)]"
          : "border-white/10 bg-white/[0.04]",
      )}
    >
      {plan.isPopular && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white px-4 py-1.5 text-sm font-semibold text-black">
          Most Popular
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {plan.description}
        </p>

        <div className="mt-8 flex items-end justify-center gap-1 text-center">
          <div className="text-5xl font-bold tracking-tight text-white">
            <NumberFlow
              value={amount}
              format={{
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              }}
              className="tabular-nums"
            />
          </div>
          <span className="pb-1 text-sm font-medium text-slate-400">
            / {plan.period}
          </span>
        </div>

        <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-slate-500">
          {isMonthly ? "Billed monthly" : "Billed annually"}
        </p>

        <ul className="mt-8 space-y-3 text-sm text-slate-300">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-0.5 rounded-full bg-white/10 p-1 text-white">
                <Check className="h-4 w-4" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <ActionLink
            href={plan.href}
            variant={plan.isPopular ? "default" : "outline"}
            size="lg"
            className="w-full"
          >
            {plan.buttonText}
          </ActionLink>
        </div>
      </div>
    </motion.article>
  );
}
