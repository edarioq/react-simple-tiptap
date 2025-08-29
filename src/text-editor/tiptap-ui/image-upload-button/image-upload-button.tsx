"use client";

// --- Lib ---

// --- Hooks ---

// --- Tiptap UI ---
import type { UseImageUploadConfig } from ".";
import type { ButtonProps } from "../../tiptap-ui-primitive/button";

import * as React from "react";

import {
  IMAGE_UPLOAD_SHORTCUT_KEY,
  useImageUpload,
} from ".";
import { Button } from "../../tiptap-ui-primitive/button";
import { Badge } from "../../tiptap-ui-primitive/badge";

import { useTiptapEditor } from "../../tiptap-hooks/use-tiptap-editor";
import { parseShortcutKeys } from "../../tiptap-utils";

export interface ImageUploadButtonProps
  extends Omit<ButtonProps, "type">,
    UseImageUploadConfig {
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

export function ImageShortcutBadge({
  shortcutKeys = IMAGE_UPLOAD_SHORTCUT_KEY,
}: {
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for uploading/inserting images in a Tiptap editor.
 *
 * For custom button implementations, use the `useImage` hook instead.
 */
export const ImageUploadButton = React.forwardRef<
  HTMLButtonElement,
  ImageUploadButtonProps
>(
  (
    {
      children,
      editor: providedEditor,
      hideWhenUnavailable = false,
      showShortcut = false,
      text,
      onClick,
      onInserted,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      canInsert,
      handleImage,
      label,
      isActive,
      shortcutKeys,
      Icon,
    } = useImageUpload({
      editor,
      hideWhenUnavailable,
      onInserted,
    });

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleImage();
      },
      [handleImage, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        aria-label={label}
        aria-pressed={isActive}
        data-active-state={isActive ? "on" : "off"}
        data-disabled={!canInsert}
        data-style="ghost"
        disabled={!canInsert}
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
            {showShortcut && <ImageShortcutBadge shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    );
  },
);

ImageUploadButton.displayName = "ImageUploadButton";
