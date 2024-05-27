import Image from "next/image";

type Props = {
  isSabotageInteractable: boolean;
    isVisible: boolean;
};

export default function SabotageIconDisplay({isSabotageInteractable, isVisible}: Props) {
  return (
    <div className={`flex place-content-center w-full h-full z-10 ${!isVisible ? "opacity-50 animate-blink" : ""}`}>
      <Image
        src={"/sabotage.png"}
        alt={"Sabotage"}
        width={100}
        height={100}
        className={`object-contain p-[10%]`}
      />
      {isSabotageInteractable && (
        <div className="absolute top-1 right-2 text-black font-bold bg-white px-1 rounded-full">
          C
        </div>
      )}
    </div>
  );
}
