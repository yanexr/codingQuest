import { IconType } from "@heroicons/react";

interface ButtonProps {
  text?: string;
  className?: string;
  onClick?: () => void;
  Icon?: IconType;
  secondary?: boolean;
  fullRounded?: boolean;
}

export default function Button({
  text,
  className,
  onClick,
  Icon,
  secondary,
  fullRounded,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex group fill-none hover:fill-white items-center justify-center bg-gradient-to-b ${
        secondary
          ? "from-secondary to-secondary-dark hover:from-secondary-dark hover:to-secondary-dark"
          : "from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark"
      }  tansition duration-100 border-t border-t-white/30 shadow-md ${
        text && fullRounded
          ? "rounded-full"
          : text
          ? "rounded-lg"
          : "rounded-full h-12 w-12"
      } ${className}`}
    >
      {text ? (
        <span className={`font-semibold text-white ${Icon ? "mr-2" : null}`}>
          {text}
        </span>
      ) : null}
      {Icon ? (
        <Icon className="w-6 h-6 group-hover:scale-125 group-hover:fill-white stroke-2 stroke-white tansition duration-150" />
      ) : null}
    </button>
  );
}
