"use client";

import * as React from "react";
import clsx from "clsx";

import "./separator.scss";

export type Orientation = "horizontal" | "vertical";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  decorative?: boolean;
  orientation?: Orientation;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, decorative, orientation = "vertical", ...divProps }, ref) => {
    const ariaOrientation =
      orientation === "vertical" ? orientation : undefined;
    const semanticProps = decorative
      ? { role: "none" }
      : { "aria-orientation": ariaOrientation, role: "separator" };

    return (
      <div
        className={clsx("tiptap-separator", className)}
        data-orientation={orientation}
        {...semanticProps}
        {...divProps}
        ref={ref}
      />
    );
  },
);

Separator.displayName = "Separator";
