export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center gap-6 px-12 py-16 bg-gray-100 rounded-lg max-w-[580px]">
        <img src="/404.svg" alt="Not found" />
        <h1 className="text-2xl font-bold">Link não encontrado</h1>
        <p className="text-sm text-gray-500 text-center">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em
          {' '}  
          <a href="/" className="text-blue-base underline cursor-pointer">brev.ly</a>
          .
        </p>
      </div>
    </div>
  );
}