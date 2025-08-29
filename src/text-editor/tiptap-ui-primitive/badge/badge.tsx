"use client";

import * as React from "react";
import "./badge-colors.scss";
import "./badge-group.scss";
import "./badge.scss";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  appearance?: "default" | "subdued" | "emphasized";
  size?: "default" | "small";
  trimText?: boolean;
  variant?: "ghost" | "white" | "gray" | "green" | "default";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      appearance = "default",
      children,
      className,
      size = "default",
      trimText = false,
      variant,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`tiptap-badge ${className || ""}`}
        data-appearance={appearance}
        data-size={size}
        data-style={variant}
        data-text-trim={trimText ? "on" : "off"}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
