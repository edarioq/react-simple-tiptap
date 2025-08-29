"use client";

import type { Editor } from "@tiptap/react";
import type { UseLinkPopoverConfig } from ".";
import type { ButtonProps } from "../../tiptap-ui-primitive/button";

import * as React from "react";

import { CornerDownLeftIcon } from "../../tiptap-icons/corner-down-left-icon";
import { ExternalLinkIcon } from "../../tiptap-icons/external-link-icon";
import { LinkIcon } from "../../tiptap-icons/link-icon";
import { TrashIcon } from "../../tiptap-icons/trash-icon";
import { useLinkPopover } from ".";
import { Button, ButtonGroup } from "../../tiptap-ui-primitive/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../tiptap-ui-primitive/popover";
import { Separator } from "../../tiptap-ui-primitive/separator";
import { Card, CardBody, CardItemGroup } from "../../tiptap-ui-primitive/card";
import { Input, InputGroup } from "../../tiptap-ui-primitive/input";

import { useTiptapEditor } from "../../tiptap-hooks/use-tiptap-editor";
import { useIsMobile } from "../../tiptap-hooks/use-mobile";

export interface LinkMainProps {
  /**
   * The URL to set for the link.
   */
  isActive: boolean;
  /**
   * Function to update the URL state.
   */
  openLink: () => void;
  /**
   * Function to set the link in the editor.
   */
  removeLink: () => void;
  /**
   * Function to remove the link from the editor.
   */
  url: string;
  /**
   * Function to open the link.
   */
  setLink: () => void;
  /**
   * Whether the link is currently active in the editor.
   */
  setUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface LinkPopoverProps
  extends Omit<ButtonProps, "type">,
    UseLinkPopoverConfig {
  /**
   * Callback for when the popover opens or closes.
   */
  autoOpenOnLinkActive?: boolean;
  /**
   * Whether to automatically open the popover when a link is active.
   * @default true
   */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Link button component for triggering the link popover
 */
export const LinkButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        aria-label="Link"
        className={className}
        data-style="ghost"
        role="button"
        tabIndex={-1}
        tooltip="Link"
        type="button"
        {...props}
      >
        {children || <LinkIcon className="tiptap-button-icon" />}
      </Button>
    );
  },
);

LinkButton.displayName = "LinkButton";

/**
 * Main content component for the link popover
 */
const LinkMain: React.FC<LinkMainProps> = ({
  isActive,
  openLink,
  removeLink,
  url,
  setLink,
  setUrl,
}) => {
  const isMobile = useIsMobile();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setLink();
    }
  };

  return (
    <Card
      style={{
        ...(isMobile ? { boxShadow: "none", border: 0 } : {}),
      }}
    >
      <CardBody
        style={{
          ...(isMobile ? { padding: 0 } : {}),
        }}
      >
        <CardItemGroup orientation="horizontal">
          <InputGroup>
            <Input
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              placeholder="Paste a link..."
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </InputGroup>

          <ButtonGroup orientation="horizontal">
            <Button
              data-style="ghost"
              disabled={!url && !isActive}
              title="Apply link"
              type="button"
              onClick={setLink}
            >
              <CornerDownLeftIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>

          <Separator />

          <ButtonGroup orientation="horizontal">
            <Button
              data-style="ghost"
              disabled={!url && !isActive}
              title="Open in new window"
              type="button"
              onClick={openLink}
            >
              <ExternalLinkIcon className="tiptap-button-icon" />
            </Button>

            <Button
              data-style="ghost"
              disabled={!url && !isActive}
              title="Remove link"
              type="button"
              onClick={removeLink}
            >
              <TrashIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};

/**
 * Link content component for standalone use
 */
export const LinkContent: React.FC<{
  editor?: Editor | null;
}> = ({ editor }) => {
  const linkPopover = useLinkPopover({
    editor,
  });

  return <LinkMain {...linkPopover} />;
};

/**
 * Link popover component for Tiptap editors.
 *
 * For custom popover implementations, use the `useLinkPopover` hook instead.
 */
export const LinkPopover = React.forwardRef<
  HTMLButtonElement,
  LinkPopoverProps
>(
  (
    {
      autoOpenOnLinkActive = true,
      children,
      editor: providedEditor,
      hideWhenUnavailable = false,
      onClick,
      onOpenChange,
      onSetLink,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = React.useState(false);

    const {
      isVisible,
      canSet,
      isActive,
      url,
      setUrl,
      setLink,
      removeLink,
      openLink,
      label,
      Icon,
    } = useLinkPopover({
      editor,
      hideWhenUnavailable,
      onSetLink,
    });

    const handleOnOpenChange = React.useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      },
      [onOpenChange],
    );

    const handleSetLink = React.useCallback(() => {
      setLink();
      setIsOpen(false);
    }, [setLink]);

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setIsOpen(!isOpen);
      },
      [onClick, isOpen],
    );

    React.useEffect(() => {
      if (autoOpenOnLinkActive && isActive) {
        setIsOpen(true);
      }
    }, [autoOpenOnLinkActive, isActive]);

    if (!isVisible) {
      return null;
    }

    return (
      <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
        <PopoverTrigger asChild>
          <LinkButton
            aria-label={label}
            aria-pressed={isActive}
            data-active-state={isActive ? "on" : "off"}
            data-disabled={!canSet}
            disabled={!canSet}
            onClick={handleClick}
            {...buttonProps}
            ref={ref}
          >
            {children ?? <Icon className="tiptap-button-icon" />}
          </LinkButton>
        </PopoverTrigger>

        <PopoverContent>
          <LinkMain
            isActive={isActive}
            openLink={openLink}
            removeLink={removeLink}
            setLink={handleSetLink}
            setUrl={setUrl}
            url={url}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

LinkPopover.displayName = "LinkPopover";

export default LinkPopover;
