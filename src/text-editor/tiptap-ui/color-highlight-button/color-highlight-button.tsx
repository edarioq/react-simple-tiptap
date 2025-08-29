"use client";

// --- Lib ---

// --- Hooks ---

// --- Tiptap UI ---
import type { UseColorHighlightConfig } from ".";
import type { ButtonProps } from "../../tiptap-ui-primitive/button";

import * as React from "react";

import {
  COLOR_HIGHLIGHT_SHORTCUT_KEY,
  useColorHighlight,
} from ".";
import { Button } from "../../tiptap-ui-primitive/button";
import { Badge } from "../../tiptap-ui-primitive/badge";

import { useTiptapEditor } from "../../tiptap-hooks/use-tiptap-editor";
import { parseShortcutKeys } from "../../tiptap-utils";

// --- Styles ---
import "./color-highlight-button.scss";

export interface ColorHighlightButtonProps
  extends Omit<ButtonProps, "type">,
    UseColorHighlightConfig {
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
 * Button component for applying color highlights in a Tiptap editor.
 *
 * For custom button implementations, use the `useColorHighlight` hook instead.
 */
export const ColorHighlightButton = React.forwardRef<
  HTMLButtonElement,
  ColorHighlightButtonProps
>(
  (
    {
      children,
      editor: providedEditor,
      hideWhenUnavailable = false,
      highlightColor,
      showShortcut = false,
      style,
      text,
      onApplied,
      onClick,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      canColorHighlight,
      isActive,
      handleColorHighlight,
      label,
      shortcutKeys,
    } = useColorHighlight({
      editor,
      highlightColor,
      label: text || `Toggle highlight (${highlightColor})`,
      hideWhenUnavailable,
      onApplied,
    });

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleColorHighlight();
      },
      [handleColorHighlight, onClick],
    );

    const buttonStyle = React.useMemo(
      () =>
        ({
          ...style,
          "--highlight-color": highlightColor,
        }) as React.CSSProperties,
      [highlightColor, style],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        aria-label={label}
        aria-pressed={isActive}
        data-active-state={isActive ? "on" : "off"}
        data-disabled={!canColorHighlight}
        data-style="ghost"
        disabled={!canColorHighlight}
        role="button"
        style={buttonStyle}
        tabIndex={-1}
        tooltip={label}
        type="button"
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <span
              className="tiptap-button-highlight"
              style={
                { "--highlight-color": highlightColor } as React.CSSProperties
              }
            />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <ColorHighlightShortcutBadge shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Button>
    );
  },
);

export function ColorHighlightShortcutBadge({
  shortcutKeys = COLOR_HIGHLIGHT_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

ColorHighlightButton.displayName = "ColorHighlightButton";
