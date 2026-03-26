import { LoadingBreadcrumb } from "./LoadingShimmer";

const Spinner = ({
  text = "Loading your website",
  description = "Preparing the latest version of your project.",
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <LoadingBreadcrumb
          text={text}
          className="justify-center text-base"
          textClassName="font-semibold"
        />
        <p className="mt-3 max-w-sm text-center text-sm leading-6 text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Spinner;
