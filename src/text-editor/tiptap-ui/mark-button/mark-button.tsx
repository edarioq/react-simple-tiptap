"use client";

import type { Mark, UseMarkConfig } from ".";
import type { ButtonProps } from "../../tiptap-ui-primitive/button";

import * as React from "react";

import { MARK_SHORTCUT_KEYS, useMark } from ".";
import { Button } from "../../tiptap-ui-primitive/button";
import { Badge } from "../../tiptap-ui-primitive/badge";

import { useTiptapEditor } from "../../tiptap-hooks/use-tiptap-editor";
import { parseShortcutKeys } from "../../tiptap-utils";

export interface MarkButtonProps
  extends Omit<ButtonProps, "type">,
    UseMarkConfig {
  /**
   * Optional text to display alongside the icon.
   */
  showShortcut?: boolean;
  /**
   * Optional show shortcut keys in the button.
   * @default false
   */
  text?: string;
}

/**
 * Button component for toggling marks in a Tiptap editor.
 *
 * For custom button implementations, use the `useMark` hook instead.
 */
export const MarkButton = React.forwardRef<HTMLButtonElement, MarkButtonProps>(
  (
    {
      type,
      children,
      editor: providedEditor,
      hideWhenUnavailable = false,
      showShortcut = false,
      text,
      onClick,
      onToggled,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      handleMark,
      label,
      canToggle,
      isActive,
      Icon,
      shortcutKeys,
    } = useMark({
      editor,
      type,
      hideWhenUnavailable,
      onToggled,
    });

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleMark();
      },
      [handleMark, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        aria-label={label}
        aria-pressed={isActive}
        data-active-state={isActive ? "on" : "off"}
        data-disabled={!canToggle}
        data-style="ghost"
        disabled={!canToggle}
        role="button"
        tabIndex={-1}
        tooltip={label}
        type="button"
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <MarkShortcutBadge shortcutKeys={shortcutKeys} type={type} />
            )}
          </>
        )}
      </Button>
    );
  },
);

export function MarkShortcutBadge({
  type,
  shortcutKeys = MARK_SHORTCUT_KEYS[type],
}: {
  type: Mark;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

MarkButton.displayName = "MarkButton";
