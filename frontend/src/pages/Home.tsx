import { LinkForm } from "../components/LinkForm";
import { Logo } from "../components/Logo";
import { LinksList } from "../components/LinksList";

export function Home() {
  return (
    <div className="lg:py-20 py-4 lg:px-48 px-2 flex flex-col gap-4 lg:gap-8">
      <Logo />

      <div className="flex lg:flex-row flex-col lg:gap-5 gap-2">
        <LinkForm />
        <LinksList />
      </div>
    </div>
  );
}