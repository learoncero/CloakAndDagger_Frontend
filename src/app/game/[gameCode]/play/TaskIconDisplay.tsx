import Image from "next/image";

type Props = {
    completed: boolean;
    isTaskInteractable?: boolean;
};

export default function TaskIconDisplay({ completed, isTaskInteractable }: Props) {
    const taskComplete = '/taskComplete.png';
    const taskNotComplete = '/taskNotComplete.png';

    return (
        <div className={`flex place-content-center w-full h-full relative`}>
            <Image src={completed ? taskComplete : taskNotComplete}
                   alt={completed ? 'TaskGateway Complete' : 'TaskGateway Not Complete'}
                   width={100}
                   height={100}
                   className={`object-contain`}
            />
            {(isTaskInteractable && !completed) && <div className="absolute top-1 right-2 text-black font-bold bg-white px-1 rounded-full">E</div>}
        </div>
    );
}