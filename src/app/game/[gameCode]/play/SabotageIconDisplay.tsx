import Image from "next/image";


export default function SabotageIconDisplay() {
  return (
    <div className={`flex place-content-center w-full h-full z-10`}>
      <Image src={'/sabotage.png'}
           alt={'Sabotage'}
           width={100}
           height={100}
           className={`object-contain p-[10%]`}
      />
    </div>
  );
}