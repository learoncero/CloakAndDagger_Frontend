import React, { useEffect } from "react";

type Props = {
  imageSrc: string;
  heading: string;
  text: string;
  onDismiss: () => void;
};

export default function InformationPopUp({
  imageSrc,
  heading,
  text,
  onDismiss,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
        <div className="rounded-lg p-8 text-white border border-white content-center text-center bg-black items-center">
          <div className="flex flex-col items-center">
            <img className="w-80 h-36 mb-2" src={imageSrc} alt={heading} />
            <h2 className="text-6xl font-bold mb-12 mt-6 text-red-500">
              {heading}
            </h2>
          </div>
          <p className="text-gray-200 mb-4 font-semibold text-lg">{text}</p>
        </div>
      </div>
    </>
  );
}
