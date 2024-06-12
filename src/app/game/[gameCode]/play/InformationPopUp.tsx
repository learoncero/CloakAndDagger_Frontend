import React, { useEffect } from "react";

type Props = {
  imageSrc?: string;
  heading: string | string[];
  text: string | string[];
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
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
        <div className="rounded-lg p-8 text-white border border-white content-center text-center bg-black items-center">
          <div className="flex flex-col items-center">
            {imageSrc && (
              <img
                className="w-80 h-36 mb-2"
                src={imageSrc}
                alt={typeof heading === "string" ? heading : heading.join(" ")}
              />
            )}
            <h2 className="text-6xl font-bold mb-12 mt-6 text-red-500">
              {Array.isArray(heading) ? heading.join(" ") : heading}
            </h2>
          </div>
          {Array.isArray(text) ? (
            text.map((line, index) => (
              <p
                key={index}
                className="text-gray-200 mb-4 font-semibold text-lg"
              >
                {line}
              </p>
            ))
          ) : (
            <p className="text-gray-200 mb-4 font-semibold text-lg">{text}</p>
          )}
        </div>
      </div>
    </>
  );
}
