import { enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";

export type Link = {
  id: string;
  originalUrl: string;
  shortenedUrl: string;
  visits: number;
  createdAt: Date;
};

type LinksState = {
  links: Map<string, Link>;
  getLinks: () => Promise<Link[]>;
  createLink: (link: Pick<Link, 'originalUrl' | 'shortenedUrl'>) => Promise<Link | null>;
  deleteLink: (id: string) => Promise<void>;
  exportCsv: () => Promise<string>;
};

enableMapSet()

export const useLinks = create<LinksState, [["zustand/immer", never]]>(
  immer((set, get) => {
    async function getLinks() {
      const response = await axios.get<{ links: Link[] }>('http://localhost:3333/links')

      if (response.data) {
        response.data.links.forEach((link) => {
          set((state) => {
            state.links.set(link.id, link)
          })
        })

        return response.data.links
      }

      return []
    }

    async function createLink(link: Pick<Link, 'originalUrl' | 'shortenedUrl'>) {
      const response = await axios.post<{ link: Link }>('http://localhost:3333/links', {
        originalUrl: link.originalUrl,
        shortenedUrl: link.shortenedUrl,
      })

      if (response.data) {
        set((state) => {
          state.links.set(response.data.link.id, response.data.link)
        })

        return response.data.link
      }

      return null
    }

    async function deleteLink(id: string) {
      const response = await axios.delete(`http://localhost:3333/links/${id}`)
      
      if (response.status === 204) {
        set((state) => {
          state.links.delete(id)
        })
      }
    }

    async function exportCsv(): Promise<string> {
      const response = await axios.get<{ reportUrl: string }>(`${import.meta.env.VITE_BACKEND_URL}/links/export`);
      return response.data.reportUrl;
    }

    return {
      links: new Map(),
      getLinks,
      createLink,
      deleteLink,
      exportCsv,
    }
  })
)