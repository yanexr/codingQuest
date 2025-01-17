import { IMessages } from "./messages";
import { IQuest, ILanguage as ILanguage } from "./quest";


export interface IExerciseQuest {
    question: IQuest;
    submissions: number;
    score: number;
    languages: ILanguage[];
    textInput: string;
    selectedLanguage: number;
    chat: IMessages;
    stdin: string;
    expectedStdout: string;
    stdout: string;

}