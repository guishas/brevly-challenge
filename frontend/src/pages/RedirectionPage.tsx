import { useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function RedirectionPage() {
  const { shortenedUrl } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function checkAndRedirect() {
      if (!shortenedUrl) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links/${shortenedUrl}`).then(res => res.json());

        console.log(response)

        if (response) {   
          window.location.replace(response.originalUrl);
        } else {
          navigate("/not-found");
        }
      } catch {
        navigate("/not-found");
      }
    }
    
    checkAndRedirect();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl p-16 flex flex-col items-center gap-6 shadow-md">
        <img src="/minimal-logo.svg" alt="Logo" className="w-16 h-16 mb-2" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Redirecionando...</h1>
        <p className="text-gray-500 text-lg text-center">
          O link será aberto automaticamente em alguns instantes.<br />
          Não foi redirecionado? {shortenedUrl && (
            <a
              href={`${import.meta.env.VITE_BACKEND_URL}/links/${shortenedUrl}`}
              className="text-blue-700 underline"
            >
              Acesse aqui
            </a>
          )}
        </p>
      </div>
    </div>
  );
} 