<h1>
    <a href="https://codingquest.vercel.app/" target="_blank">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="public/logo-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="public/logo-light.svg">
            <img alt="CodingQuest" src="public/logo-light.svg" width="312" height="47" style="max-width: 100%;">
        </picture>
    </a>
</h1>

**CodingQuest** is an app similar to Leetcode, to practice and improve problem-solving and coding skills with small challenges. The challenges are divided into different difficultiy levels and the following categories:

- **Arrays** (Array Manipulations, Sorting, Sliding Window, etc.)
- **Dynamic Programming** (LCS, LIS, Knapsack, etc.)
- **Hashing DS** (Sets/HashSets and Dictionaries/HashMaps)
- **Linked List** (Linked List Searching, Pointer Manipulations, etc.)
- **SQL** (Storing, manipulating and retrieving data)
- **Strings** (String Manipulations, Reversing, Encodings, etc.)
- **Trees** (Binary Search Trees, Depth-First Traversal, etc.)
- **Other** (Backtracking, BFS, DFS, Stacks, Queues, etc.)

The data for the challenges are mostly from [MTrajK/coding-problems](https://github.com/MTrajK/coding-problems), while I added the challenges for the SQL category. CodingQuest is built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/) and is using the [Monaco Editor for React](https://www.npmjs.com/package/@monaco-editor/react) as the text editor, the [OpenAI API](https://openai.com/api/) for the copilot/tutor feature, [Judge0](https://judge0.com/) for online code execution and [Pyodide](https://github.com/pyodide/pyodide) to run Python locally in the browser.

A live version of the website can be found [here](https://codingquest.vercel.app/).

## Running Locally

1. Clone the repo and navigate to the project directory.
2. Set your Rapid API (Judge0 CE) and OpenAI API keys in [`.env.example`](.env.example) and rename the file to `.env.local`.
3. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Screen Capture

![](public/demo.gif)

## License

The source code is licensed under the [MIT](LICENSE) license.

The [VS Code icons](https://github.com/vscode-icons/vscode-icons) are licensed under the [Creative Commons - ShareAlike (CC BY-SA)](https://creativecommons.org/licenses/by-sa/4.0/) license. Branded icons are licensed under their copyright license.

The quests / challenges are licensed under the [MIT](data/quests/LICENSE) license.
