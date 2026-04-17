import type { FC } from "react";
import AuthResultPage from "./AuthResultPage";

interface SignupCompletePageProps {
  onLogin?: () => void;
}

const SignupCompletePage: FC<SignupCompletePageProps> = ({ onLogin }) => (
  <AuthResultPage
    title="회원가입 완료"
    description={"회원가입이 완료되었습니다.\n로그인 후 이용해주세요"}
    buttons={[
      { label: "로그인하기", variant: "filled", onClick: onLogin },
    ]}
  />
);

export default SignupCompletePage;