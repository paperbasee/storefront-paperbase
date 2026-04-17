import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1680px] px-4 md:px-10 lg:px-12 xl:px-14">
      {children}
    </div>
  );
}
