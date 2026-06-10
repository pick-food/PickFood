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
import RecipePage         from "./features/recipe/components/RecipePage";
import MyPage             from "./features/mypage/components/MyPage";
import { useAuth }        from "./features/auth/store/useAuth";
import type { Product }   from "./features/product/models/type";
import Chatbot            from "./features/chat/components/Chatbot";

type Page = "main" | "login" | "signup" | "signupComplete" | "findId" | "findPassword" | "product" | "mypage" | "recipe";

const PAGE_TO_TAB: Partial<Record<Page, string>> = {
  main:    "all",
  product: "product",
  recipe:  "recipe",
};

function AppInner() {
  const { isLoggedIn } = useAuth();
  const [page, setPage]                         = useState<Page>("main");
  const [activeNavTab, setActiveNavTab]         = useState<string | null>("all");
  const [selectedProduct, setSelectedProduct]   = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

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
    setActiveNavTab(PAGE_TO_TAB[p] ?? null);
  }

  const NAV_TO_CAT: Record<string, string> = {
    meat: 'protein', fruit: 'fruit', vegetable: 'veg',
    dairy: 'dairy', staple: 'staple', frozen: 'ready',
    snack: 'snack', baby: 'baby', health: 'health',
  };

  function handleNavTabChange(id: string) {
    setActiveNavTab(id);
    if (id === "all") {
      goTo("main");
    } else if (id === "ai") {
      window.dispatchEvent(new CustomEvent("pickfood:openchat"));
    } else if (id === "recipe") {
      goTo("recipe");
    } else {
      const cat = NAV_TO_CAT[id] ?? id;
      setSelectedCategory(cat);
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
    <div className="min-h-screen flex flex-col bg-[#FAFAF6]" style={{ position: 'relative' }}>
      <TopBar
        onLogin={() => goTo("login")}
        onSignup={() => goTo("signup")}
        onMyPage={() => goTo("mypage")}
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
            <Footer />
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            {page === "main"           && <MainPage onProductClick={handleProductClick} onGoToProduct={(cat) => { setSelectedCategory(cat); goTo("product"); }} />}
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
              <ProductPage onProductClick={handleProductClick} initialCategory={selectedCategory} />
            )}
            {page === "recipe"         && (
              <RecipePage onBack={() => goTo("main")} />
            )}
            {page === "mypage"         && (
              <MyPage onBack={() => goTo("main")} />
            )}
            <Footer />
          </div>
        )}
      </main>
      <Chatbot />
    </div>
  );
}

export default AppInner;
