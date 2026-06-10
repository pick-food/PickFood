import { useState, useEffect } from "react";
import { TopBar } from "./shared/Topbar";
import { Footer } from "./shared/Footer";
import MainPage           from "./features/main/components/MainPage";
import LoginPage          from "./features/auth/components/LoginPage";
import SignupPage         from "./features/auth/components/SignupPage";
import SignupCompletePage from "./features/auth/components/SignupCompletePage";
import FindIdPage         from "./features/auth/components/FindIdPage";
import FindPasswordPage   from "./features/auth/components/FindPasswordPage";
import ProductPage        from "./features/product/components/ProductPage";
import ProductDetailPage  from "./features/product/components/ProductDetailPage";
import { useAuth }        from "./features/auth/store/useAuth";
import type { Product }   from "./features/product/models/type";
import Chatbot            from "./features/chat/components/Chatbot";

type Page = "main" | "login" | "signup" | "signupComplete" | "findId" | "findPassword" | "product";

// 페이지 → activeNavTab 매핑
const PAGE_TO_TAB: Partial<Record<Page, string>> = {
  main:    "all",
  product: "product",
};

function AppInner() {
  const { isLoggedIn } = useAuth();
  const [page, setPage]                       = useState<Page>("main");
  const [activeNavTab, setActiveNavTab]       = useState<string | null>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 이미 로그인된 상태로 앱이 로드될 때(새로고침 등) 메인으로 이동.
  // isLoggedIn 변경 시마다 실행하면 회원가입 완료 후 signupComplete 대신 main으로
  // 튕기는 문제가 생기므로 마운트 시 1회만 실행.
  useEffect(() => {
    if (isLoggedIn) {
      setPage("main");
      setActiveNavTab("all");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goTo(p: Page) {
    setPage(p);
    setSelectedProduct(null);
    // 페이지에 대응하는 탭이 있으면 설정, 없으면 null (로그인 등)
    setActiveNavTab(PAGE_TO_TAB[p] ?? null);
  }

  function handleNavTabChange(id: string) {
    setActiveNavTab(id);
    if (id === "all") {
      goTo("main");
    } else if (id === "ai") {
      // Open the floating chatbot widget without navigating
      window.dispatchEvent(new CustomEvent("pickfood:openchat"));
    } else {
      // All food category tabs go to the product listing page
      goTo("product");
    }
  }

  function handleProductClick(product: Product) {
    if (!isLoggedIn) {
      goTo("login");
      return;
    }
    setSelectedProduct(product);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ position: 'relative' }}>
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
        {selectedProduct ? (
          <>
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
            />
            <div className="mt-[30px]">
              <Footer />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            {page === "main"           && <MainPage onProductClick={handleProductClick} onSignup={() => goTo("signup")} onGoToProduct={() => goTo("product")} />}
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
            {page === "product"        && (
              <ProductPage onProductClick={handleProductClick} />
            )}
            <div className="mt-[30px]">
              <Footer />
            </div>
          </div>
        )}
      </main>
      <Chatbot />
    </div>
  );
}

export default AppInner;