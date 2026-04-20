import { useState, useEffect } from "react";
import { TopBar } from "./shared/Topbar";
import { Footer } from "./shared/Footer";
import MainPage           from "./features/main/components/MainPage";
import LoginPage          from "./features/auth/components/LoginPage";
import SignupPage         from "./features/auth/components/SignupPage";
import SignupCompletePage from "./features/auth/components/SignupCompletePage";
import FindIdPage         from "./features/auth/components/FindIdPage";
import FindPasswordPage   from "./features/auth/components/FindPasswordPage";
import { useAuth }        from "./features/auth/store/useAuth";

type Page = "main" | "login" | "signup" | "signupComplete" | "findId" | "findPassword";

function AppInner() {
  const { isLoggedIn } = useAuth();
  const [page, setPage]                 = useState<Page>("main");
  const [activeNavTab, setActiveNavTab] = useState<string | null>("all");

  // 로그인 상태 변경 시 자동으로 main으로 이동
  useEffect(() => {
    if (isLoggedIn) {
      setPage("main");
      setActiveNavTab("all");
    }
  }, [isLoggedIn]);

  function goTo(p: Page) {
    setPage(p);
    if (p !== "main") setActiveNavTab(null);
  }

  function handleNavTabChange(id: string) {
    setActiveNavTab(id);
    if (id === "all") goTo("main");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        onLogin={() => goTo("login")}
        onSignup={() => goTo("signup")}
        isLoginActive={page === "login"}
        isSignupActive={page === "signup"}
        isLoggedIn={isLoggedIn}
        activeNavTab={activeNavTab}
        onNavTabChange={handleNavTabChange}
      />
      <main className="flex-1 flex flex-col">
        {page === "main"           && <MainPage />}
        {page === "login"          && (
          <LoginPage
            onSuccess={() => goTo("main")}
            onSignup={() => goTo("signup")}
            onFindId={() => goTo("findId")}
            onFindPassword={() => goTo("findPassword")}
          />
        )}
        {page === "signup"         && (
          <SignupPage
            onBack={() => goTo("login")}
            onComplete={() => goTo("signupComplete")}
          />
        )}
        {page === "signupComplete" && (
          <SignupCompletePage onLogin={() => goTo("login")} />
        )}
        {page === "findId"         && (
          <FindIdPage
            onLogin={() => goTo("login")}
            onSignup={() => goTo("signup")}
            onFindPassword={() => goTo("findPassword")}
          />
        )}
        {page === "findPassword"   && (
          <FindPasswordPage
            onLogin={() => goTo("login")}
            onSignup={() => goTo("signup")}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AppInner;