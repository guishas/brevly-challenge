import { toast } from "react-hot-toast";
import { useLinks } from "../store/links";
import { TextField } from "./TextField";
import { useState } from "react";

type FormErrors = {
  originalUrl?: string;
  shortenedUrl?: string;
}

export function LinkForm() {
  const { createLink } = useLinks()
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortSlug, setShortSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "brev.ly";
  const prefix = "brev.ly/";

  function validateUrls() {
    const newErrors: FormErrors = {};
    // Validate original URL
    try {
      new URL(originalUrl);
    } catch {
      newErrors.originalUrl = "URL inválida";
    }
    // Validate shortened slug
    if (!shortSlug) {
      newErrors.shortenedUrl = "URL inválida";
    } else if (!/^[a-zA-Z0-9-]+$/.test(shortSlug)) {
      newErrors.shortenedUrl = "Apenas letras, números e hífens são permitidos após a barra";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrls()) {
      return;
    }
    setLoading(true);
    try {
      const shortenedUrl = frontendUrl + "/" + shortSlug;
      await createLink({ originalUrl, shortenedUrl });
      setOriginalUrl("");
      setShortSlug("");
      setErrors({});
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 bg-white rounded-lg max-w lg:max-w-[380px] lg:w-full">
      <h1 className="text-lg text-gray-800 font-bold">Novo link</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <TextField 
            label="LINK ORIGINAL" 
            placeholder="www.exemplo.com.br" 
            value={originalUrl} 
            onChange={e => {
              setOriginalUrl(e.target.value);
              if (errors.originalUrl) {
                setErrors(prev => ({ ...prev, originalUrl: undefined }));
              }
            }} 
          />
          {errors.originalUrl && (
            <span className="text-sm text-red-500">{errors.originalUrl}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wide">LINK ENCURTADO</label>
          <div className="flex items-center rounded-lg border border-gray-300 p-0.5">
            <span className="pl-3 text-blue-700 font-semibold select-none">{prefix}</span>
            <input
              className="flex-1 bg-transparent outline-none py-3 text-md text-gray-800 font-medium placeholder:text-gray-400"
              value={shortSlug}
              onChange={e => {
                setShortSlug(e.target.value);
                if (errors.shortenedUrl) {
                  setErrors(prev => ({ ...prev, shortenedUrl: undefined }));
                }
              }}
              autoComplete="off"
            />
          </div>
          {errors.shortenedUrl && (
            <span className="text-sm text-red-500">{errors.shortenedUrl}</span>
          )}
        </div>
      </div>
      <button 
        type="submit" 
        className="bg-blue-base text-white text-md font-medium rounded-xl py-4 disabled:opacity-60" 
        disabled={!originalUrl || !shortSlug || loading}
      >
        {loading ? "Salvando..." : "Salvar link"}
      </button>
    </form>
  );
} 