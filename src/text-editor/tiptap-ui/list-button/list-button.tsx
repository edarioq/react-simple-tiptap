"use client";

import type { ButtonProps } from "../../tiptap-ui-primitive/button";
import type { ListType, UseListConfig } from ".";

import * as React from "react";

// --- Lib ---

// --- Hooks ---

// --- UI Primitives ---
import { Button } from "../../tiptap-ui-primitive/button";
import { Badge } from "../../tiptap-ui-primitive/badge";
import { LIST_SHORTCUT_KEYS, useList } from ".";

import { useTiptapEditor } from "../../tiptap-hooks/use-tiptap-editor";
import { parseShortcutKeys } from "../../tiptap-utils";

export interface ListButtonProps
  extends Omit<ButtonProps, "type">,
    UseListConfig {
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
 * Button component for toggling lists in a Tiptap editor.
 *
 * For custom button implementations, use the `useList` hook instead.
 */
export const ListButton = React.forwardRef<HTMLButtonElement, ListButtonProps>(
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
      canToggle,
      isActive,
      handleToggle,
      label,
      shortcutKeys,
      Icon,
    } = useList({
      editor,
      type,
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
              <ListShortcutBadge shortcutKeys={shortcutKeys} type={type} />
            )}
          </>
        )}
      </Button>
    );
  },
);

export function ListShortcutBadge({
  type,
  shortcutKeys = LIST_SHORTCUT_KEYS[type],
}: {
  type: ListType;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

ListButton.displayName = "ListButton";
