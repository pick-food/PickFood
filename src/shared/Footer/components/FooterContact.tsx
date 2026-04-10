import { CONTACT_INFO } from '../models/footer.model';

export function FooterContact() {
  return (
    <div className="flex flex-col gap-[15px]">
      <span className="text-[15px] font-medium leading-[18px] tracking-[-0.025em] text-black">
        고객센터
      </span>
      <div className="flex flex-col gap-[5px]">
        {CONTACT_INFO.map((info) => (
          <span
            key={info.label}
            className="text-[13px] font-medium leading-[140%] tracking-[-0.025em] text-gray-600"
          >
            {info.label}
          </span>
        ))}
      </div>
    </div>
  );
}