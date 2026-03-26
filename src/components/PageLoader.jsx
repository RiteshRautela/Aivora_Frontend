import { LoadingBreadcrumb } from "./ui/animated-loading-svg-text-shimmer";

function PageLoader({ text = "Cooking" }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-8 text-white">
      <LoadingBreadcrumb text={text} />
    </div>
  );
}

export default PageLoader;
