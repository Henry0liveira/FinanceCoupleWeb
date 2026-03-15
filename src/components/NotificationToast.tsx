export default function NotificationToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[280px] max-w-[90vw] rounded-2xl bg-gradient-to-r from-brandPink via-brandPurple to-brandBlue p-4 text-white shadow-glow">
      <p className="text-sm font-semibold">Atualização do parceiro</p>
      <p className="mt-1 text-xs text-slateSoft-200">{message}</p>
      <button className="mt-3 text-xs font-semibold text-accent" onClick={onClose}>
        Fechar
      </button>
    </div>
  );
}
