import Image from "next/image";

type Props = {
  isButtonInteractable: boolean;
};

export default function EmergencyButtonDisplay({
  isButtonInteractable,
}: Props) {
  return (
    <div className={`flex place-content-center w-full h-full z-10`}>
      <Image
        src={"/emergencyButton.png"}
        alt={"Emergency Button"}
        width={100}
        height={100}
        className={`object-contain p-[10%]`}
      />
      {isButtonInteractable && (
        <div className="absolute top-1 right-2 text-black font-bold bg-white px-1 rounded-full">
          F
        </div>
      )}
    </div>
  );
}
