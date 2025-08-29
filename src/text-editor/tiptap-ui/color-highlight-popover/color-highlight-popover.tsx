"use client";

import type { ButtonProps } from "../../tiptap-ui-primitive/button";
import type {
  HighlightColor,
  UseColorHighlightConfig,
} from "../color-highlight-button";

import * as React from "react";
import { type Editor } from "@tiptap/react";

import { BanIcon } from "../../tiptap-icons/ban-icon";
import { HighlighterIcon } from "../../tiptap-icons/highlighter-icon";
import { Button, ButtonGroup } from "../../tiptap-ui-primitive/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../tiptap-ui-primitive/popover";
import { Separator } from "../../tiptap-ui-primitive/separator";
import { Card, CardBody, CardItemGroup } from "../../tiptap-ui-primitive/card";
import {
  ColorHighlightButton,
  pickHighlightColorsByValue,
  useColorHighlight,
} from "../color-highlight-button";

import { useTiptapEditor } from "../../tiptap-hooks/use-tiptap-editor";
import { useIsMobile } from "../../tiptap-hooks/use-mobile";
import { useMenuNavigation } from "../../tiptap-hooks/use-menu-navigation";

export interface ColorHighlightPopoverContentProps {
  /**
   * The Tiptap editor instance.
   */
  colors?: HighlightColor[];
  /**
   * Optional colors to use in the highlight popover.
   * If not provided, defaults to a predefined set of colors.
   */
  editor?: Editor | null;
}

export interface ColorHighlightPopoverProps
  extends Omit<ButtonProps, "type">,
    Pick<
      UseColorHighlightConfig,
      "editor" | "hideWhenUnavailable" | "onApplied"
    > {
  /**
   * Optional colors to use in the highlight popover.
   * If not provided, defaults to a predefined set of colors.
   */
  colors?: HighlightColor[];
}

export function ColorHighlightPopover({
  colors = pickHighlightColorsByValue([
    "var(--tt-color-highlight-green)",
    "var(--tt-color-highlight-blue)",
    "var(--tt-color-highlight-red)",
    "var(--tt-color-highlight-purple)",
    "var(--tt-color-highlight-yellow)",
  ]),
  editor: providedEditor,
  hideWhenUnavailable = false,
  onApplied,
  ...props
}: ColorHighlightPopoverProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = React.useState(false);
  const { isVisible, canColorHighlight, isActive, label, Icon } =
    useColorHighlight({
      editor,
      hideWhenUnavailable,
      onApplied,
    });

  if (!isVisible) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <ColorHighlightPopoverButton
          aria-label={label}
          aria-pressed={isActive}
          data-active-state={isActive ? "on" : "off"}
          data-disabled={!canColorHighlight}
          disabled={!canColorHighlight}
          tooltip={label}
          {...props}
        >
          <Icon className="tiptap-button-icon" />
        </ColorHighlightPopoverButton>
      </PopoverTrigger>
      <PopoverContent aria-label="Highlight colors">
        <ColorHighlightPopoverContent colors={colors} editor={editor} />
      </PopoverContent>
    </Popover>
  );
}

export const ColorHighlightPopoverButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ children, className, ...props }, ref) => (
  <Button
    ref={ref}
    aria-label="Highlight text"
    className={className}
    data-appearance="default"
    data-style="ghost"
    role="button"
    tabIndex={-1}
    tooltip="Highlight"
    type="button"
    {...props}
  >
    {children ?? <HighlighterIcon className="tiptap-button-icon" />}
  </Button>
));

export function ColorHighlightPopoverContent({
  colors = pickHighlightColorsByValue([
    "var(--tt-color-highlight-green)",
    "var(--tt-color-highlight-blue)",
    "var(--tt-color-highlight-red)",
    "var(--tt-color-highlight-purple)",
    "var(--tt-color-highlight-yellow)",
  ]),
  editor,
}: ColorHighlightPopoverContentProps) {
  const { handleRemoveHighlight } = useColorHighlight({ editor });
  const isMobile = useIsMobile();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const menuItems = React.useMemo(
    () => [...colors, { label: "Remove highlight", value: "none" }],
    [colors],
  );

  const { selectedIndex } = useMenuNavigation({
    containerRef,
    items: menuItems,
    orientation: "both",
    onSelect: (item) => {
      if (!containerRef.current) return false;
      const highlightedElement = containerRef.current.querySelector(
        '[data-highlighted="true"]',
      ) as HTMLElement;

      if (highlightedElement) highlightedElement.click();
      if (item.value === "none") handleRemoveHighlight();
    },
    autoSelectFirstItem: false,
  });

  return (
    <Card
      ref={containerRef}
      style={isMobile ? { boxShadow: "none", border: 0 } : {}}
      tabIndex={0}
    >
      <CardBody style={isMobile ? { padding: 0 } : {}}>
        <CardItemGroup orientation="horizontal">
          <ButtonGroup orientation="horizontal">
            {colors.map((color, index) => (
              <ColorHighlightButton
                key={color.value}
                aria-label={`${color.label} highlight color`}
                data-highlighted={selectedIndex === index}
                editor={editor}
                highlightColor={color.value}
                tabIndex={index === selectedIndex ? 0 : -1}
                tooltip={color.label}
              />
            ))}
          </ButtonGroup>
          <Separator />
          <ButtonGroup orientation="horizontal">
            <Button
              aria-label="Remove highlight"
              data-highlighted={selectedIndex === colors.length}
              data-style="ghost"
              role="menuitem"
              tabIndex={selectedIndex === colors.length ? 0 : -1}
              tooltip="Remove highlight"
              type="button"
              onClick={handleRemoveHighlight}
            >
              <BanIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
}

ColorHighlightPopoverButton.displayName = "ColorHighlightPopoverButton";

export default ColorHighlightPopover;
