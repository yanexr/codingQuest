import { useContext } from "react";
import { IMessage, IMessageType } from "@/types/messages";
import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
  CommandLineIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { UserContext, UserContextProps } from "@/pages/_app";
import Markdown from "../markdown";
import Image from "next/image";
import { database_schema_markdown } from "@/data/data";

interface MessageProps {
  msg: IMessage;
  newSession: () => void;
  index: number;
  setScore: (score: number) => void;
}

export default function Message(props: MessageProps) {
  const rating = props.msg.message.match(/<rating>(\d+)<\/rating>/);
  if (rating) {
    props.setScore(parseInt(rating[1]));
  }

  return (
    <MessageContainer
      messageType={props.msg.type}
      newSession={props.newSession}
      index={props.index}
    >
      {props.msg.type === IMessageType.BOT ||
      props.msg.type === IMessageType.START ? (
        <div>
          <Markdown
            markdown={props.msg.message.replace(/<rating>(\d+)<\/rating>/, "")}
          />
          {rating ? (
            <div className="flex items-center mt-4 border rounded-lg border-neutral-300 dark:border-neutral-600 py-2.5 px-3 w-fit">
              <div
                className={`h-3 w-3 rounded-full mr-3 ${
                  parseInt(rating[1]) < 5
                    ? "bg-red-500"
                    : parseInt(rating[1]) < 7
                    ? "bg-orange-500"
                    : "bg-primary"
                }`}
              ></div>
              <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                Submission rating: {rating[1]} / 10
              </span>
            </div>
          ) : null}
          {props.msg.language == "sql" ? (
            <hr className="mb-4 mt-8 border-neutral-300 dark:border-neutral-600" />
          ) : null}
          {props.msg.language == "sql" ? (
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="transition flex w-full p-2 items-center justify-start space-x-2 rounded-lg hover:bg-neutral-700">
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
        </div>
      ) : props.msg.type === IMessageType.USER_QUESTION ? (
        <p className="break-words whitespace-break-spaces px-5 py-3 bg-neutral-300/50 dark:bg-neutral-700/70 rounded-3xl">
          {props.msg.message}
        </p>
      ) : props.msg.type === IMessageType.USER_SUBMISSION ? (
        <Disclosure
          as="div"
          className="flex flex-col px-5 py-3 rounded-3xl bg-gradient-to-r from-primary to-primary-dark text-white"
        >
          {({ open }) => (
            <>
              <Disclosure.Button>
                <div className="flex items-center font-medium font-white">
                  <DocumentIcon className="h-5 w-5 mr-2 stroke-2" />
                  <span className="pr-2">
                    {props.msg.submission + ". Submission"}
                  </span>
                  <ChevronDownIcon
                    className={`${
                      open ? "rotate-180 " : ""
                    } h-5 w-5 stroke-2 transition`}
                  />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <Markdown
                    markdown={
                      "```" +
                      props.msg.language
                        .toLowerCase()
                        .replace("#", "sharp")
                        .replaceAll("+", "p") +
                      "\n" +
                      props.msg.message +
                      "\n```"
                    }
                  />
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ) : props.msg.type === IMessageType.CODE_EXECUTION ? (
        <div className="break-words whitespace-break-spaces px-5 py-3 bg-neutral-700 dark:bg-neutral-900 rounded-3xl text-neutral-100 max-h-40 overflow-y-auto w-full">
          <span className="font-mono">{props.msg.message}</span>
        </div>
      ) : props.msg.type === IMessageType.ERROR ? (
        <div className="py-2">{props.msg.message}</div>
      ) : null}
    </MessageContainer>
  );
}

function MessageContainer({ messageType, newSession, index, children }) {
  return (
    <div
      className={`group flex items-start overflow-hidden ${
        messageType == IMessageType.USER_QUESTION ? "justify-end" : ""
      }`}
    >
      <div
        className={`hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          messageType == IMessageType.BOT || messageType == IMessageType.START
            ? "border border-neutral-300 dark:border-neutral-600 mr-4 shadow bg-neutral-100 dark:bg-transparent"
            : messageType == IMessageType.USER_QUESTION
            ? "ml-8 mt-1 invisible group-hover:visible mr-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:cursor-pointer"
            : messageType == IMessageType.USER_SUBMISSION
            ? "mt-1 invisible group-hover:visible mr-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:cursor-pointer"
            : " dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 mr-4 shadow bg-neutral-100 dark:bg-transparent"
        }`}
        onClick={() =>
          messageType == IMessageType.USER_QUESTION ||
          messageType == IMessageType.USER_SUBMISSION
            ? newSession(index)
            : null
        }
      >
        {messageType == IMessageType.USER_QUESTION ||
        messageType == IMessageType.USER_SUBMISSION ? (
          <XMarkIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-neutral-200" />
        ) : messageType == IMessageType.CODE_EXECUTION ? (
          <CommandLineIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-neutral-200" />
        ) : messageType == IMessageType.ERROR ? (
          <ExclamationTriangleIcon className="h-5 w-5 stroke-yellow-500" />
        ) : (
          <Image
            src="/codingQuest.svg"
            alt="CodingQuest logo"
            width="20"
            height="20"
            className="visible"
          ></Image>
        )}
      </div>
      {children}
    </div>
  );
}
