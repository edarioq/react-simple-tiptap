"use client";

import type {
  UndoRedoAction,
  UseUndoRedoConfig,
} from ".";
import type { ButtonProps } from "../../tiptap-ui-primitive/button";

import * as React from "react";

import {
  UNDO_REDO_SHORTCUT_KEYS,
  useUndoRedo,
} from ".";
import { Button } from "../../tiptap-ui-primitive/button";
import { Badge } from "../../tiptap-ui-primitive/badge";

import { useTiptapEditor } from "../../tiptap-hooks/use-tiptap-editor";
import { parseShortcutKeys } from "../../tiptap-utils";

export interface UndoRedoButtonProps
  extends Omit<ButtonProps, "type">,
    UseUndoRedoConfig {
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

export function HistoryShortcutBadge({
  action,
  shortcutKeys = UNDO_REDO_SHORTCUT_KEYS[action],
}: {
  action: UndoRedoAction;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for triggering undo/redo actions in a Tiptap editor.
 *
 * For custom button implementations, use the `useHistory` hook instead.
 */
export const UndoRedoButton = React.forwardRef<
  HTMLButtonElement,
  UndoRedoButtonProps
>(
  (
    {
      action,
      children,
      editor: providedEditor,
      hideWhenUnavailable = false,
      showShortcut = false,
      text,
      onClick,
      onExecuted,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const { isVisible, handleAction, label, canExecute, Icon, shortcutKeys } =
      useUndoRedo({
        editor,
        action,
        hideWhenUnavailable,
        onExecuted,
      });

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleAction();
      },
      [handleAction, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        aria-label={label}
        data-disabled={!canExecute}
        data-style="ghost"
        disabled={!canExecute}
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
              <HistoryShortcutBadge
                action={action}
                shortcutKeys={shortcutKeys}
              />
            )}
          </>
        )}
      </Button>
    );
  },
);

UndoRedoButton.displayName = "UndoRedoButton";
