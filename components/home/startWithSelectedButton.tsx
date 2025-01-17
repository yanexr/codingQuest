import { PlayIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Transition } from "@headlessui/react";

interface StartWithSelectedButtonProps {
  selectedIds: number[];
  isShowing: boolean;
}
export default function StartWithSelectedButton(
  props: StartWithSelectedButtonProps
) {
  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center pointer-events-none">
      <Transition
        show={props.isShowing}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="translate-y-28"
        enterTo="translate-y-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-28"
      >
        <Link href={"/exercise?" + props.selectedIds.join("+")}>
          <button className="flex items-center justify-center px-6 py-3 space-x-2 font-medium text-white text-lg bg-primary hover:bg-primary-dark transition rounded-full drop-shadow-2xl pointer-events-auto">
            <span>{props.selectedIds.length + " selected"}</span>
            <PlayIcon aria-hidden="true" className="w-8 h-8" />
          </button>
        </Link>
      </Transition>
    </div>
  );
}
