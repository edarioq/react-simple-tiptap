"use client";

import type {
  TextAlign,
  UseTextAlignConfig,
} from ".";
import type { ButtonProps } from "../../tiptap-ui-primitive/button";

import * as React from "react";

import {
  TEXT_ALIGN_SHORTCUT_KEYS,
  useTextAlign,
} from ".";
import { Button } from "../../tiptap-ui-primitive/button";
import { Badge } from "../../tiptap-ui-primitive/badge";

import { useTiptapEditor } from "../../tiptap-hooks/use-tiptap-editor";
import { parseShortcutKeys } from "../../tiptap-utils";

export interface TextAlignButtonProps
  extends Omit<ButtonProps, "type">,
    UseTextAlignConfig {
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
 * Button component for setting text alignment in a Tiptap editor.
 *
 * For custom button implementations, use the `useTextAlign` hook instead.
 */
export const TextAlignButton = React.forwardRef<
  HTMLButtonElement,
  TextAlignButtonProps
>(
  (
    {
      align,
      children,
      editor: providedEditor,
      hideWhenUnavailable = false,
      showShortcut = false,
      text,
      onAligned,
      onClick,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      handleTextAlign,
      label,
      canAlign,
      isActive,
      Icon,
      shortcutKeys,
    } = useTextAlign({
      editor,
      align,
      hideWhenUnavailable,
      onAligned,
    });

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleTextAlign();
      },
      [handleTextAlign, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        aria-label={label}
        aria-pressed={isActive}
        data-active-state={isActive ? "on" : "off"}
        data-disabled={!canAlign}
        data-style="ghost"
        disabled={!canAlign}
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
              <TextAlignShortcutBadge
                align={align}
                shortcutKeys={shortcutKeys}
              />
            )}
          </>
        )}
      </Button>
    );
  },
);

export function TextAlignShortcutBadge({
  align,
  shortcutKeys = TEXT_ALIGN_SHORTCUT_KEYS[align],
}: {
  align: TextAlign;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

TextAlignButton.displayName = "TextAlignButton";
