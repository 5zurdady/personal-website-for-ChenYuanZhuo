"use client";

import { useState } from "react";

const SCORE_GUIDE = [
  ["10/10", "教科书级别，完美无瑕之作"],
  ["9/10", "对整个行业具有一定影响力"],
  ["8/10", "某类型的集大成者或巅峰之作"],
  ["7/10", "总体值得推荐"],
  ["6/10", "优缺点鲜明"],
  ["5/10", "缺点多于优点"],
  ["4/10", "鲜有值得认可的部分"],
  ["3/10", "勉强及格"],
];

export default function ScoreGuide() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="relative shrink-0 text-[10px] leading-5 text-neutral-400">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="group text-left text-xs leading-4 tracking-widest uppercase text-neutral-500 transition-all duration-200 hover:-translate-y-0.5 hover:text-neutral-900"
      >
        <span className="border-b border-transparent transition-colors duration-200 group-hover:border-neutral-400">
          评分标准
        </span>
        <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        className={`relative left-0 top-auto z-10 mt-2 grid w-full max-w-none grid-cols-1 gap-x-6 overflow-hidden transition-all duration-500 ease-out sm:grid-cols-2 md:absolute md:left-[calc(100%+1.25rem)] md:top-full md:-mt-12 md:w-[30rem] md:max-w-[30rem] ${
          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
          {SCORE_GUIDE.map(([score, description]) => (
            <p key={score} className="flex gap-2">
              <span className="shrink-0 text-neutral-500">{score}</span>
              <span>{description}</span>
            </p>
          ))}
      </div>
    </aside>
  );
}
