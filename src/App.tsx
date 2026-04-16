import { useState } from "react";
import { TopBar } from "./shared/Topbar";
import { Footer } from "./shared/Footer";
import MainPage   from "./features/main/components/MainPage";
import LoginPage  from "./features/auth/components/LoginPage";
import SignupPage from "./features/auth/components/SignupPage";

type Page = "main" | "login" | "signup" | "findId" | "findPassword";

function App() {
  const [page, setPage] = useState<Page>("main");

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        onLogin={() => setPage("login")}
        onSignup={() => setPage("signup")}
        isLoginActive={page === "login"}
        isSignupActive={page === "signup"}
      />
      <main className="flex-1 flex flex-col">
        {page === "main"   && <MainPage />}
        {page === "login"  && (
          <LoginPage
            onSignup={() => setPage("signup")}
            onFindId={() => setPage("findId")}
            onFindPassword={() => setPage("findPassword")}
          />
        )}
        {page === "signup" && (
          <SignupPage onBack={() => setPage("login")} />
        )}
        {page === "findId"       && <div>아이디 찾기 (준비 중)</div>}
        {page === "findPassword" && <div>비밀번호 찾기 (준비 중)</div>}
      </main>
      <Footer />
    </div>
  );
}

export default App;