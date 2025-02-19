export default function ChatHeader() {
  function closeChat() {
    window.parent.postMessage({ action: "closeWidget" }, "*");
  }

  return (
    <div className="flex h-16 w-full fixed top-0 items-center justify-between bg-green-600 p-4">
      <p className="font-semibold text-white">Atendimento Online</p>
      <button className="font-semibold text-white" onClick={closeChat}>
        Fechar
      </button>
    </div>
  );
}
