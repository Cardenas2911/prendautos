import { useState } from "react";
import type { FaqItem } from "../data/faq";

interface Props {
  items: FaqItem[];
}

export default function FAQAccordion({ items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            className="bg-white border border-border rounded-2xl overflow-hidden"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="w-full px-7 py-6 flex justify-between items-center gap-4 text-left text-[17px] font-semibold tracking-tight cursor-pointer"
            >
              <span>{item.question}</span>
              <span
                aria-hidden
                className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 transition-all",
                  isOpen
                    ? "bg-primary text-white rotate-45"
                    : "bg-light text-primary",
                ].join(" ")}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-7 pb-6">
                <p className="text-base text-gray leading-relaxed m-0">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
