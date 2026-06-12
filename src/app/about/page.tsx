import Navbar from "@/components/Navbar";
import Image from "next/image";
import { getAbout } from "@/lib/aboutStore";

export default async function AboutPage() {
  const about = await getAbout();
  const mainDescription =
    "陈远卓如今在大学读法律专业，\n同时也在寻找一片永恒的雪天。\n\n联系方式：2868511436(QQ)";
  const descriptionParagraphs = mainDescription.split(/\n\s*\n/);
  const creditText = about.description || "网站制作来自吴宗翰";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-12 md:py-20 max-w-5xl w-full self-center">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-6">About</p>

        <section className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 md:gap-12 items-start">
          <div className="relative w-full max-w-md aspect-[4/5] bg-neutral-100 overflow-hidden">
            <Image
              src={`/images/${about.image}`}
              alt={about.title || "Portrait"}
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-8 md:mt-32 text-base md:text-lg lg:text-xl text-neutral-600 leading-8 space-y-5 md:pl-8 lg:pl-12">
            {descriptionParagraphs.map((paragraph, index) => {
              const name = "陈远卓";

              // 先按行拆分（处理 \n），然后在每行里加粗名字
              const lines = paragraph.split("\n");

              return (
                <p key={index} className="tracking-[0.22em]">
                  {lines.map((line, lineIndex) => {
                    const idx = line.indexOf(name);
                    const before = idx === -1 ? line : line.slice(0, idx);
                    const after = idx === -1 ? "" : line.slice(idx + name.length);

                    return (
                      <span key={lineIndex}>
                        {before}
                        {idx !== -1 && <strong>{name}</strong>}
                        {after}
                        {lineIndex < lines.length - 1 && <br />}
                      </span>
                    );
                  })}
                </p>
              );
            })}
            {creditText && (
              <>
                <p className="text-xs text-neutral-500">
                  本站所有文章、照片、视频均为个人独立创作，受著作权法保护，侵权必究。
                </p>
                <p className="text-xs text-neutral-500">{creditText}</p>
              </>
            )}
          </div>
        </section>
      </main>
      <footer className="w-full py-8 px-6 md:px-12 text-center">
        <p className="text-[10px] tracking-widest uppercase text-neutral-400">
          &copy;2026 ChenYuanzhuo
        </p>
      </footer>
    </div>
  );
}
