import { questions } from "../../data/data";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Markdown from "../markdown";
import { PlayIcon } from "@heroicons/react/24/outline";
import Button from "../button";

const rowStyle =
  "mt-2 py-3 bg-white dark:bg-neutral-800 group:hover:dark:bg-neutral-700 dark:border-t border-t-neutral-700/50";
const textStyle =
  "text-neutral-500 dark:text-neutral-400 uppercase font-bold text-xs";

interface QuestsListProps {
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  setIsStartButtonShowing: (isShowing: boolean) => void;
  solvedQuests: Map<number, number>;
  filter: string;
}

export default function QuestsList(props: QuestsListProps) {
  return (
    <div>
      <div className="grid listGrid">
        <div></div>
        <div className={`${textStyle}`}>Title</div>
        <div className={`${textStyle} justify-self-end hidden lg:inline`}>
          Category
        </div>
        <span className="justify-self-end">
          <div className={`${textStyle}`}>Difficulty</div>
        </span>
        <div className={`${textStyle} justify-self-end`}>Score</div>
        <div></div>

        {questions
          .filter((q) => props.filter === "All" || q.category === props.filter)
          .map((question) => (
            <Disclosure key={question.id}>
              {({ open }) => (
              <>
                <div
                onClick={(e) => e.stopPropagation()}
                className={`${rowStyle} flex items-center justify-center ${
                  open ? "rounded-tl-lg" : "rounded-l-lg"
                }`}
                >
                <input
                  checked={props.selectedIds.includes(question.id)}
                  onChange={(e) => {
                  let newSelectedIds: number[];
                  if (e.target.checked) {
                    newSelectedIds = [...props.selectedIds, question.id];
                  } else {
                    newSelectedIds = props.selectedIds.filter(
                    (id) => id !== question.id
                    );
                  }
                  props.setSelectedIds(newSelectedIds);
                  if (newSelectedIds.length > 0) {
                    props.setIsStartButtonShowing(true);
                  } else {
                    props.setIsStartButtonShowing(false);
                  }
                  }}
                  alt="select"
                  id="checkbox-table-search-1"
                  type="checkbox"
                  className="appearance-none w-5 h-5 mx-5 bg-transparent rounded-md border-2 border-neutral-500/90 dark:border-neutral-500 inline-block relative cursor-pointer checked:bg-primary checked:border-primary dark:checked:border-primary checked:after:content-['✓'] checked:after:-bottom-0.5 checked:after:left-0.5 checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:text-white"
                />
                </div>
                <Disclosure.Button className={`${rowStyle} min-w-0 text-left truncate`}>
                <span className="font-medium hover:underline text-neutral-900 dark:text-neutral-200">
                  {question.title}
                </span>
                </Disclosure.Button>
                <Disclosure.Button
                className={`${rowStyle} hidden lg:flex justify-end whitespace-nowrap pl-4 text-secondary`}
                >
                {question.category}
                </Disclosure.Button>
                <Disclosure.Button
                className={`${rowStyle} flex justify-end items-center font-bold uppercase text-xs ${
                  question.difficulty == "Easy"
                  ? "text-primary"
                  : question.difficulty == "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
                }`}
                >
                {question.difficulty}
                </Disclosure.Button>
                <Disclosure.Button className={`${rowStyle} flex justify-end`}>
                {props.solvedQuests.has(question.id)
                  ? props.solvedQuests.get(question.id)
                  : "-"}
                </Disclosure.Button>
                <Disclosure.Button
                className={`${rowStyle} flex items-center justify-end px-5 ${
                  open ? "rounded-tr-lg" : "rounded-r-lg"
                }`}
                >
                <ChevronDownIcon
                  className={`${
                  open ? "rotate-180 transform" : ""
                  } h-5 w-5 transition durartion-200`}
                />
                </Disclosure.Button>
                <Disclosure.Panel 
                onClick={(e) => e.stopPropagation()}
                className="col-span-5 lg:col-span-6 px-12 pb-4 rounded-b-lg bg-white dark:bg-neutral-800"
                >
                {question.sampleInput != "" ? (
                  <Markdown
                  markdown={
                    question.description +
                    "\n\n**Sample Input:** `" +
                    question.sampleInput +
                    "`\n\n**Sample Output:** `" +
                    question.sampleOutput +
                    "`"
                  }
                  />
                ) : <Markdown markdown={question.description} />}
                <Link href={"/exercise?" + question.id}>
                  <Button
                  Icon={PlayIcon}
                  className="px-4 py-2 mb-4 mt-6"
                  text="Solve"
                  />
                </Link>
                </Disclosure.Panel>
              </>
              )}
            </Disclosure>
          ))}
      </div>
    </div>
  );
}
