import Image from "next/image";

type Props = {
    completed: boolean;
};

export default function TaskIconDisplay({ completed }: Props) {
    const taskComplete = '/taskComplete.png';
    const taskNotComplete = '/taskNotComplete.png';
  return (
      <div className={`flex place-content-center w-full h-full z-10`}>
          <Image src={completed ? taskComplete : taskNotComplete}
                 alt={completed ? 'Task Complete' : 'Task Not Complete'}
                 width={100}
                 height={100}
                 className={`object-contain`}
          />
      </div>
  );
}
