import React from "react";
import BaseModal from "./BaseModal";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import Input from "../Input/Input";
import InputBox from "../Input/InputBox";
import {
  ModalProps,
  ModalInputConfig,
  InputConfig,
  InputBoxConfig,
} from "./types";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  showCloseButton = true,
  title,
  description,
  icon,
  avatar,
  input,
  children,
  primaryButton,
  secondaryButton,
}) => {
  const hasHeader = title || description || icon || avatar;
  const hasFooter = primaryButton || secondaryButton;
  const hasInput = Boolean(input);

  const paddingClass = "pt-48 px-47 lg:px-52 pb-32";

  const headerToContentGap = (() => {
    if (!hasHeader || (!hasInput && !children)) return "";
    return description ? "mt-16" : "mt-24";
  })();

  const contentToFooterGap =
    (hasInput || children) && hasFooter
      ? "mt-24"
      : hasFooter && hasHeader
        ? "mt-24"
        : "";

  const renderInput = (inputConfig: ModalInputConfig, index?: number) => {
    const key = index !== undefined ? `input-${index}` : "input";
    const isTextarea = "type" in inputConfig && inputConfig.type === "textarea";
    const { label, ...restProps } = inputConfig;

    return (
      <div key={key}>
        {label && (
          <label className="mb-8 block text-lg font-medium text-text-primary">
            {label}
          </label>
        )}
        {isTextarea ? (
          <InputBox full {...(restProps as InputBoxConfig)} />
        ) : (
          <Input full {...(restProps as InputConfig)} />
        )}
      </div>
    );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={showCloseButton}
    >
      <div className={`flex flex-col ${paddingClass}`}>
        {/* Header */}
        {hasHeader && (
          <ModalHeader
            title={title}
            description={description}
            icon={icon}
            avatar={avatar}
          />
        )}

        {/* Input */}
        {hasInput && (
          <div className={`flex flex-col gap-16 ${headerToContentGap}`}>
            {Array.isArray(input)
              ? input.map((inp, idx) => renderInput(inp, idx))
              : input && renderInput(input)}
          </div>
        )}

        {/* Contents - Custom */}
        {children && (
          <div className={!hasInput ? headerToContentGap : "mt-16"}>
            {children}
          </div>
        )}

        {/* Footer */}
        {hasFooter && (
          <div className={contentToFooterGap}>
            <ModalFooter
              primaryButton={primaryButton}
              secondaryButton={secondaryButton}
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default Modal;
