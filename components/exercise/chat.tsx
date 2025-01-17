import { IExerciseQuest } from "@/types/exerciseQuest";
import InputBar from "./inputBar";
import { useEffect } from "react";
import { IMessage, IMessageType } from "@/types/messages";
import React from "react";
import Message from "./message";

interface ChatProps {
  exerciseQuestions: IExerciseQuest[];
  addMessage: (message: IMessage) => void;
  updateLastMessage: (message: IMessage, currentQ: number) => void;
  currentQuestion: number;
  setTextInput: (text: string) => void;
  textInput: string;
  newSession: () => void;
  setScore: (score: number) => void;
}

export default function Chat({
  exerciseQuestions,
  addMessage,
  updateLastMessage,
  currentQuestion,
  setTextInput,
  textInput,
  newSession,
  setScore,
}: ChatProps) {
  // add first START message with typing animation
  useEffect(() => {
    const eq = exerciseQuestions[currentQuestion];
    const messages = eq.chat.messages;
    const firstMessage = messages[0]?.message ?? "";
    const currentLength = firstMessage.length;

    if (messages.length === 0) {
      addMessage({
        type: IMessageType.START,
        message: "",
        language: eq.languages[0].label,
        solutions: eq.question.solution,
      });
      return;
    }

    let markdownString =
      "# " + eq.question.title + "\n" + eq.question.description;

    if (eq.question.sampleInput !== "") {
      markdownString +=
        "\n\n" +
        "**Sample Input:** `" +
        eq.question.sampleInput +
        "` \n\n**Sample Output:** `" +
        eq.question.sampleOutput +
        "`";
    }

    if (currentLength === markdownString.length) {
      return;
    }

    const delay = setTimeout(() => {
      updateLastMessage(
        {
          type: IMessageType.START,
          message: markdownString.slice(0, currentLength + 1),
          language: eq.languages[0].label,
          solutions: eq.question.solution,
        },
        currentQuestion
      );
      clearTimeout(delay);
    }, 0 | (Math.random() * 5));

    return () => {
      clearTimeout(delay);
    };
  }, [exerciseQuestions, currentQuestion, addMessage, updateLastMessage]);

  return (
    <div className="h-full">
      <div className="flex-grow overflow-y-auto px-6 md:pl-6 md:pr-8 pt-8 mb-20 flex flex-col">
        {currentQuestion !== undefined && exerciseQuestions
          ? exerciseQuestions[currentQuestion].chat.messages.map(
              (msg, index) => (
                <div className="mb-10" key={index}>
                  <Message
                    key={index}
                    msg={msg}
                    newSession={newSession}
                    index={index}
                    setScore={setScore}
                  />
                </div>
              )
            )
          : null}
        <div className="h-16"></div>
      </div>

      <div className="absolute left-5 right-5 md:bottom-20 bottom-40 pb-5 bg-neutral-150 dark:bg-neutral-800 rounded-t-xl">
        <InputBar
          addMessage={addMessage}
          setTextInput={setTextInput}
          textInput={textInput}
          newSession={newSession}
        />
      </div>
    </div>
  );
}
