import {
  PlayIcon,
  RectangleGroupIcon,
  BookOpenIcon,
  ListBulletIcon,
  CircleStackIcon,
  EllipsisHorizontalCircleIcon,
  CodeBracketSquareIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout";
import Link from "next/link";
import CategoryCard, { CategoryInfo } from "@/components/home/categoryCard";
import QuestsList from "@/components/home/list";
import Head from "next/head";
import { useEffect, useState } from "react";
import StartWithSelectedButton from "@/components/home/startWithSelectedButton";
import { Transition } from "@headlessui/react";
import { questions } from "@/data/data";
import Button from "@/components/button";

export default function Home() {
  useEffect(() => {
    questions.forEach((question) => {
      let score = localStorage.getItem(question.id.toString());
      if (score) {
        setSolvedQuests((prev) => {
          const next = new Map(prev);
          next.set(question.id, parseInt(score));
          return next;
        });
      }
    });
  }, []);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isStartButtonShown, setIsStartButtonShown] = useState(false);
  const [solvedQuests, setSolvedQuests] = useState(new Map<number, number>());
  const [filter, setFilter] = useState("All");

  const categories: CategoryInfo[] = [
    {
      title: "Arrays",
      description:
        "Array Manipulations, Sorting, Binary Search, Divide and Conquer, Sliding Window, etc.",
      link: "",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={1.7}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 2L4.85714 2L4 2C2.89543 2 2 2.89332 2 3.99789C2 9.63664 2 16.6319 2 20.0013C2 21.1059 2.89543 22 4 22H6"
            strokeLinecap="round"
          />
          <path
            d="M18 2L19.1429 2L20 2C21.1046 2 22 2.89332 22 3.99789C22 9.63664 22 16.6319 22 20.0013C22 21.1059 21.1046 22 20 22H18"
            strokeLinecap="round"
          />
          <path d="M6 6V10" strokeLinecap="round" />
          <path d="M6 14V18" strokeLinecap="round" />
          <path d="M12 14V18" strokeLinecap="round" />
          <path d="M18 6V10" strokeLinecap="round" />
          <path d="M18 14V18" strokeLinecap="round" />
          <rect x="10" y="6" width="4" height="4" rx="2" />
        </svg>
      ),
    },
    {
      title: "Dynamic Programming",
      description: "2D and 1D Dynamic Programming, LCS, LIS, Knapsack, etc.",
      link: "",
      icon: <RectangleGroupIcon />,
    },
    {
      title: "Hashing DS",
      description:
        "Hashing Data Structures: Sets/HashSets and Dictionaries/HashMaps.",
      link: "",
      icon: <BookOpenIcon />,
    },
    {
      title: "Linked Lists",
      description: "Linked List Searching, Pointer Manipulations, etc.",
      link: "",
      icon: <ListBulletIcon />,
    },

    {
      title: "SQL",
      description:
        "Storing, manipulating and retrieving data in databases with SQL statements.",
      link: "",
      icon: <CircleStackIcon />,
    },
    {
      title: "Strings",
      description: "String Manipulations, Reversing, Encodings/Decodings, etc.",
      link: "",
      icon: <EllipsisHorizontalCircleIcon />,
    },
    {
      title: "Trees",
      description:
        "Binary Search Trees, Breadth-First Traversal, Depth-First Traversal, etc.",
      link: "",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={1.7}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="5" r="3.5" />
          <circle cx="5" cy="19" r="3.5" />
          <circle cx="19" cy="19" r="3.5" />
          <line x1="6.55279" y1="15.7764" x2="10.5528" y2="7.77639" />
          <line x1="13.4472" y1="7.77639" x2="17.4472" y2="15.7764" />
        </svg>
      ),
    },
    {
      title: "Other",
      description:
        "Backtracking, BFS, DFS, Stacks, Queues, Deques, Priority Queues (Heaps), Matrices, etc.",
      link: "",
      icon: <CodeBracketSquareIcon />,
    },
  ];

  return (
    <>
      <Head>
        <title key="title">
          CodingQuest - Improve Your Problem-Solving Skills
        </title>
        <meta
          name="description"
          content="Sharpen your coding skills in your programming language of choice. Challenge yourself with bite-sized exercises, get instant feedback, and enhance your expertise."
        />
        <meta
          key="keywords"
          name="keywords"
          content="coding, programming, algorithms, data structures, coding problems, coding challenges, coding platform, coding practice, coding questions, coding quiz, coding test, coding website, learn to code, online coding, programming problems, programming challenges, programming platform, programming practice, programming questions, programming quiz, programming test, programming website"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute top-0 w-full h-full dark:bg-radial-gradient-blue bg-radial-gradient-white -z-30 dark:opacity-20 opacity-100">
        <div className="dark:bg-[url('/pattern-dark.svg')] h-full"></div>
      </div>
      <div className={`max-w-screen-xl mx-auto px-5 pb-8`}>
        <section className="pt-32 pb-32 max-w-4xl mx-auto flex-col space-y-5 ">
          <Transition
            appear={true}
            show={true}
            enter="transition ease-in-out duration-500 transition"
            enterFrom="opacity-0 tranneutral-y-4"
            enterTo="opacity-100"
          >
            <h1 className="text-center text-5xl md:text-6xl font-extrabold text-neutral-800 dark:text-white">
              Elevate Your Problem-Solving Skills in an Interactive Way.
            </h1>
          </Transition>

          <Transition
            appear={true}
            show={true}
            enter="transition ease-in-out duration-500 delay-100 transition"
            enterFrom="opacity-0 tranneutral-y-4"
            enterTo="opacity-100"
          >
            <h2 className="max-w-[34rem] md:max-w-[44rem] mx-auto text-center md:text-lg text-neutral-600 dark:text-neutral-300/75 font-[500]">
              Sharpen your coding skills in your programming language of choice.
              Challenge yourself with bite-sized exercises, get instant
              feedback, and enhance your expertise.
            </h2>
          </Transition>

          <Transition
            appear={true}
            show={true}
            enter="transition ease-in-out duration-500 delay-200 transition"
            enterFrom="opacity-0 tranneutral-y-4"
            enterTo="opacity-100"
          >
            <div className="flex justify-center pt-6">
              <Link href="/exercise?18+24+33+60+59">
                <Button
                  Icon={PlayIcon}
                  className="px-5 py-3"
                  text="Get Started"
                />
              </Link>
            </div>
          </Transition>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {categories.map((categoryInfo, index) => (
            <CategoryCard
              categoryInfo={categoryInfo}
              key={index}
              solvedQuests={solvedQuests}
              categoryQuestions={questions.filter(
                (q) => q.category === categoryInfo.title
              )}
            />
          ))}
        </section>
        <section
          id="questions"
          className="pt-16 text-neutral-800 dark:text-white"
        >
          <h3 className="text-3xl font-extrabold pt-12 pb-8">Quests</h3>
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setFilter("All")}
              className={`px-5 py-1 rounded-full tansition duration-100 border-t border-t-white/10 shadow-sm ${
                filter === "All"
                  ? "bg-gradient-to-b from-primary to-primary-dark text-white"
                  : "bg-neutral-50 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.title}
                onClick={() => setFilter(category.title)}
                className={`px-5 py-1 rounded-full tansition duration-100 border-t border-t-white/10 shadow-sm ${
                  filter === category.title
                    ? "bg-gradient-to-b from-primary to-primary-dark text-white"
                    : "bg-neutral-50 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
          <QuestsList
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            setIsStartButtonShowing={setIsStartButtonShown}
            solvedQuests={solvedQuests}
            filter={filter}
          />
        </section>
      </div>
      <StartWithSelectedButton
        selectedIds={selectedIds}
        isShowing={isStartButtonShown}
      />
    </>
  );
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};
