type Props = {
  modalText: string;
  children: React.ReactNode;
};

export default function GameOver({ modalText, children }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div className="w-96 h-72 rounded-lg p-8 text-white border border-white content-center text-center">
        <h2 className="text-5xl text-red-600 font-bold mb-4">{modalText}</h2>
        {children}
      </div>
    </div>
  );
}
