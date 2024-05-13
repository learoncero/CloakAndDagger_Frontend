type Props = {
  modalText: string;
  textColor: string;
  children: React.ReactNode;
};

export default function Modal({ modalText, textColor, children }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-20">
      <div className="w-96 h-72 rounded-lg p-8 text-white border border-white content-center text-center">
        <h2 className={`text-5xl font-bold mb-4 ${textColor}`}>{modalText}</h2>
        {children}
      </div>
    </div>
  );
}
