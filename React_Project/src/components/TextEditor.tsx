import { useEffect, useRef, useState } from "react";

import { useField, useFormikContext } from "formik";

import Quill from "quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { EditorType } from "../lib/types";

type SuggestionPosition = { start: number; end: number };

const TextEditor = ({
    name,
    placeholder,
    type,
    ...props
}: {
    name: string;
    placeholder: string;
    type: EditorType;
}) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const quillRef = useRef<ReactQuill>(null);

    const suggestionTimeOutRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isSuggesting = useRef(false);
    const suggestionPosition = useRef<SuggestionPosition>({ start: 0, end: 0 });

    const [suggestion, setSuggestion] = useState("");

    const handleChange = (value: string) => {
        setFieldValue(name, value);
    };

    const resetSuggestionPosition = () => {
        suggestionPosition.current = { start: 0, end: 0 };
    };

    const getQuillEditor = () => {
        if (quillRef.current) {
            return quillRef.current.getEditor();
        }

        return null;
    };

    const isCursorAtEnd = () => {
        const quill = getQuillEditor();
        if (!quill) return false;

        const selection = quill.getSelection();
        if (selection) {
            const cursorPosition = selection.index;
            const textLength = quill.getText().length - 1;
            return cursorPosition >= textLength;
        }
        return false;
    };

    const clearSuggestionText = () => {
        const quill = getQuillEditor();

        if (isSuggesting.current && quill) {
            quill.deleteText(suggestionPosition.current.start, suggestionPosition.current.end);
        }
    };

    const handleTab = (event: KeyboardEvent, quill: Quill) => {
        if (event.key !== "Tab") return;
        event.preventDefault();

        const selection = quill.getSelection();

        if (!isSuggesting.current || !selection) return;

        quill.insertText(selection.index, suggestion, "api");
        quill.setSelection(quill.getLength(), 0);

        resetSuggestionPosition();
    };

    const fetch = async () => {
        return new Promise((resolve, _) => {
            setTimeout(() => {
                resolve(0);
            }, 3000);
        });
    };

    const updateSuggestion = (quill: Quill, source: string) => {
        if (source === "api") return;
        clearSuggestionText();

        if (suggestionTimeOutRef.current) clearTimeout(suggestionTimeOutRef.current);
        suggestionTimeOutRef.current = setTimeout(async () => {
            await fetch();

            const selection = quill.getSelection();
            if (selection && suggestion && isCursorAtEnd()) {
                const cursorPosition = selection.index;

                isSuggesting.current = true;

                clearSuggestionText();

                suggestionPosition.current = {
                    start: cursorPosition,
                    end: cursorPosition + 1 + suggestion.length,
                };

                quill.insertText(cursorPosition, suggestion, {
                    color: "rgba(0,0,0,0.3)",
                    "user-select": "none",
                });

                quill.setSelection(cursorPosition, 0);
            }
        }, 3000);
    };

    useEffect(() => {
        const quill = getQuillEditor();
        if (!quill) return;

        quill.on("text-change", (_, __, source) => updateSuggestion(quill, source));
        quill.on("selection-change", (_, __, source) => {
            if (source === "user") {
                // If a user changes cursor position, we need to hide suggestion
                clearSuggestionText();

                isSuggesting.current = false;
                resetSuggestionPosition();
            }
        });

        const tabListener = (e: KeyboardEvent) => handleTab(e, quill);
        document.addEventListener("keydown", tabListener);

        return () => {
            document.removeEventListener("keydown", tabListener);
        };
    }, []);

    return (
        <div className="w-full">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                placeholder={placeholder}
                value={field.value}
                onChange={handleChange}
                className="w-full h-64 pb-11 bg-white"
                {...props}
            />
            {meta.touched && meta.error ? (
                <div className="text-red-500 text-sm mt-1">{meta.error}</div>
            ) : null}
        </div>
    );
};

export default TextEditor;
