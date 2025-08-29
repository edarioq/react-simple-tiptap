"use client";

import * as React from "react";
import clsx from "clsx";

import "./input.scss";

function Input({ type, className, ...props }: React.ComponentProps<"input">) {
  return (
    <input className={clsx("tiptap-input", className)} type={type} {...props} />
  );
}

function InputGroup({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={clsx("tiptap-input-group", className)} {...props}>
      {children}
    </div>
  );
}

export { Input, InputGroup };
