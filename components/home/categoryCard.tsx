import { IQuest } from "@/types/quest";
import { PlayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../button";

export interface CategoryInfo {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

interface CategoryCardProps {
  categoryInfo: CategoryInfo;
  solvedQuests: Map<number, number>;
  categoryQuestions: IQuest[];
}

export default function CategoryCard(props: CategoryCardProps) {
  useEffect(() => {
    // Calculate the percentage of solved questions (more than 5 points)
    let solved = 0;
    props.categoryQuestions.forEach((question) => {
      if (props.solvedQuests.get(question.id) >= 5) {
        solved++;
      }
    });
    setSolved(
      Math.round((solved / props.categoryQuestions.length) * 100).toString()
    );

    // Create a link to 5 unsolved questions
    props.categoryQuestions.sort(
      (a, b) =>
        (props.solvedQuests.get(a.id) ?? 0) -
        (props.solvedQuests.get(b.id) ?? 0)
    );
    setLink(
      "/exercise?" +
        props.categoryQuestions
          .slice(0, 5)
          .map((q) => q.id)
          .join("+")
    );
  }, [props.categoryQuestions, props.solvedQuests]);

  const [link, setLink] = useState(props.categoryInfo.link);
  const [solved, setSolved] = useState("0");

  return (
    <div className="relative bg-white shadow dark:bg-neutral-800 rounded-lg p-6 flex flex-col justify-between dark:border-t border-t-neutral-700/50">
      <div className="flex-grow">
        <div className="flex space-x-3 pb-2">
          <div className="w-7 h-7 text-primary stroke-primary fill-primary">
            {props.categoryInfo.icon}
          </div>
          <p className="text-neutral-800 dark:text-white text-lg font-semibold">
            {props.categoryInfo.title}
          </p>
        </div>
        <p className="text-neutral-500 dark:text-300 text-sm pr-14">
          {props.categoryInfo.description}
        </p>
      </div>
      <div className="mt-4">
        <span className="bg-primary-light/20 dark:bg-primary-dark/20 text-primary-dark dark:text-primary-light rounded-full px-4 py-1 font-semibold text-md mr-2">
          {solved}% solved
        </span>
      </div>
      <Link href={link}>
        <Button Icon={PlayIcon} className="absolute bottom-6 right-6 hover:scale-110 tansition duration-150" />
      </Link>
    </div>
  );
}
