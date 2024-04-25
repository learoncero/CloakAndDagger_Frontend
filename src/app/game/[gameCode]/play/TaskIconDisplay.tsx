import taskComplete from 'public/taskComplete.png';
import taskNotComplete from 'public/taskNotComplete.png';

type Props = {
    completed: boolean;
};

export default function TaskIconDisplay({ completed }: Props) {

  return (
      <div className={`flex place-content-center w-full h-full z-10 bg-[url('${completed ? taskComplete : taskNotComplete}')]`}>
          {/*<div className={`bg-[url('${completed ? taskComplete' : 'taskNotComplete.png'}')]
                        bg-cover w-full h-full bg-center z-100`}>

          </div>*/}
      </div>
  );
}

/*<div className={ `bg-[url('${completed ? '/taskComplete.png': '/taskNotComplete.png'}')]
                        bg-cover w-full h-full bg-center`} >

      </div>*/