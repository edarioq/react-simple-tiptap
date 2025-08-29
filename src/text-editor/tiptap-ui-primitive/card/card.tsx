"use client";

import * as React from "react";
import "./card.scss";
import clsx from "clsx";

const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx("tiptap-card", className)} {...props} />
    );
  },
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("tiptap-card-header", className)}
      {...props}
    />
  );
});

CardHeader.displayName = "CardHeader";

const CardBody = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("tiptap-card-body", className)}
        {...props}
      />
    );
  },
);

CardBody.displayName = "CardBody";

const CardItemGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    orientation?: "horizontal" | "vertical";
  }
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("tiptap-card-item-group", className)}
      data-orientation={orientation}
      {...props}
    />
  );
});

CardItemGroup.displayName = "CardItemGroup";

const CardGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("tiptap-card-group-label", className)}
      {...props}
    />
  );
});

CardGroupLabel.displayName = "CardGroupLabel";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("tiptap-card-footer", className)}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";

export {
  Card,
  CardBody,
  CardFooter,
  CardGroupLabel,
  CardHeader,
  CardItemGroup,
};
