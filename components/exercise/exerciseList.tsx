import { IExerciseQuest } from "@/types/exerciseQuest";

interface Iprops {
  isSideBarOpen: boolean;
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  exerciseQuestions: IExerciseQuest[];
}

export default function ExerciseList(props: Iprops) {
  return (
    <div className="space-y-2">
      {props.exerciseQuestions?.map((exq, index) => (
        <div
          key={index}
          role="button"
          onClick={() => props.setCurrentQuestion(index)}
          className={`flex transition duration-200 items-center p-2 rounded-xl border border-transparent hover:border-neutral-400 dark:hover:border-neutral-600 ${
            props.currentQuestion === index
              ? " bg-white dark:bg-neutral-700 shadow border-t-white/10"
              : ""
          } `}
        >
          <div
            className={`relative transition flex h-10 w-10 flex-shrink-0 items-center justify-center font-bold rounded-lg ${
              props.currentQuestion === index
                ? "bg-primary text-white"
                : "bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-50"
            }`}
          >
            <span>#{index + 1}</span>
            {exq.chat.messages.length > 0 || exq.score > 0 ? (
              <div
                className={`transition absolute flex items-center justify-center -bottom-1 -right-1 h-4 w-4 rounded-full ${
                  props.currentQuestion === index
                    ? " bg-white dark:bg-neutral-700"
                    : "bg-neutral-150 dark:bg-neutral-800"
                }`}
              >
                <div
                  className={`flex items-center justify-center h-2.5 w-2.5 rounded-full ${
                    exq.score > 6
                      ? "bg-primary"
                      : exq.score > 4
                      ? "bg-orange-500"
                      : exq.score > 0
                      ? "bg-red-500"
                      : "bg-secondary"
                  }`}
                ></div>
              </div>
            ) : null}
          </div>
          {props.isSideBarOpen ? (
            <div className="ml-1 px-2 flex-col truncate">
              <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 ">
                {exq.question.title}
              </span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                {exq.submissions} Submissions • {exq.score}/10 Points
              </p>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
