import { useContext, useEffect, useRef, useState } from "react";
import Modal from "./modal";
import { Dialog } from "@headlessui/react";
import {
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
  KeyIcon,
  ChatBubbleBottomCenterIcon,
  PaintBrushIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { UserContext, UserContextProps } from "@/pages/_app";
import Button from "./button";

export const defaultTemperature = 0.2;

export default function Settings() {
  const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
  const settingsMenu = useRef(null);

  const [isThemeOpen, setThemeOpen] = useState<boolean>(false);
  const { theme, setTheme } = useContext<UserContextProps>(UserContext);

  const [isKeyOpen, setKeyOpen] = useState<boolean>(false);
  const [key, setKey] = useState<string>("");
  const keyInput = useRef(null);

  const [model, setModel] = useState<string>("gpt-4o-mini");

  const [temperature, setTemperature] = useState<number>(defaultTemperature);

  useEffect(() => {
    if (localStorage.getItem("openAIKey") !== null) {
      setKey(localStorage.getItem("openAIKey"));
    }
  }, [isKeyOpen]);

  useEffect(() => {
    // set initial theme
    if (localStorage.getItem("theme") === "dark") {
      setDark();
    } else if (localStorage.getItem("theme") === "light") {
      setLight();
    } else {
      setSystem();
    }

    // set initial model
    if (localStorage.getItem("model") !== null) {
      setModel(localStorage.getItem("model"));
    }

    // set initial temperature
    if (localStorage.getItem("temperature") !== null) {
      setTemperature(parseFloat(localStorage.getItem("temperature")));
    }
  }, []);

  function setDark() {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
    setTheme("dark");
    document.documentElement.style.setProperty("color-scheme", "dark");
  }

  function setLight() {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    setTheme("light");
    document.documentElement.style.setProperty("color-scheme", "light");
  }

  function setSystem() {
    setTheme("system");
    // check the system prefered theme
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.style.setProperty("color-scheme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.style.setProperty("color-scheme", "light");
    }
    localStorage.removeItem("theme");
  }

  function saveKey() {
    const key = keyInput.current.value;
    if (key == "" || key == " ") {
      localStorage.removeItem("openAIKey");
    } else {
      localStorage.setItem("openAIKey", key);
    }
    setKeyOpen(false);
  }

  function changeModel(value: string) {
    setModel(value);
    localStorage.setItem("model", value);
  }

  function changeTemperature(value: number) {
    setTemperature(value);
    localStorage.setItem("temperature", value.toString());
  }

  // open and close settings menu when clicking on the button
  const handleSettingsClick = () => {
    setSettingsOpen(!isSettingsOpen);
  };

  // close settings menu when clicking outside
  const handleOutsideClick = (e) => {
    if (isSettingsOpen && !settingsMenu.current.contains(e.target)) {
      setSettingsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });

  return (
    <>
      <div ref={settingsMenu}>
        <div
          className="p-1 bg-transparent rounded-lg stroke-neutral-600 dark:stroke-neutral-400 hover:stroke-primary dark:hover:stroke-primary hover:bg-black/10 dark:hover:bg-white/10"
          onClick={handleSettingsClick}
          role="button"
          tabIndex={0}
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            className={`w-6 h-6 ${
              isSettingsOpen ? "animate-spin-slow stroke-primary" : ""
            }`}
          >
            <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        {isSettingsOpen && (
          <div
            className="absolute right-5 w-52 z-40 p-2 mt-2 origin-top-right text-neutral-700 dark:text-neutral-300 rounded-md shadow-xl bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-600 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div
              className="flex space-x-4 items-center rounded px-4 py-2 hover:bg-black/10 dark:hover:bg-white/10 hover:cursor-pointer"
              role="menuitem"
              id="menu-item-0"
              onClick={() => {
                setSettingsOpen(false);
                setThemeOpen(true);
              }}
            >
              <PaintBrushIcon className="h-4 w-4 stroke-[0.15rem]" />
              <span>Theme Settings</span>
            </div>
            <div
              className="flex space-x-4 items-center rounded px-4 py-2 hover:bg-black/10 dark:hover:bg-white/10 hover:cursor-pointer"
              role="menuitem"
              id="menu-item-1"
              onClick={() => {
                setSettingsOpen(false);
                setKeyOpen(true);
              }}
            >
              <ChatBubbleBottomCenterIcon className="h-4 w-4 stroke-[0.15rem]" />
              <span>Chat Settings</span>
            </div>
          </div>
        )}
      </div>
      <Modal
        className="bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-600 relative"
        isOpen={isThemeOpen}
        setOpen={setThemeOpen}
      >
        <div
          onClick={() => setThemeOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
          role="button"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
        </div>
        <Dialog.Title className="text-black dark:text-white text-lg font-medium">
          Theme Settings
        </Dialog.Title>
        <div
          onClick={() => {
            setSystem();
            setThemeOpen(false);
          }}
          role="button"
          tabIndex={0}
          className={`flex mt-3 space-x-4 items-center ${
            theme === "system"
              ? "bg-neutral-200/80 dark:bg-neutral-700/80 text-primary dark:text-primary"
              : "text-neutral-700 dark:text-neutral-200"
          } rounded-lg px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition`}
        >
          <ComputerDesktopIcon className="h-5 w-5" aria-hidden="true" />
          <span>System</span>
        </div>
        <div
          onClick={() => {
            setLight();
            setThemeOpen(false);
          }}
          role="button"
          tabIndex={0}
          className={`flex mt-1 space-x-4 items-center ${
            theme === "light"
              ? "bg-neutral-200/80 dark:bg-neutral-700/80 text-primary dark:text-primary"
              : "text-neutral-700 dark:text-neutral-200"
          } rounded-lg px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition`}
        >
          <SunIcon className="h-5 w-5" aria-hidden="true" />
          <span>Light</span>
        </div>
        <div
          onClick={() => {
            setDark();
            setThemeOpen(false);
          }}
          role="button"
          tabIndex={0}
          className={`flex mt-1 space-x-4 items-center ${
            theme === "dark"
              ? "bg-neutral-200/80 dark:bg-neutral-700/80 text-primary dark:text-primary"
              : "text-neutral-700 dark:text-neutral-200"
          } rounded-lg px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition`}
        >
          <MoonIcon className="h-5 w-5" aria-hidden="true" />
          <span>Dark</span>
        </div>
      </Modal>

      <Modal
        className="bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-600 relative"
        isOpen={isKeyOpen}
        setOpen={setKeyOpen}
      >
        <div
          onClick={() => setKeyOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
          role="button"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
        </div>
        <h3 className="text-black dark:text-white text-xl font-medium mt-3 mb-4">
          Chat Settings
        </h3>
        <span className="text-black dark:text-white font-medium mt-4">
          OpenAI API Key
        </span>
        <p className="text-neutral-600 text-sm dark:text-neutral-200 pt-2 pb-4">
          Use{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            className="text-primary hover:text-primary-light"
          >
            your own OpenAI API key
          </a>{" "}
          for GPT models. Enter it below to send requests directly to
          OpenAI&apos;s servers. By default, our key is used for quick setup.
          Your key is stored locally in your browser.
        </p>
        <div className="relative flex mb-6">
          <div className="flex absolute inset-y-0 left-0 items-center pl-4">
            <KeyIcon
              className="h-5 w-5 stroke-neutral-500 dark:stroke-neutral-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="password"
            ref={keyInput}
            onChange={(e) => setKey(e.target.value)}
            value={key}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="transition bg-transparent rounded-lg p-3 pl-12 w-full h-11 bg-white dark:bg-neutral-800 text-black dark:text-white outline-none border-2 border-neutral-400 dark:border-neutral-500 focus:border-secondary dark:focus:border-secondary"
          />
          <Button className="px-4 py-2 ml-3" text="Save" onClick={saveKey} />
        </div>
        <span className="text-black dark:text-white font-medium">Models</span>
        <p className="text-neutral-600 text-sm dark:text-neutral-200 pt-1">
          The selected model is used if an OpenAI API key is set. Otherwise,
          GPT4o-Mini is used by default.
        </p>
        <div className="relative w-full mt-4 mb-6">
          <select
            className="w-full p-2 pr-10 rounded-lg bg-white dark:bg-neutral-800 text-black dark:text-white border-2 border-neutral-400 dark:border-neutral-500 focus:border-secondary dark:focus:border-secondary outline-none appearance-none"
            onChange={(e) => changeModel(e.target.value)}
            defaultValue={model}
          >
            <option value="gpt-4o-mini">GPT-4o mini</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="o1-mini">o1-mini</option>
            <option value="o1-preview">o1-preview</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500 dark:text-neutral-400">
            <ChevronDownIcon className="h-4 w-4 stroke-2" aria-hidden="true" />
          </div>
        </div>

        <span className="text-black dark:text-white font-medium">
          Temperature
        </span>
        <p className="text-neutral-600 text-sm dark:text-neutral-200 pt-1">
          A higher temperature value like 0.8 will make the output more random,
          while lower values like 0.2 will make it more focused and
          deterministic. (Recommended: 0.2)
        </p>
        <div className="relative mt-4">
          <input
            className="appearance-none w-full bg-transparent h-2"
            type="range"
            min="0"
            max="2"
            step="0.1"
            onChange={(e) => changeTemperature(parseFloat(e.target.value))}
            value={temperature}
          />

          <div className="absolute rounded-full left-1.5 right-1.5 top-2 -z-10 h-3 bg-neutral-200 dark:bg-neutral-600 border-t border-white/10">
            <div
              className="rounded-full h-full bg-primary border-t border-white/10"
              style={{ width: `${(temperature / 2) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className=" w-full flex justify-between text-[0.4rem] text-neutral-400 px-2.5">
          {Array(21)
            .fill(1)
            .map((_, index) => (
              <span key={index}>|</span>
            ))}
        </div>
        <div className=" w-full flex justify-between text-[0.8rem] text-neutral-400 px-0 mb-6">
          {Array(21)
            .fill(1)
            .map((_, index) => (
              <span
                key={index}
                className={`text-center w-5 ${
                  index / 10 === temperature ? "text-primary font-bold" : ""
                }`}
              >
                {index === 0 ||
                index === 10 ||
                index === 20 ||
                index / 10 === temperature
                  ? index / 10
                  : ""}
              </span>
            ))}
        </div>
      </Modal>
    </>
  );
}
