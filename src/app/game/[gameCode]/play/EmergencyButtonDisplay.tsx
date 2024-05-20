import Image from "next/image";

export default function EmergencyButtonDisplay() {
  return (
    <div className={`flex place-content-center w-full h-full z-10`}>
      <Image
        src={"/emergencyButton.png"}
        alt={"Emergency Button"}
        width={100}
        height={100}
        className={`object-contain p-[10%]`}
      />
    </div>
  );
}
