import type { FC } from "react";
import { useFeatureCards } from "../hooks/useFeatureCards";
import type { FeatureCard } from "../models/types";

function bgStyle(imageSrc: string) {
  if (imageSrc) {
    return {
      backgroundImage: `url(${imageSrc})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return {};
}

function bgClass(imageSrc: string, from: string, to: string) {
  return imageSrc ? "" : `bg-gradient-to-br ${from} ${to}`;
}

const FeatureCardItem: FC<{ card: FeatureCard }> = ({ card }) => (
  <div
    className={`relative rounded-lg overflow-hidden flex-1 ${bgClass(card.imageSrc, card.gradientFrom, card.gradientTo)}`}
    style={{ height: 250, ...bgStyle(card.imageSrc) }}
  >
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 flex flex-col justify-between h-full p-5">
      {/* 번호 */}
      <span className="text-[50px] font-semibold leading-[140%] text-primary-light">
        {card.number}
      </span>
      {/* 하단 텍스트 */}
      <div className="flex flex-col gap-1">
        <p className="text-[30px] font-semibold leading-[140%] text-[#F0F0F0]">
          {card.title}
        </p>
        <p className={`text-b-14 font-medium leading-[140%] ${card.descriptionColor} max-w-[225px]`}>
          {card.description}
        </p>
      </div>
    </div>
  </div>
);

const FeatureCards: FC = () => {
  const { featureCards } = useFeatureCards();

  return (
    <section className="flex gap-3">
      {featureCards.map((card) => (
        <FeatureCardItem key={card.id} card={card} />
      ))}
    </section>
  );
};

export default FeatureCards;