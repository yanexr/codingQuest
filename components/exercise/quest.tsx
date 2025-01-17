import { IQuest } from "@/types/quest";
import Markdown from "../markdown";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { database_schema_markdown } from "@/data/data";

interface QuestProps {
  question: IQuest;
}

export default function Quest(props: QuestProps) {
  return (
    <div className="p-4 mb-8 ">
      <Markdown
        markdown={
          "# " + props.question.title + "\n" + props.question.description
        }
      />
      {props.question.sampleInput != "" ? (
        <div className="pl-4 pt-2">
          <Markdown
            markdown={
              "**Sample Input:** `" +
              props.question.sampleInput +
              "` \n\n**Sample Output:** `" +
              props.question.sampleOutput +
              "`"
            }
          />
        </div>
      ) : null}
      {props.question.category == "SQL" ? (
        <hr className="mb-4 mt-8 border-neutral-300 dark:border-neutral-600" />
      ) : null}
      {props.question.category == "SQL" ? (
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="transition flex w-full p-2 items-center justify-start space-x-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700">
                <span className="font-bold">Database Schema</span>
                <ChevronDownIcon
                  className={`${
                    open ? "" : "rotate-180 transform"
                  } h-5 w-5 transition durartion-300`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="ml-2">
                <div>
                  <Markdown markdown={database_schema_markdown} />
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ) : null}
      <hr className="mb-4 mt-4 border-neutral-300 dark:border-neutral-600" />
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="transition flex w-full p-2 items-center justify-start space-x-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700">
              <span className="font-bold">Solution</span>
              <ChevronDownIcon
                className={`${
                  open ? "" : "rotate-180 transform"
                } h-5 w-5 transition durartion-300`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="ml-2">
              {props.question.solution.map((sol, index) => (
                <div key={index}>
                  <Markdown
                    markdown={
                      sol.explanation + "\n```python\n" + sol.code + "\n```"
                    }
                  />
                </div>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
