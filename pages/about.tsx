import Layout from "@/components/layout";
import Head from "next/head";
import Image from "next/image";

export default function About() {
  return (
    <>
      <Head>
        <title key="title">CodingQuest - About</title>
        <meta
          name="description"
          content="Learn more about CodingQuest, an app designed to help users improve their problem-solving and coding skills through engaging and varied challenges."
        />
        <meta
          key="keywords"
          name="keywords"
          content="coding, programming, algorithms, data structures, coding problems, coding challenges, coding platform, coding practice, coding questions, coding quiz, coding test, coding website, learn to code, online coding, programming problems, programming challenges, programming platform, programming practice, programming questions, programming quiz, programming test, programming website"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
    radial-gradient(at 85% 100%, rgba(16, 164, 101, 0.15) 0px, transparent 20%),
    radial-gradient(at 70% 18%, rgba(16, 164, 101, 0.25) 0px, transparent 30%),
    radial-gradient(at 90% 0%, rgba(15, 156, 169, 0.25) 0px, transparent 30%),
    radial-gradient(at 0% 53%, rgba(15, 156, 169, 0.25) 0px, transparent 50%)
  `,
        }}
      ></div>

      <div className="max-w-screen-md pt-24 pb-12 mx-auto px-5 lg:px-0 text-lg text-neutral-800 dark:text-neutral-300 space-y-4">
        <h1 className="text-5xl dark:text-white font-bold mb-8">About</h1>
        <p className="font-medium">
          CodingQuest is an app designed to practice and improve problem-solving
          and coding skills through a diverse set of challenges. The
          platform&apos;s challenges are structured by difficulty and span a
          range of topics, including arrays, dynamic programming, hashing,
          linked lists, SQL, strings, trees, and other algorithms like
          backtracking, breadth-first search, and depth-first search.
        </p>
        <p>
          CodingQuest provides functionality for writing, and executing code in
          37 different programming languages, including Python, Java, C++,
          JavaScript, and Go. The app allows solutions to be submitted in
          various formats, including pseudocode, which can then be analyzed and
          improved with feedback from an integrated chatbot.
        </p>
        <p>
          The data of the CodingQuest challenges  are primarily sourced from the
          repository{" "}
          <a
            href="https://github.com/MTrajK/coding-problems"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            MTrajK/coding-problems
          </a>
          , with additional challenges created for the SQL category.
        </p>
        <p>
          CodingQuest is built with{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            Next.js
          </a>
          , a React framework that leverages server-side rendering and static
          site generation for performance and scalability. For styling,{" "}
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            Tailwind CSS
          </a>{" "}
          provides a utility-first approach for rapid and customizable UI
          development.
        </p>
        <p>
          The in-browser coding experience uses the{" "}
          <a
            href="https://www.npmjs.com/package/@monaco-editor/react"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            Monaco Editor for React
          </a>
          , which provides a versatile and robust code editor environment. Code
          execution is performed by{" "}
          <a
            href="https://judge0.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            Judge0
          </a>
          , an online code execution system that supports over 60 programming
          languages, enabling easy sandboxed compilation and execution.
          CodingQuest includes{" "}
          <a
            href="https://github.com/pyodide/pyodide"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            Pyodide
          </a>
          , a WebAssembly-based Python runtime, enabling in-browser Python
          execution and access to scientific libraries like numpy and pandas,
          with seamless integration with Web APIs.
        </p>
        <p>
          Another feature of CodingQuest is its chatbot assistant, powered by
          the{" "}
          <a
            href="https://openai.com/api/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            OpenAI API
          </a>
          . The chatbot offers real-time feedback, hints, and explanations,
          allowing users to analyze and refine their solutions or get guidance
          on tackling challenges. The source code of CodingQuest is available on{" "}
          <a
            href="https://github.com/yanexr/codingQuest"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </>
  );
}

About.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};
