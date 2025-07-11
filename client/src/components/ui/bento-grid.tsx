import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  image,
  element
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  image?: React.ReactNode;
  element?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-end space-y-3 sm:space-y-4 rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none bg-opacity-30 backdrop-blur-xl",
        className,
      )}
    >
      {header}
      {image}
      {element}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mt-2 mb-2 font-sans font-bold text-sm sm:text-base text-neutral-600 dark:text-neutral-200">
          {title}
        </div>
        <div className="font-sans text-xs sm:text-sm font-normal text-neutral-600 dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};