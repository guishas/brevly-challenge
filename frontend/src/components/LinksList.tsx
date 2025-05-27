import { toast } from "react-hot-toast";
import { useLinks } from "../store/links";
import { LinkItem } from "./LinkItem";
import { useEffect, useState } from "react";
import { downloadUrl } from "../utils/download-url";

export function LinksList() {
  const { getLinks, exportCsv } = useLinks()
  const links = useLinks(state => state.links)
  const [isLoading, setIsLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    async function fetchLinks() {
      try {
        setIsLoading(true)
        await getLinks()
      } catch (error) {
        toast.error('Erro ao carregar links')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLinks()
  }, [])

  async function handleDownloadCsv() {
    try {
      setDownloading(true)
      const url = await exportCsv()

      console.log(url)
      
      await downloadUrl(url)
    } catch (error) {
      toast.error('Erro ao baixar CSV')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8 bg-white rounded-lg w-full h-min">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg text-gray-800 font-bold">Meus links</h2>

        <button 
          className="flex flex-row items-center justify-center gap-2 text-sm bg-gray-200 hover:bg-gray-300 p-2 text-gray-500 font-semibold cursor-pointer rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={links.size === 0 || downloading}
          onClick={handleDownloadCsv}
        >
          <img src="/download.svg" alt="Baixar CSV" className="w-4 h-4" />
          {downloading ? 'Baixando...' : 'Baixar CSV'}
        </button>
      </div>
      
      <div className="h-[1px] rounded-md bg-gray-200"></div>

      {isLoading ? (
        <div className="flex flex-col gap-4 items-center justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          <h3 className="text-xs text-gray-500">Carregando...</h3>
        </div>
      ) : links.size === 0 ? (
        <div className="flex flex-col gap-4 items-center justify-center my-8">
          <img src="/link.svg" alt="Nenhum link encontrado" className="w-12 h-12" />
          <h3 className="text-xs text-gray-500 uppercase text-center">Ainda não existem links cadastrados</h3>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {Array.from(links.values()).map((link, idx) => (
            <div key={link.id}>
              <LinkItem link={link} />
              {idx !== links.size - 1 && (
                <div className="h-[1px] bg-gray-200 w-full" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}