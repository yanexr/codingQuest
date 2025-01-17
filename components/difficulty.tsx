import { Difficulty } from "@/types/quest";

interface Iprops {
  difficulty: Difficulty;
}

export default function DifficultyLabel(props: Iprops) {
  return (
    <>
      <div
        className={`${
          props.difficulty === "Easy"
            ? "text-primary "
            : props.difficulty === "Medium"
            ? "text-yellow-500 "
            : "text-red-500 "
        }  font-bold uppercase text-xs`}
      >
        {props.difficulty}
      </div>
    </>
  );
}
