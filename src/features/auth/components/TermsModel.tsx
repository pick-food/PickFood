import type { FC } from "react";

interface TermsModalProps {
  onClose: () => void;
  onAgree: () => void;
}

const TermsModal: FC<TermsModalProps> = ({ onClose, onAgree }) => {
  return (
    // 배경 오버레이
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* 모달 본체 */}
      <div
        className="bg-white rounded-lg w-[480px] max-h-[80vh] flex flex-col shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-mid">
          <h2 className="text-b-16 font-semibold text-gray-900">이용약관 및 개인정보 처리방침</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 내용 (스크롤) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 text-[12px] leading-[180%] text-gray-600 space-y-5">

          <section>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-2">제1조 (목적)</h3>
            <p>본 약관은 PickFood(이하 "서비스")가 제공하는 식품 성분 분석 및 알레르기 필터링 서비스의 이용과 관련하여 서비스와 회원 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-2">제2조 (정의)</h3>
            <p>"회원"이란 서비스에 접속하여 본 약관에 동의하고 서비스를 이용하는 자를 말합니다. "서비스"란 PickFood가 제공하는 식품 성분 분석, 알레르기 필터링, 맞춤 상품 추천 등 일체의 서비스를 말합니다.</p>
          </section>

          <section>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-2">제3조 (약관의 효력 및 변경)</h3>
            <p>본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 효력을 발생합니다. 서비스는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 내에서 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.</p>
          </section>

          <section>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-2">제4조 (개인정보 수집 및 이용)</h3>
            <p>서비스는 회원가입 및 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li>필수 항목: 이름, 닉네임, 이메일, 비밀번호, 휴대폰 번호</li>
              <li>선택 항목: 알레르기 정보, 질병 정보, 식품 선호도</li>
            </ul>
            <p className="mt-2">수집된 개인정보는 회원 식별, 서비스 제공, 맞춤 상품 추천에 활용되며 법령에 따른 경우를 제외하고 제3자에게 제공하지 않습니다.</p>
          </section>

          <section>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-2">제5조 (회원의 의무)</h3>
            <p>회원은 서비스 이용 시 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
              <li>서비스의 안정적인 운영을 방해하는 행위</li>
              <li>서비스에서 얻은 정보를 무단으로 복제, 배포하는 행위</li>
              <li>기타 관련 법령에 위반되는 행위</li>
            </ul>
          </section>

          <section>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-2">제6조 (서비스 이용 제한)</h3>
            <p>서비스는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고 또는 서비스 이용 제한 조치를 취할 수 있습니다.</p>
          </section>

          <section>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-2">제7조 (면책 조항)</h3>
            <p>서비스는 천재지변, 시스템 장애 등 불가항력으로 인해 서비스를 제공하지 못한 경우 책임을 지지 않습니다. 서비스에서 제공하는 식품 성분 분석 정보는 참고용이며, 의료적 판단의 근거로 사용하지 않도록 합니다.</p>
          </section>

          <section>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-2">제8조 (문의)</h3>
            <p>서비스 이용약관 및 개인정보 처리방침에 관한 문의는 고객지원 센터를 통해 접수하실 수 있습니다.</p>
          </section>

        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-[8px] px-6 py-4 border-t border-border-mid">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[36px] border border-gray-100 rounded-xs text-[10px] font-medium text-gray-400 hover:bg-surface transition-colors"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={onAgree}
            className="flex-1 h-[36px] bg-primary rounded-xs text-[10px] font-medium text-white hover:bg-primary-dark transition-colors"
          >
            동의하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;