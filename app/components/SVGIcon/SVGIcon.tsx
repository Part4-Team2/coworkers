import React from "react";

import { IconMap, IconMapTypes, IconSizeTypes, IconSizes } from "./iconMap";

export interface SVGIconProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  "width" | "height" | "viewBox"
> {
  icon: IconMapTypes;
  size?: IconSizeTypes | number;
  width?: number;
  height?: number;
}

const SVGIcon: React.FC<SVGIconProps> = ({
  icon,
  size = "md",
  width,
  height,
  ...props
}) => {
  const Icon = IconMap[icon];

  if (!Icon) return null;

  const dimension = typeof size === "number" ? size : IconSizes[size];

  return (
    <Icon {...props} width={width || dimension} height={height || dimension} />
  );
};

export default SVGIcon;
