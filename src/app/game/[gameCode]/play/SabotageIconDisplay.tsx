import Image from "next/image";


export default function SabotageIconDisplay() {
  return (
    <div className={`flex place-content-center w-full h-full z-10`}>
      <Image src={'/sabotage.png'}
           alt={'Sabotage'}
            width={46}
            height={46}/>
    </div>
  );
}