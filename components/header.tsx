import Link from "next/link";
import Image from "next/image";
import useScroll from "../hooks/useScroll";
import Settings from "./settings";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface menuItem {
  name: string;
  link: string;
}

const menuList: menuItem[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Quests",
    link: "/#questions",
  },
  {
    name: "About",
    link: "/about",
  },
];

export default function Header() {
  const scrolled = useScroll(50);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row">
      <div className="h-20">
        <header
          className={`fixed top-0 w-full z-30 ${
            scrolled || open
              ? " border-b border-neutral-300 dark:border-neutral-600 bg-white/20 dark:bg-neutral-900/20 backdrop-blur-xl"
              : ""
          }`}
        >
          <div className="mx-8 h-20 flex items-center justify-between">
            <button
              onClick={() => setOpen((open) => !open)}
              className="md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              <div className="p-1 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary hover:bg-black/10 dark:hover:bg-white/10">
                {open ? (
                  <XMarkIcon className="h-6 w-6 stroke-2" />
                ) : (
                  <Bars3Icon className="h-6 w-6 stroke-2" />
                )}
              </div>
            </button>
            <Link href="/" className={`flex items-center text-2xl`}>
              <Image
                src="/codingQuest.svg"
                alt="CodingQuest logo"
                width="36"
                height="36"
                className="rounded-sm"
              ></Image>
              <span
                className={`hidden md:inline font-mono font-bold text-neutral-800 ml-4 dark:text-white`}
              >
                CodingQuest
              </span>
            </Link>

            <div className={`flex items-center`}>
              {menuList.map((item) => (
                <Link
                  key={item.name}
                  className={`hidden md:block text-neutral-800 dark:text-neutral-200 font-semibold hover:text-primary dark:hover:text-primary mr-14 py-1`}
                  href={item.link}
                >
                  {item.name}
                </Link>
              ))}
              <Settings />
            </div>
          </div>

          {open ? (
            <div className={`w-full flex flex-col px-8 pb-4 pt-2 `}>
              {menuList.map((item) => (
                <Link
                  key={item.name}
                  className={`py-2 px-4 mt-2 border border-neutral-500/40 rounded-lg bg-neutral-200/20 dark:bg-neutral-900/20 hover:bg-black/10 dark:hover:bg-white/10 transition`}
                  href={item.link}
                  onClick={() => setOpen(false)}
                >
                  <span className="text-neutral-900 dark:text-neutral-50 font-semibold">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : null}
        </header>
      </div>
    </div>
  );
}
