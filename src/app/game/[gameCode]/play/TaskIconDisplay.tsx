type Props = {
    completed: boolean;
};

export default function TaskIconDisplay({ completed }: Props) {
    const taskComplete = '/taskComplete.png';
    const taskNotComplete = '/taskNotComplete.png';
  return (
      <div className={`flex place-content-center w-full h-full z-10`}>
          <img src={completed ? taskComplete : taskNotComplete}
               alt={completed ? 'TaskGateway Complete' : 'TaskGateway Not Complete'}/>
      </div>
  );
}
