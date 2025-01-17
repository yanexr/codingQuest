import { Editor } from "@monaco-editor/react";
import { Fragment, useContext, useState } from "react";
import {
  ChevronDownIcon,
  DocumentArrowUpIcon,
  PlayIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import { ILanguage } from "@/types/quest";
import { IMessage, IMessageType } from "@/types/messages";
import Image from "next/image";
import { Theme, UserContext, UserContextProps } from "@/pages/_app";
import { codeExecution } from "@/services/codeExecution";
import Modal from "../modal";
import Button from "../button";
import { usePyodide } from "@/hooks/usePyodide";

interface CodeEditorProps {
  languages: ILanguage[];
  setCode: (code: string) => void;
  currentQuestion: number;
  selectedLanguage: number;
  setSelectedLanguage: (index: number) => void;
  addMessage: (message: IMessage) => void;
  updateLastMessage: (message: IMessage, currentQ: number) => void;
  submission: number;
  stdin: string;
  setStdin: (stdin: string) => void;
  expectedStdout: string;
  setExpectedStdout: (expectedStdout: string) => void;
  stdout: string;
  setStdout: (stdout: string, currentQ: number) => void;
}

export default function CodeEditor(props: CodeEditorProps) {
  const [isTerminalOpen, setTerminalOpen] = useState<boolean>(false);
  const { theme } = useContext<UserContextProps>(UserContext);
  const { pyodide, loading, error, loadPyodide } = usePyodide();

  const runPython = async (code: string) => {
    let py = pyodide;
    if (!py) {
      try {
        py = await loadPyodide();
      } catch (err) {
        return `Error: could not load Pyodide. ${err}`;
      }
    }
    try {
      // Redirect stdout
      await py.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
        input_str = """${props.stdin}"""
      `);

      // Run the user's Python code
      await py.runPython(code);

      // Get the stdout content
      const output = py.runPython(`
        sys.stdout.getvalue()
      `);

      // Reset stdout to default
      await py.runPython(`
        sys.stdout = sys.__stdout__
      `);

      return output;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  };

  const getTheme = (): Theme => {
    if (theme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      } else {
        return "light";
      }
    } else {
      return theme;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(props.languages[props.selectedLanguage].code);
  };

  const handleDownload = () => {
    const code = props.languages[props.selectedLanguage].code;
    const extension = props.languages[props.selectedLanguage].extension;

    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quest.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const submitCode = async () => {
    props.addMessage({
      type: IMessageType.USER_SUBMISSION,
      message: props.languages[props.selectedLanguage].code,
      language: props.languages[props.selectedLanguage].name,
      submission: props.submission + 1,
    });
  };

  function defineThemes(monaco: any) {
    monaco.editor.defineTheme("editorDarkTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        {
          token: "comment",
          foreground: "#3AA672",
          fontStyle: "italic",
        },
        { token: "constant", foreground: "#e06c75" },
      ],
      colors: {
        "editor.background": "#171717",
        "editor.lineHighlightBackground": "#262626",
        "editor.selectionBackground": "#3AA67260",
      },
    });
    monaco.editor.defineTheme("editorLightTheme", {
      base: "vs",
      inherit: true,
      rules: [
        {
          token: "comment",
          foreground: "#3AA672",
          fontStyle: "italic",
        },
        { token: "constant", foreground: "#e06c75" },
      ],
      colors: {
        "editor.background": "#FFFFFFFF",
        "editor.lineHighlightBackground": "#1e293b15",
        "editor.selectionBackground": "#3AA67260",
      },
    });
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between pl-4 pr-6 py-3 relative bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 text-sm">
        <Listbox
          value={props.selectedLanguage}
          onChange={props.setSelectedLanguage}
        >
          {({ open }) => (
            <div>
              <Listbox.Button className="flex space-x-2 items-center justify-start transition hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg px-2 py-1">
                <Image
                  width={18}
                  height={18}
                  src={
                    "vscode-icons/" +
                    props.languages[props.selectedLanguage].name
                      .replace("#", "sharp")
                      .replace("Python (local)", "Python") +
                    ".svg"
                  }
                  aria-hidden="true"
                  alt={"file icon"}
                />
                <span>{props.languages[props.selectedLanguage].name}</span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-4 w-4 ml-2 transition duration-200`}
                />
              </Listbox.Button>
              <Transition
                as={Fragment}
                enter="transition-opacity duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute rounded-lg z-40 w-48 max-h-80 shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-700 overflow-y-auto mt-2">
                  <Listbox.Options className="w-full p-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50">
                    {props.languages.map((language: ILanguage, index) => (
                      <Listbox.Option
                        key={language.name}
                        value={index}
                        className={`${
                          index === props.selectedLanguage ? "font-bold" : ""
                        } rounded text-sm py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer`}
                      >
                        <div className="flex items-center">
                          <div className="ml-2 mr-3">
                            <Image
                              width={18}
                              height={18}
                              src={
                                "vscode-icons/" +
                                language.name
                                  .replace("#", "sharp")
                                  .replace("Python (local)", "Python") +
                                ".svg"
                              }
                              aria-hidden="true"
                              alt={"file icon"}
                            />
                          </div>
                          <span>{language.name}</span>
                        </div>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Transition>
            </div>
          )}
        </Listbox>
        <div className="flex items-center space-x-5">
          <ClipboardDocumentIcon
            strokeWidth={1.5}
            className="h-5 w-5 cursor-pointer transition stroke-neutral-700 dark:stroke-neutral-300 hover:stroke-primary dark:hover:stroke-primary [&:not(:active)]:animate-[spin_0.5s_ease-in-out]"
            onClick={handleCopy}
          />
          <ArrowDownTrayIcon
            strokeWidth={1.5}
            className="h-5 w-5 cursor-pointer transition stroke-neutral-700 dark:stroke-neutral-300 hover:stroke-primary dark:hover:stroke-primary"
            onClick={handleDownload}
          />
        </div>
      </div>
      <Editor
        className="h-full"
        language={props.languages[props.selectedLanguage].label}
        theme={getTheme() === "dark" ? "editorDarkTheme" : "editorLightTheme"}
        options={{
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          wordWrap: "on",
        }}
        value={props.languages[props.selectedLanguage].code}
        onChange={(value) => props.setCode(value)}
        beforeMount={defineThemes}
      />
      <div className="flex flex-col absolute z-20 left-0 right-0 bottom-0 pointer-events-none">
        <div className="flex justify-end space-x-3 mr-10 md:mb-28 mb-10">
          <button
            onClick={() => setTerminalOpen((prevState) => !prevState)}
            className="transition flex items-center justify-center flex-shrink-0 h-10 w-10 bg-secondary hover:bg-secondary-dark shadow-lg rounded-full pointer-events-auto border-t border-t-white/30"
          >
            <PlayIcon className="h-5 w-5 stroke-2 m-1 stroke-white fill-white" />
          </button>
          <button
            onClick={submitCode}
            className="pointer-events-auto text-white flex items-center font-medium transition shadow-lg bg-primary hover:bg-primary-dark rounded-full px-5  border-t border-t-white/30"
          >
            <span>Submit</span>
            <DocumentArrowUpIcon
              aria-hidden="true"
              className="h-5 w-5 stroke-2 ml-2"
            />
          </button>
        </div>
      </div>
      <Modal
        className="bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-600 p-3"
        isOpen={isTerminalOpen}
        setOpen={setTerminalOpen}
      >
        <p className="ml-2 mb-1 text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
          STDIN
        </p>
        <input
          onChange={(e) => props.setStdin(e.target.value)}
          value={props.stdin}
          className="transition bg-transparent rounded-lg p-3 mb-6 w-full h-11 text-black dark:text-white outline-none border-2 border-neutral-400 dark:border-neutral-500 focus:border-secondary dark:focus:border-secondary"
        />
        <p className="ml-2 mb-1 text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
          TARGET STDOUT
        </p>
        <input
          onChange={(e) => props.setExpectedStdout(e.target.value)}
          value={props.expectedStdout}
          className="transition bg-transparent rounded-lg p-3  mb-8 w-full h-11 text-black dark:text-white outline-none border-2 border-neutral-400 dark:border-neutral-500 focus:border-secondary dark:focus:border-secondary"
        />
        <div className="flex justify-end">
          <Button
            className="px-3 py-2"
            text="Run Code"
            onClick={async () => {
              setTerminalOpen(false);
              if (
                props.languages[props.selectedLanguage].name ===
                "Python (local)"
              ) {
                // Run the Python code locally using Pyodide
                const newMessage: IMessage = {
                  type: IMessageType.CODE_EXECUTION,
                  message: "Running code...",
                  targetStdout: props.expectedStdout,
                  language: "Python",
                };
                props.addMessage(newMessage);
                let output = await runPython(
                  props.languages[props.selectedLanguage].code
                );
                if (output.slice(0, -1) === props.expectedStdout) {
                  output = output + "\n🟢 Correct output!";
                } else {
                  output = output + "\n❌ Expected different output";
                }
                newMessage.message = output;
                props.updateLastMessage(newMessage, props.currentQuestion);
              } else if (
                props.languages[props.selectedLanguage].name === "Pseudocode"
              ) {
                // Pseudocode is not executable
                const newMessage: IMessage = {
                  type: IMessageType.ERROR,
                  message: "Psuedocode is not executable",
                  language: "Pseudocode",
                };
                props.addMessage(newMessage);
              } else {
                // Run the code remotely using the code execution service
                const newMessage: IMessage = {
                  type: IMessageType.CODE_EXECUTION,
                  message: "processing...",
                  targetStdout: props.expectedStdout,
                  language: props.languages[props.selectedLanguage].name,
                };
                props.addMessage(newMessage);
                let code = props.languages[props.selectedLanguage].code;
                if (props.languages[props.selectedLanguage].name === "SQL") {
                  // read schema.sql as string and pass it with the code
                  const s = await fetch("/schema.sql");
                  const schema = await s.text();
                  code = schema + "\n" + code;
                }
                let output = await codeExecution(
                  props.languages[props.selectedLanguage].id,
                  code,
                  props.stdin,
                  props.currentQuestion,
                  newMessage,
                  props.updateLastMessage
                );
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
