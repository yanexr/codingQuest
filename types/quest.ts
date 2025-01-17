
export interface ILanguage {
  name: string;
  id: number | null;
  label: string;
  extension: string;
  code: string;
}

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface IQuest {
  id: number;
  title: string;
  category: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
  difficulty: Difficulty;
  stdin: string;
  targetStdout: string;
  solution: ISolution[];
}

export interface ISolution {
  code: string;
  explanation: string;
}
