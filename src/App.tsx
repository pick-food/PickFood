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
import ChatPage           from "./features/chat/components/ChatPage";
import LoginRequired     from "./shared/components/LoginRequired";

type Page    = "main" | "login" | "signup" | "signupComplete" | "findId" | "findPassword" | "product" | "mypage" | "recipe" | "loginRequired" | "chat";
type MyTab   = "orders" | "cart" | "wishlist" | "safety" | "address" | "profile" | "notifications";

const PAGE_TO_TAB: Partial<Record<Page, string>> = {
  main:    "all",
  product: "product",
  recipe:  "recipe",
  chat:    "ai",
};

function AppInner() {
  const { isLoggedIn } = useAuth();
  const [page, setPage]                         = useState<Page>("main");
  const [activeNavTab, setActiveNavTab]         = useState<string | null>("all");
  const [selectedProduct, setSelectedProduct]   = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [myPageTab, setMyPageTab]               = useState<MyTab>("orders");

  useEffect(() => {
    if (isLoggedIn) {
      setPage("main");
      setActiveNavTab("all");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleNavigate(e: Event) {
      const tab = (e as CustomEvent<{ tab: MyTab }>).detail?.tab;
      if (tab && isLoggedIn) goToMyPage(tab);
    }
    window.addEventListener("pickfood:navigate", handleNavigate);
    return () => window.removeEventListener("pickfood:navigate", handleNavigate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  function goTo(p: Page) {
    setPage(p);
    setSelectedProduct(null);
    setActiveNavTab(PAGE_TO_TAB[p] ?? null);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  function goToMyPage(tab: MyTab) {
    setMyPageTab(tab);
    goTo("mypage");
  }

  const NAV_TO_CAT: Record<string, string> = {
    all: 'all', product: 'protein',
    meat: 'protein', fruit: 'fruit', vegetable: 'veg',
    dairy: 'dairy', staple: 'staple', frozen: 'ready',
    snack: 'snack', baby: 'baby', health: 'health',
  };

  function handleNavTabChange(id: string) {
    setActiveNavTab(id);
    if (id === "ai") {
      if (!isLoggedIn) { goTo("loginRequired"); return; }
      goTo("chat");
    } else if (id === "recipe") {
      if (!isLoggedIn) { goTo("loginRequired"); return; }
      goTo("recipe");
    } else {
      if (!isLoggedIn) { goTo("loginRequired"); return; }
      const cat = NAV_TO_CAT[id] ?? id;
      setSelectedCategory(cat);
      goTo("product");
    }
  }

  function handleProductClick(product: Product) {
    if (!isLoggedIn) {
      goTo("loginRequired");
      return;
    }
    setSelectedProduct(product);
  }

  const isChat = page === "chat" && !selectedProduct;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ position: 'relative', background: '#fff', ...(isChat ? { height: '100vh' } : {}) }}
    >
      <TopBar
        onLogin={() => goTo("login")}
        onSignup={() => goTo("signup")}
        onMyPage={() => isLoggedIn ? goToMyPage("orders") : goTo("loginRequired")}
        onWishlist={() => isLoggedIn ? goToMyPage("wishlist") : goTo("loginRequired")}
        onCart={() => isLoggedIn ? goToMyPage("cart") : goTo("loginRequired")}
        isLoginActive={page === "login"}
        isSignupActive={page === "signup"}
        isLoggedIn={isLoggedIn}
        activeNavTab={activeNavTab}
        onNavTabChange={handleNavTabChange}
        onLogoClick={() => { setActiveNavTab("all"); goTo("main"); }}
      />
      <main className="flex-1 flex flex-col" style={isChat ? { minHeight: 0 } : undefined}>
        {selectedProduct ? (
          <>
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
            />
            <Footer />
          </>
        ) : (
          <div className="flex-1 flex flex-col" style={isChat ? { minHeight: 0 } : undefined}>
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
              <MyPage onBack={() => goTo("main")} initialTab={myPageTab} onProductClick={handleProductClick} />
            )}
            {page === "chat"           && (
              <ChatPage onBack={() => goTo("main")} onManageFilter={() => goToMyPage("safety")} />
            )}
            {page === "loginRequired"  && (
              <LoginRequired onLogin={() => goTo("login")} />
            )}
            {page !== "chat" && <Footer />}
          </div>
        )}
      </main>
      <Chatbot />
    </div>
  );
}

export default AppInner;
