export default function Footer() {
  return (
    <footer className="items-center p-4 border-t border-neutral-800 bg-neutral-950">
      <aside className="grid-flow-col items-center">
        <p className="text-neutral-200">
          Copyright © {new Date().getFullYear()} - Todos os direitos reservados
        </p>
      </aside>
    </footer>
  );
}
