import Image from "next/image";

/** One spiral-bound notebook page on the navy desk. */
export function Notebook({
  id,
  header = false,
  children,
  className = "",
}: {
  id?: string;
  header?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-3 sm:px-6">
      {header && (
        <div className="paper relative flex min-h-20 items-center justify-between rounded-t-[22px] rounded-b-[10px] px-5 pb-8 pt-4 shadow-paper sm:px-10">
          <span className="font-serif text-[0.8rem] text-ink sm:text-base">
            Trường Đại học Bách khoa – ĐHQG TP.HCM
          </span>
          <Image
            src="/img/hcmut-logo.webp"
            alt="Logo Trường Đại học Bách khoa TP.HCM"
            width={240}
            height={242}
            className="h-11 w-auto sm:absolute sm:left-1/2 sm:top-3 sm:h-14 sm:-translate-x-1/2"
          />
          <span className="hidden font-serif text-base italic text-ink-soft sm:block">Lễ tốt nghiệp 2026</span>
        </div>
      )}
      {/* spiral binding */}
      <div className={`relative z-20 h-16 ${header ? "-my-8" : "-mb-8"}`} aria-hidden="true">
        <div className="absolute inset-x-2 top-1/2 h-4 -translate-y-1/2 rounded-full bg-navy-deep sm:inset-x-4" />
        <div className="rings absolute inset-x-6 inset-y-0 sm:inset-x-10" />
      </div>
      <div className={`paper relative rounded-[22px] px-4 pb-14 pt-14 shadow-paper sm:px-10 ${className}`}>{children}</div>
    </section>
  );
}
