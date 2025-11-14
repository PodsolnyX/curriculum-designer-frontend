import React from 'react';
import { useControls } from 'react-zoom-pan-pinch';
import { createPortal } from 'react-dom';

interface AtomCardOutViewProps extends React.PropsWithChildren {
  enable: boolean;
  semesterOrder?: number;
  id: string;
}

export const AtomCardOutView = ({
  enable,
  semesterOrder = 1,
  id,
  children,
}: AtomCardOutViewProps) => {
  const Wrapper = ({ children }: React.PropsWithChildren) => {
    const { zoomToElement } = useControls();

    const scrollToTarget = () => {
      zoomToElement(document.getElementById(id));
    };

    return (
      <div>
        <div>{children}</div>
        {createPortal(
          <div
            onClick={scrollToTarget}
            style={{ right: 340, bottom: 12 + (semesterOrder - 1) * 32 }}
            className={`h-[32px] w-[32px] cursor-pointer fixed bg-white/[.8] backdrop-blur hover:text-blue-500 transition z-50 flex justify-center items-center font-bold`}
          >
            {semesterOrder}
          </div>,
          document.body,
        )}
      </div>
    );
  };

  return enable ? <Wrapper>{children}</Wrapper> : children;
};
