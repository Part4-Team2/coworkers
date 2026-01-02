import SVGIcon from "@/components/Common/SVGIcon/SVGIcon";
import { IconMapTypes } from "@/components/Common/SVGIcon/iconMap";

interface StatCardProps {
  title: string;
  count: number;
  icon: IconMapTypes;
  unit?: string;
}

const validateCount = (count: number): number => Math.max(0, Math.floor(count));

export default function StatCard({
  title,
  count,
  icon,
  unit = "개",
}: StatCardProps) {
  const validatedCount = validateCount(count);
  return (
    <div className="flex items-center justify-between rounded-xl p-16 w-full min-h-80 bg-background-tertiary">
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <p className="text-xs font-medium leading-16 text-text-secondary truncate">
          {title}
        </p>
        <p className="text-2xl font-bold text-brand-tertiary truncate">
          {`${validatedCount}${unit}`}
        </p>
      </div>
      <div className="shrink-0">
        <SVGIcon icon={icon} size={40} aria-label={title} />
      </div>
    </div>
  );
}
