import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background-primary">
      <div className="flex flex-col items-center gap-16">
        <div className="animate-spin">
          <SVGIcon icon="loading" size="xl" />
        </div>
        <p className="text-text-secondary text-md">로딩 중...</p>
      </div>
    </div>
  );
}
