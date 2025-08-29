"use client";

import * as React from "react";
import clsx from "clsx";

// --- Tiptap UI Primitive ---
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

// --- Lib ---
import { parseShortcutKeys } from "../../tiptap-utils";

import "./button-colors.scss";
import "./button-group.scss";
import "./button.scss";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  shortcutKeys?: string;
  showTooltip?: boolean;
  tooltip?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      shortcutKeys,
      showTooltip = true,
      tooltip,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const shortcuts = React.useMemo(
      () => parseShortcutKeys({ shortcutKeys }),
      [shortcutKeys]
    );

    if (!tooltip || !showTooltip) {
      return (
        <button
          ref={ref}
          aria-label={ariaLabel}
          className={clsx("tiptap-button", className)}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <Tooltip delay={200}>
        <TooltipTrigger
          ref={ref}
          aria-label={ariaLabel}
          className={clsx("tiptap-button", className)}
          {...props}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent>
          {tooltip}
          <ShortcutDisplay shortcuts={shortcuts} />
        </TooltipContent>
      </Tooltip>
    );
  }
);

export const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    orientation?: "horizontal" | "vertical";
  }
>(({ children, className, orientation = "vertical", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("tiptap-button-group", className)}
      data-orientation={orientation}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
});

Button.displayName = "Button";

export const ShortcutDisplay: React.FC<{ shortcuts: string[] }> = ({
  shortcuts,
}) => {
  if (shortcuts.length === 0) return null;

  return (
    <div>
      {shortcuts.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && <kbd>+</kbd>}
          <kbd>{key}</kbd>
        </React.Fragment>
      ))}
    </div>
  );
};
ButtonGroup.displayName = "ButtonGroup";

export default Button;
