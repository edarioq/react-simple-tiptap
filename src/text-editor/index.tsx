"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";

import { Button } from "./tiptap-ui-primitive/button";
import { Spacer } from "./tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "./tiptap-ui-primitive/toolbar";
import { ImageUploadNode } from "./tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "./tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { HeadingDropdownMenu } from "./tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "./tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "./tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "./tiptap-ui/blockquote-button";
import { CodeBlockButton } from "./tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "./tiptap-ui/color-highlight-popover";
import { LinkPopover, LinkContent, LinkButton } from "./tiptap-ui/link-popover";
import { MarkButton } from "./tiptap-ui/mark-button";
import { TextAlignButton } from "./tiptap-ui/text-align-button";
import { UndoRedoButton } from "./tiptap-ui/undo-redo-button";
import { ArrowLeftIcon } from "./tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "./tiptap-icons/highlighter-icon";
import { LinkIcon } from "./tiptap-icons/link-icon";
import { useScrolling } from "./tiptap-hooks/use-scrolling";
import { useWindowSize } from "./tiptap-hooks/use-window-size";
import { useCursorVisibility } from "./tiptap-hooks/use-cursor-visibility";
import { useIsMobile } from "./tiptap-hooks/use-mobile";

import "./tiptap-node/blockquote-node/blockquote-node.scss";
import "./tiptap-node/code-block-node/code-block-node.scss";
import "./tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "./tiptap-node/list-node/list-node.scss";
import "./tiptap-node/image-node/image-node.scss";
import "./tiptap-node/heading-node/heading-node.scss";
import "./tiptap-node/paragraph-node/paragraph-node.scss";

import { handleImageUpload, MAX_FILE_SIZE } from "./tiptap-utils";

import "./styles.scss";

const MainToolbarContent = ({
  isMobile,
  onHighlighterClick,
  onLinkClick,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          portal={isMobile}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

interface Props {
  content: string;
  onContentUpdate: (content: string) => void;
}

export default function ReactSimpleTiptap({ content, onContentUpdate }: Props) {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => {
          /* eslint-disable-next-line no-console */
          console.error("Upload failed:", error);
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      onContentUpdate(html);
    },
  });

  const isScrolling = useScrolling();
  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isScrolling && isMobile
              ? { opacity: 0, transition: "opacity 0.1s ease-in-out" }
              : {}),
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              isMobile={isMobile}
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          className="simple-editor-content"
          editor={editor}
          role="presentation"
        />
      </EditorContext.Provider>
    </div>
  );
}
