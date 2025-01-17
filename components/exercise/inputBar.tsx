import { IMessage, IMessageType } from "@/types/messages";
import { useLayoutEffect, useRef } from "react";
import { ArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";

interface InputBarProps {
  addMessage: (message: IMessage) => void;
  setTextInput: (text: string) => void;
  textInput: string;
  newSession: () => void;
}

export default function InputBar(props: InputBarProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const onChange = (event) => props.setTextInput(event.target.value);

  const MIN_HEIGHT = 32;

  useLayoutEffect(() => {
    // reset height
    textAreaRef.current.style.height = "inherit";
    // set height to a maximum of 5 rows
    textAreaRef.current.style.height = `${Math.min(
      Math.max(textAreaRef.current.scrollHeight, MIN_HEIGHT),
      MIN_HEIGHT * 5
    )}px`;
  }, [props.textInput]);

  const submitMessage = () => {
    console.log(props.textInput);
    if (props.textInput !== "") {
      props.addMessage({
        type: IMessageType.USER_QUESTION,
        message: props.textInput,
      });
      props.setTextInput("");
      textAreaRef.current.focus();
    }
  };

  const enterKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      submitMessage();
      e.preventDefault();
    }
  };

  return (
    <div className="flex items-center shadow bg-white dark:bg-neutral-700 rounded-xl focus-within:ring ring-secondary border-t border-t-white/10 transition">
      <button
        onClick={props.newSession}
        className="hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-full p-2 ml-2 transition"
      >
        <PlusIcon className="w-4 h-4 stroke-[3] stroke-neutral-600 dark:stroke-neutral-300" />
      </button>
      <textarea
        className={`grow min-h-[${MIN_HEIGHT}px] text-black dark:text-white focus:outline-none bg-transparent pl-4 py-4 resize-none items-center`}
        placeholder="Ask a question..."
        rows={1}
        spellCheck={false}
        maxLength={1000}
        onChange={onChange}
        onKeyDown={enterKey}
        ref={textAreaRef}
        value={props.textInput}
      ></textarea>
      <button
        onClick={submitMessage}
        className={`group flex items-center justify-center w-8 h-8 rounded-lg ml-2 mr-3 ${
          props.textInput != ""
            ? "bg-primary hover:bg-primary-dark transition"
            : "bg-neutral-400 dark:bg-neutral-500/80 cursor-default"
        } `}
      >
        <ArrowUpIcon
          className={`w-4 h-4 stroke-[3] ${
            props.textInput != ""
              ? "stroke-white"
              : "stroke-white dark:stroke-neutral-700"
          }`}
        />
      </button>
    </div>
  );
}
