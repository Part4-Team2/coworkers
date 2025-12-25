import React from "react";
import { ModalHeaderProps } from "./types";
import SVGIcon from "../SVGIcon/SVGIcon";
import Avatar from "../Avatar/Avatar";

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  description,
  icon,
  avatar,
}) => {
  if (!title && !description && !icon && !avatar) return null;

  // icon이 객체면 SVGIcon 렌더링, ReactNode면 그대로 사용
  const renderIcon = icon ? (
    typeof icon === "object" && "name" in icon ? (
      <SVGIcon
        icon={icon.name}
        size={icon.size || 20}
        className={icon.className || ""}
      />
    ) : (
      icon
    )
  ) : null;

  // avatar가 있으면 Avatar 컴포넌트 렌더링
  const renderAvatar = avatar ? (
    <Avatar
      imageUrl={avatar.imageUrl}
      altText={avatar.altText}
      size={avatar.size || "xlarge"}
    />
  ) : null;

  const descriptions = Array.isArray(description)
    ? description
    : description
      ? [description]
      : [];

  return (
    <div className="flex flex-col items-center text-center">
      {(renderAvatar || renderIcon) && (
        <div className="shrink-0 mb-18">{renderAvatar || renderIcon}</div>
      )}

      {title && (
        <h2 className="text-lg font-medium text-text-primary leading-lg">
          {title}
        </h2>
      )}

      {descriptions.length > 0 && (
        <div className={`flex flex-col gap-8 ${title ? "mt-8" : ""}`}>
          {descriptions.map((desc, index) => (
            <p
              key={index}
              className="text-md font-medium text-text-secondary leading-md"
            >
              {desc}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
