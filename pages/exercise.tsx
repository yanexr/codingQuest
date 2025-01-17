import CodeEditor from "@/components/exercise/codeEditor";
import Header from "@/components/header";
import {
  database_schema_markdown,
  languageObjects,
  questions,
} from "@/data/data";
import { IExerciseQuest } from "@/types/exerciseQuest";
import { ILanguage, IQuest } from "@/types/quest";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDoubleLeftIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import ExerciseList from "@/components/exercise/exerciseList";
import Chat from "@/components/exercise/chat";
import { IMessage, IMessageType } from "@/types/messages";
import Head from "next/head";
import { OpenAIMessage, initResponse } from "@/services/chat";
import { Dialog, Tab, Transition } from "@headlessui/react";
import Quest from "@/components/exercise/quest";
import Modal from "@/components/modal";
import Splitter, { SplitDirection } from "@devbookhq/splitter";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Exercise() {
  const router = useRouter();
  const firstRender = useRef(true);
  const [exerciseQuestions, setExerciseQuestions] =
    useState<IExerciseQuest[]>(undefined);
  const [isSideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const [isQuestSelectorOpen, setQuestSelectorOpen] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Open side bar for xl screens
  useEffect(() => {
    if (window.innerWidth > 1280) {
      setSideBarOpen(true);
    }
  }, []);

  // Get exercise questions from URL
  useEffect(() => {
    if (router.isReady) {
      const queryPart = router.asPath.split("?")[1];
      if (!queryPart) {
        router.push("/");
        return;
      }
      const ids = queryPart.split("+");
      const exq: IExerciseQuest[] = ids.map((id) => {
        const q: IQuest = questions.find((q) => q.id === parseInt(id));
        if (!q) {
          throw new Error("Invalid URL");
        }
        return {
          question: q,
          submissions: 0,
          score: parseInt(localStorage.getItem(q.id.toString())) || 0,
          languages: getLanguages(q),
          textInput: "",
          selectedLanguage: 0,
          chat: {
            messages: [],
          },
          stdin: q.stdin,
          expectedStdout: q.targetStdout,
          stdout: "",
        };
      });
      setExerciseQuestions(exq);
    }
  }, [router.isReady]);

  // Prevent user from leaving the exercise
  useEffect(() => {
    const handleRouteChange = () => {
      if (!confirm("Are you sure you want to leave this exercise?")) {
        router.events.emit("routeChangeError");
        throw "routeChange aborted.";
      }
    };
    const handleBeforeUnload = (event: {
      preventDefault: () => void;
      returnValue: string;
    }) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave this exercise?";
    };

    // Add an event listener for the 'user leaves site' event
    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove the event listener when the component unmounts
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);

  const setScore = (score: number) => {
    if (exerciseQuestions[currentQuestion].score < score) {
      const eq = [...exerciseQuestions];
      eq[currentQuestion].score = score;
      setExerciseQuestions(eq);
      localStorage.setItem(
        exerciseQuestions[currentQuestion].question.id.toString(),
        score.toString()
      );
    }
  };

  const getLanguages = (q: IQuest): ILanguage[] => {
    if (q.category === "SQL") {
      return JSON.parse(
        JSON.stringify([languageObjects[0], languageObjects[2]])
      );
    } else {
      return JSON.parse(JSON.stringify(languageObjects.slice(1)));
    }
  };

  const getChatLog = () => {
    const messages: OpenAIMessage[] = [];
    const lastUserQuestion = exerciseQuestions[
      currentQuestion
    ].chat.messages.findLastIndex((m) => m.type === IMessageType.USER_QUESTION);

    exerciseQuestions[currentQuestion].chat.messages.map((m, index) => {
      if (m.type === IMessageType.START) {
        let context = "";
        if (exerciseQuestions[currentQuestion].question.category === "SQL") {
          context =
            "\n\nThe database schema is as follows:\n\n" +
            database_schema_markdown;
        }

        const startContent =
          "\n\n---\n\nThe user is currently working on the following quest:" +
          m.message +
          context +
          "\n\n\n A possible solution that would get full points is for example:\n" +
          m.solutions
            .map((s) => s.code + "\n\n" + s.explanation)
            .join("\n\n\nOr another solution example:\n");
        messages.push({ role: "assistant", content: startContent });
      } else if (m.type === IMessageType.BOT) {
        messages.push({ role: "assistant", content: m.message });
      } else if (m.type === IMessageType.USER_QUESTION) {
        let message = m.message;
        if (index === lastUserQuestion) {
          message = `<developer note>The user asked a question. For context, the user has the language ${
            exerciseQuestions[currentQuestion].languages[
              exerciseQuestions[currentQuestion].selectedLanguage
            ].name
          } selected, and currently, the following text is written in the editor:\n\n ${
            exerciseQuestions[currentQuestion].languages[
              exerciseQuestions[currentQuestion].selectedLanguage
            ].code
          }\n\n Ignore the code above written by the user if it not relevant for answering the users question. Below is the actual question from the user.</developer note>\n\n${message}`;
        }
        messages.push({ role: "user", content: message });
      } else if (m.type === IMessageType.USER_SUBMISSION) {
        let message =
          "<developer note>The user had the language " +
          m.language +
          " selected and submitted the following code (dont forget the rating)<developer note>\n\n" +
          m.message;
        messages.push({ role: "user", content: message });
      } else if (m.type === IMessageType.CODE_EXECUTION) {
        const message = `<developer note>The user had the language ${m.language} selected and executed code by clicking on the run button. The following output was printed in the console:\n\n${m.message}\n\nNote: You can ignore the output if it is outdated or not relevant for answering future questions.</developer note>\n\n`;
        messages.push({ role: "user", content: message });
      }
    });
    return messages;
  };

  const addMessage = (message: IMessage) => {
    const eq = [...exerciseQuestions];
    eq[currentQuestion].chat.messages.push(message);

    if (message.type === IMessageType.USER_SUBMISSION) {
      eq[currentQuestion].submissions++;
    }
    setExerciseQuestions(eq);
    if (
      message.type === IMessageType.USER_QUESTION ||
      message.type === IMessageType.USER_SUBMISSION
    ) {
      const chatLog = getChatLog();
      addMessage({ type: IMessageType.BOT, message: "" });
      initResponse(updateLastMessage, currentQuestion, chatLog);
    }
  };

  const updateLastMessage = (message: IMessage, currentQ: number) => {
    const eq = [...exerciseQuestions];
    eq[currentQ].chat.messages[eq[currentQ].chat.messages.length - 1] = message;
    setExerciseQuestions(eq);
  };

  const newSession = (index: number = 1) => {
    const eq = [...exerciseQuestions];
    eq[currentQuestion].chat.messages = eq[currentQuestion].chat.messages.slice(
      0,
      index
    );
    setExerciseQuestions(eq);
  };

  const setSelectedLanguage = (index: number) => {
    const eq = [...exerciseQuestions];
    eq[currentQuestion].selectedLanguage = index;
    setExerciseQuestions(eq);
  };

  const setTextInput = (text: string) => {
    const eq = [...exerciseQuestions];
    eq[currentQuestion].textInput = text;
    setExerciseQuestions(eq);
  };

  const setCode = (code: string) => {
    const eq = [...exerciseQuestions];
    const selectedLanguage = eq[currentQuestion].selectedLanguage;
    eq[currentQuestion].languages[selectedLanguage].code = code;
    setExerciseQuestions(eq);
  };

  const setStdin = (stdin: string) => {
    const eq = [...exerciseQuestions];
    eq[currentQuestion].stdin = stdin;
    setExerciseQuestions(eq);
  };

  const setExpectedStdout = (expectedStdout: string) => {
    const eq = [...exerciseQuestions];
    eq[currentQuestion].expectedStdout = expectedStdout;
    setExerciseQuestions(eq);
  };

  const setStdout = (stdout: string, currentQ: number) => {
    const eq = [...exerciseQuestions];
    eq[currentQ].stdout = stdout;
    setExerciseQuestions(eq);
  };

  const nextQuestion = () => {
    setCurrentQuestion((prevQuestion) => {
      if (prevQuestion + 1 < exerciseQuestions.length) {
        return prevQuestion + 1;
      } else {
        return 0;
      }
    });
  };

  const previousQuestion = () => {
    setCurrentQuestion((prevQuestion) => {
      if (prevQuestion - 1 >= 0) {
        return prevQuestion - 1;
      } else {
        return exerciseQuestions.length - 1;
      }
    });
  };

  return (
    <>
      <Head>
        <title key="title">CodingQuest - Exercise</title>
        <meta
          name="description"
          content="Improve your problem-solving skills with exercises on algorithms, arrays, dynamic programming, SQL, and more."
        />
        <meta
          key="keywords"
          name="keywords"
          content="coding, programming, algorithms, data structures, coding problems, coding challenges, SQL, Pseudocode, JavaScript, Python, Java, C++, C#"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen overflow-hidden bg-neutral-150 dark:bg-neutral-800">
        <Header />
        <div className="h-full flex flex-row md:border-t border-neutral-400 dark:border-neutral-600">
          <div
            className={`hidden md:flex flex-col flex-shrink-0 h-full max-w-xs px-2 pt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500 hover:dark:scrollbar-thumb-neutral-500 scrollbar-track-neutral-transparent ${
              isSideBarOpen ? "w-72" : "w[4.5rem]"
            }`}
          >
            <div className="h-10 rounded-lg flex items-center p-2 mb-2 text-neutral-900 dark:text-neutral-100">
              <div
                role="button"
                onClick={() => setSideBarOpen(!isSideBarOpen)}
                className="flex transition items-center justify-center h-10 w-10 flex-shrink-0  hover:bg-white dark:hover:bg-neutral-700 rounded-lg cursor-pointer"
              >
                <ChevronDoubleLeftIcon
                  className={`${
                    isSideBarOpen ? "" : "rotate-180"
                  } stroke-2 h-6 w-6`}
                />
              </div>

              {isSideBarOpen ? (
                <span className="font-medium pl-3 ">
                  {exerciseQuestions?.length} Quests
                </span>
              ) : null}
            </div>
            <ExerciseList
              isSideBarOpen={isSideBarOpen}
              exerciseQuestions={exerciseQuestions}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            />
          </div>
          {!isMobile ? (
            <Splitter
              direction={SplitDirection.Horizontal}
              initialSizes={[55, 45]}
              minWidths={[300, 300]}
              gutterClassName="w-0 bg-white dark:bg-neutral-900 border-r border-neutral-400 dark:border-neutral-600 hover:bg-primary hover:dark:bg-primary transition"
              draggerClassName="hidden"
            >
              <div className="h-full relative border-l border-neutral-400 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900 hidden md:block">
                {exerciseQuestions ? (
                  <CodeEditor
                    languages={exerciseQuestions[currentQuestion].languages}
                    setCode={setCode}
                    currentQuestion={currentQuestion}
                    selectedLanguage={
                      exerciseQuestions[currentQuestion].selectedLanguage
                    }
                    setSelectedLanguage={setSelectedLanguage}
                    addMessage={addMessage}
                    updateLastMessage={updateLastMessage}
                    submission={exerciseQuestions[currentQuestion].submissions}
                    stdin={exerciseQuestions[currentQuestion].stdin}
                    setStdin={setStdin}
                    expectedStdout={
                      exerciseQuestions[currentQuestion].expectedStdout
                    }
                    setExpectedStdout={setExpectedStdout}
                    stdout={exerciseQuestions[currentQuestion].stdout}
                    setStdout={setStdout}
                  />
                ) : null}
              </div>
              <div className="relative flex flex-col h-full md:flex-auto">
                <Tab.Group>
                  <Tab.List
                    className={
                      "flex p-3 space-x-4 bg-neutral-200 dark:bg-neutral-900/50 rounded-t-3xl md:rounded-none border-y md:border-t-0 border-neutral-400 dark:border-neutral-600"
                    }
                  >
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          `flex flex-grow justify-center items-center py-3 rounded-xl transition font-semibold border border-transparent hover:border-neutral-400 dark:hover:border-neutral-600 ${
                            selected
                              ? "bg-white dark:bg-neutral-700/80 shadow text-neutral-900 dark:text-white border-t border-t-white/10"
                              : "text-neutral-700 dark:text-neutral-400"
                          }`
                        )
                      }
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 stroke-primary" />
                      Chat
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          `flex flex-grow justify-center items-center py-3 rounded-xl transition font-semibold border border-transparent hover:border-neutral-400 dark:hover:border-neutral-600 ${
                            selected
                              ? "bg-white dark:bg-neutral-700/80 shadow text-neutral-900 dark:text-white border-t border-t-white/10"
                              : "text-neutral-700 dark:text-neutral-400"
                          }`
                        )
                      }
                    >
                      <QuestionMarkCircleIcon className="h-5 w-5 mr-2 stroke-primary" />
                      Quest
                    </Tab>
                  </Tab.List>

                  <Tab.Panels
                    className={
                      "flex-grow md:mb-20 mb-40 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500 hover:dark:scrollbar-thumb-neutral-500 scrollbar-track-neutral-transparent"
                    }
                  >
                    <Tab.Panel className={""}>
                      {exerciseQuestions ? (
                        <Chat
                          currentQuestion={currentQuestion}
                          exerciseQuestions={exerciseQuestions}
                          addMessage={addMessage}
                          updateLastMessage={updateLastMessage}
                          setTextInput={setTextInput}
                          textInput={
                            exerciseQuestions[currentQuestion].textInput
                          }
                          newSession={newSession}
                          setScore={setScore}
                        />
                      ) : null}
                    </Tab.Panel>
                    <Tab.Panel className={""}>
                      {exerciseQuestions ? (
                        <Quest
                          question={exerciseQuestions[currentQuestion].question}
                        />
                      ) : null}
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </Splitter>
          ) : (
            <div className="relative flex flex-col h-full w-full bg-neutral-150 dark:bg-neutral-800">
              <Tab.Group>
                <Tab.List
                  className={
                    "flex p-3 space-x-4 bg-neutral-200  dark:bg-neutral-900/50 rounded-t-3xl md:rounded-none border-y md:border-t-0 border-neutral-400 dark:border-neutral-600"
                  }
                >
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        `flex flex-grow justify-center items-center py-3 rounded-xl transition font-semibold border border-transparent hover:border-neutral-400 dark:hover:border-neutral-600 ${
                          selected
                            ? "bg-neutral-50 dark:bg-neutral-700/80 shadow text-neutral-900 dark:text-white border-t border-t-white/10"
                            : "text-neutral-700 dark:text-neutral-400"
                        }`
                      )
                    }
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 stroke-primary" />
                    Chat
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        `flex flex-grow justify-center items-center py-3 rounded-xl transition font-semibold border border-transparent hover:border-neutral-400 dark:hover:border-neutral-600 md:hidden ${
                          selected
                            ? "bg-neutral-50 dark:bg-neutral-700/80 shadow text-neutral-900 dark:text-white border-t border-t-white/10"
                            : "text-neutral-700 dark:text-neutral-400"
                        }`
                      )
                    }
                  >
                    <PencilSquareIcon className="h-5 w-5 mr-2 stroke-primary" />
                    Editor
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        `flex flex-grow justify-center items-center py-3 rounded-xl transition font-semibold border border-transparent hover:border-neutral-400 dark:hover:border-neutral-600 ${
                          selected
                            ? "bg-neutral-50 dark:bg-neutral-700/80 shadow text-neutral-900 dark:text-white border-t border-t-white/10"
                            : "text-neutral-700 dark:text-neutral-400"
                        }`
                      )
                    }
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5 mr-2 stroke-primary" />
                    Quest
                  </Tab>
                </Tab.List>

                <Tab.Panels
                  className={
                    "flex-grow md:mb-20 mb-40 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500 hover:dark:scrollbar-thumb-neutral-500 scrollbar-track-neutral-transparent"
                  }
                >
                  <Tab.Panel className={""}>
                    {exerciseQuestions ? (
                      <Chat
                        currentQuestion={currentQuestion}
                        exerciseQuestions={exerciseQuestions}
                        addMessage={addMessage}
                        updateLastMessage={updateLastMessage}
                        setTextInput={setTextInput}
                        textInput={exerciseQuestions[currentQuestion].textInput}
                        newSession={newSession}
                        setScore={setScore}
                      />
                    ) : null}
                  </Tab.Panel>
                  <Tab.Panel className={"h-full overflow-hidden relative"}>
                    {exerciseQuestions ? (
                      <CodeEditor
                        languages={exerciseQuestions[currentQuestion].languages}
                        setCode={setCode}
                        currentQuestion={currentQuestion}
                        selectedLanguage={
                          exerciseQuestions[currentQuestion].selectedLanguage
                        }
                        setSelectedLanguage={setSelectedLanguage}
                        addMessage={addMessage}
                        updateLastMessage={updateLastMessage}
                        submission={
                          exerciseQuestions[currentQuestion].submissions
                        }
                        stdin={exerciseQuestions[currentQuestion].stdin}
                        setStdin={setStdin}
                        expectedStdout={
                          exerciseQuestions[currentQuestion].expectedStdout
                        }
                        setExpectedStdout={setExpectedStdout}
                        stdout={exerciseQuestions[currentQuestion].stdout}
                        setStdout={setStdout}
                      />
                    ) : null}
                  </Tab.Panel>
                  <Tab.Panel className={""}>
                    {exerciseQuestions ? (
                      <Quest
                        question={exerciseQuestions[currentQuestion].question}
                      />
                    ) : null}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 h-20 flex justify-between content-center w-full md:hidden px-8 bg-neutral-200 dark:bg-neutral-900/50 border-t border-neutral-400 dark:border-neutral-600">
        <button onClick={previousQuestion} className="p-1">
          <ArrowLeftIcon className="h-6 w-6 stroke-2  text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary" />
        </button>
        <button
          className="max-w-[70%]"
          onClick={() => setQuestSelectorOpen(true)}
        >
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-200 truncate">
            {exerciseQuestions &&
              exerciseQuestions[currentQuestion].question.title}
          </h2>
        </button>
        <button onClick={nextQuestion} className="p-1">
          <ArrowRightIcon className="h-6 w-6 stroke-2 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary" />
        </button>
      </div>

      <Modal
        className="bg-neutral-150 dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-600"
        isOpen={isQuestSelectorOpen}
        setOpen={setQuestSelectorOpen}
      >
        <ExerciseList
          isSideBarOpen={true}
          exerciseQuestions={exerciseQuestions}
          currentQuestion={currentQuestion}
          setCurrentQuestion={(number) => {
            setCurrentQuestion(number);
            setQuestSelectorOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
