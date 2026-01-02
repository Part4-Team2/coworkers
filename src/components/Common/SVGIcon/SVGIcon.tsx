import { forwardRef, ComponentPropsWithoutRef } from "react";
import { IconMap, IconMapTypes, IconSizeTypes, IconSizes } from "./iconMap";

type SVGIconProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "width" | "height" | "viewBox" | "children"
> & {
  icon: IconMapTypes;
  size?: IconSizeTypes | number;
  width?: number;
  height?: number;
};

const SVGIcon = forwardRef<SVGSVGElement, SVGIconProps>(function SVGIcon(
  { icon, size = "md", width, height, ...props },
  ref
) {
  const Icon = IconMap[icon];
  if (!Icon) return null;
  const dimension = typeof size === "number" ? size : IconSizes[size];
  return (
    <Icon
      ref={ref}
      width={width ?? dimension}
      height={height ?? dimension}
      {...props}
    />
  );
});

export default SVGIcon;
