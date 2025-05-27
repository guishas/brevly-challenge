import type { Link } from "../store/links";
import { useLinks } from "../store/links";
import { toast } from "react-hot-toast";
import { useState } from "react";

export function LinkItem({ link }: { link: Link }) {
  const { deleteLink } = useLinks()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    try {
      setIsDeleting(true)
      await deleteLink(link.id)
      toast.success('Link excluído com sucesso')
    } catch (error) {
      toast.error('Erro ao excluir link')
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link.shortenedUrl)
      toast.success('Link copiado com sucesso')
    } catch (error) {
      toast.error('Erro ao copiar link')
    }
  }

  return (
    <div className="flex flex-row items-center justify-between w-full py-4">
      <div className="flex flex-col mr-8">
        <a href={link.shortenedUrl} target="_blank" rel="noopener noreferrer" className="text-sm lg:text-base font-bold text-blue-700 hover:underline truncate max-w-[400px]">
          {link.shortenedUrl}
        </a>
        <span className="text-[10px] lg:text-sm text-gray-500 truncate max-w-[400px]">{link.originalUrl}</span>
      </div>
      <div className="flex flex-row items-center gap-4">
        <span className="text-[10px] lg:text-sm text-gray-500 whitespace-nowrap">{link.visits} acessos</span>
        <button 
          onClick={handleCopy}
          className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 cursor-pointer" 
          title="Copiar"
        >
          <img src="/copy.svg" alt="Copiar" className="w-4 lg:w-5 h-4 lg:h-5" />
        </button>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className={`bg-gray-100 p-2 rounded-md hover:bg-gray-200 cursor-pointer ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Excluir"
        >
          {isDeleting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800" />
          ) : (
            <img src="/delete.svg" alt="Excluir" className="w-4 lg:w-5 h-4 lg:h-5" />
          )}
        </button>
      </div>
    </div>
  )
}