"use client";

// --- Lib ---

// --- Tiptap UI ---
import type { Level, UseHeadingConfig } from ".";
import type { ButtonProps } from "../../tiptap-ui-primitive/button";

import * as React from "react";

import {
  HEADING_SHORTCUT_KEYS,
  useHeading,
} from ".";
import { Button } from "../../tiptap-ui-primitive/button";
import { Badge } from "../../tiptap-ui-primitive/badge";

import { parseShortcutKeys } from "../../tiptap-utils";
import { useTiptapEditor } from "../../tiptap-hooks/use-tiptap-editor";

export interface HeadingButtonProps
  extends Omit<ButtonProps, "type">,
    UseHeadingConfig {
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
 * Button component for toggling heading in a Tiptap editor.
 *
 * For custom button implementations, use the `useHeading` hook instead.
 */
export const HeadingButton = React.forwardRef<
  HTMLButtonElement,
  HeadingButtonProps
>(
  (
    {
      children,
      editor: providedEditor,
      hideWhenUnavailable = false,
      level,
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
      canToggle,
      isActive,
      handleToggle,
      label,
      Icon,
      shortcutKeys,
    } = useHeading({
      editor,
      level,
      hideWhenUnavailable,
      onToggled,
    });

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleToggle();
      },
      [handleToggle, onClick],
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
              <HeadingShortcutBadge level={level} shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Button>
    );
  },
);

export function HeadingShortcutBadge({
  level,
  shortcutKeys = HEADING_SHORTCUT_KEYS[level],
}: {
  level: Level;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

HeadingButton.displayName = "HeadingButton";
