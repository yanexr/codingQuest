import { IMessage } from "@/types/messages";

export async function codeExecution(
  languageID: number,
  sourceCode: string,
  stdin: string,
  currentQuestion: number,
  message: IMessage,
  updateLastMessage: (message: IMessage, currentQ: number) => void
) {
  let output = "processing...";
  message.message = output;
  updateLastMessage(message, currentQuestion);
  const url = "/api/submission";
  const postOptions = {
    method: "POST",
    body: JSON.stringify({
      language_id: languageID,
      source_code: sourceCode,
      stdin: stdin,
    }),
  };
  const getOptions = {
    method: "GET",
  };

  const response = await fetch(url, postOptions);
  const postSubmission = await response.json();

  while (true) {
    const result = await fetch(
      url + "?token=" + postSubmission.token,
      getOptions
    );
    const getSubmission = await result.json();
    console.log(getSubmission);
    const statusId = getSubmission.status.id;
    if (statusId === 1 || statusId === 2) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
    } else {
      if (getSubmission.stdout != null) {
        output = output + "\n" + getSubmission.stdout;
      }
      if (getSubmission.stderr != null) {
        output = output + "\n" + getSubmission.stderr;
      }
      if (getSubmission.compile_output != null) {
        output = output + "\n" + getSubmission.compile_output;
      }
      if (getSubmission.status.id === 3) {
        if (languageID !== 82) {
          if (output.slice(14, -1) === message.targetStdout) {
            output = output + "\n🟢 " + getSubmission.status.description;
          } else {
            output = output + "\n❌ Expected different output";
          }
        } else {
          output = output + "\n🟢 Query executed successfully!";
        }
      } else {
        output = output + "\n❌ " + getSubmission.status.description;
        if (getSubmission.message) {
          output = output + "\nError: " + getSubmission.message;
        }
      }
      message.message = output;
      updateLastMessage(message, currentQuestion);
      break;
    }
  }
}
