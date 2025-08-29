"use client";

// --- Hooks ---

// --- Icons ---

// --- Tiptap UI ---

// --- UI Primitives ---
import type { ButtonProps } from "../../tiptap-ui-primitive/button";

import { type Editor } from "@tiptap/react";
import * as React from "react";

import { ListButton, type ListType } from "../list-button";
import { ChevronDownIcon } from "../../tiptap-icons/chevron-down-icon";
import { Button, ButtonGroup } from "../../tiptap-ui-primitive/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../tiptap-ui-primitive/dropdown-menu";
import { Card, CardBody } from "../../tiptap-ui-primitive/card";

import { useListDropdownMenu } from "./use-list-dropdown-menu";

import { useTiptapEditor } from "../../tiptap-hooks/use-tiptap-editor";

export interface ListDropdownMenuProps extends Omit<ButtonProps, "type"> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor;
  /**
   * The list types to display in the dropdown.
   */
  hideWhenUnavailable?: boolean;
  /**
   * Whether the dropdown should be hidden when no list types are available
   * @default false
   */
  portal?: boolean;
  /**
   * Callback for when the dropdown opens or closes
   */
  types?: ListType[];
  /**
   * Whether to render the dropdown menu in a portal
   * @default false
   */
  onOpenChange?: (isOpen: boolean) => void;
}

export function ListDropdownMenu({
  editor: providedEditor,
  hideWhenUnavailable = false,
  portal = false,
  types = ["bulletList", "orderedList", "taskList"],
  onOpenChange,
  ...props
}: ListDropdownMenuProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = React.useState(false);

  const { filteredLists, canToggle, isActive, isVisible, Icon } =
    useListDropdownMenu({
      editor,
      types,
      hideWhenUnavailable,
    });

  const handleOnOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  if (!isVisible || !editor || !editor.isEditable) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="List options"
          data-active-state={isActive ? "on" : "off"}
          data-disabled={!canToggle}
          data-style="ghost"
          disabled={!canToggle}
          role="button"
          tabIndex={-1}
          tooltip="List"
          type="button"
          {...props}
        >
          <Icon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" portal={portal}>
        <Card>
          <CardBody>
            <ButtonGroup>
              {filteredLists.map((option) => (
                <DropdownMenuItem key={option.type} asChild>
                  <ListButton
                    editor={editor}
                    showTooltip={false}
                    text={option.label}
                    type={option.type}
                  />
                </DropdownMenuItem>
              ))}
            </ButtonGroup>
          </CardBody>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ListDropdownMenu;
