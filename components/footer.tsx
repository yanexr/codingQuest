import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container mx-auto py-8 px-4 flex flex-col items-center">
        <hr className="w-full border-neutral-300 dark:border-neutral-700" />
        <div className="flex items-center space-x-8 text-neutral-600 dark:text-neutral-500 py-8">
          <span>© 2023 CodingQuest</span>
          <Link
            href="/about"
            className="hover:text-primary dark:hover:text-primary"
          >
            About
          </Link>
          <Link
            href="https://github.com/yanexr/codingQuest"
            className="hover:text-primary dark:hover:text-primary"
            target="_blank"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
