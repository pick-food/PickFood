import logo from '/logo.svg';
import { useTopBar }    from './hooks/useTopBar';
import { SearchBar }    from './components/SearchBar';
import { FilterBar }    from './components/FilterBar';
import { NavBar }       from './components/NavBar';
import { UserActions }  from './components/UserActions';

interface TopBarProps {
  onSearch?:  (query: string) => void;
  onLogin?:   () => void;
  onSignup?:  () => void;
  onSupport?: () => void;
}

export function TopBar({
  onSearch,
  onLogin,
  onSignup,
  onSupport,
}: TopBarProps) {
  const { search, filter, activeTab, setActiveTab, tabs } = useTopBar(onSearch);

  return (
    <header className="w-full sticky top-0 z-50">

      {/* Row 1: 로고 / 검색 / 유저 액션 */}
      <div className="bg-surface px-4">
        <div className="max-w-[1200px] mx-auto h-[58px] flex items-center justify-between gap-6">
          <a href="/" aria-label="PickFood 홈" className="flex-shrink-0">
            <img src={logo} alt="PickFood" className="h-10 w-auto" />
          </a>
          <SearchBar
            value={search.query}
            onChange={search.onChange}
            onKeyDown={search.onKeyDown}
            onSearch={search.onSearch}
          />
          <UserActions
            onLogin={onLogin}
            onSignup={onSignup}
            onSupport={onSupport}
          />
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full h-px bg-gray-200" />

      {/* Row 2: 알레르기·질병 필터 */}
      <div className="bg-surface px-4">
        <div className="max-w-[1200px] mx-auto h-10 flex items-center">
          <FilterBar isActive={filter.isActive} onToggle={filter.toggle} />
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full h-px bg-gray-200" />

      {/* Row 3: 카테고리 탭 */}
      <div className="bg-white px-4">
        <div className="max-w-[1200px] mx-auto">
          <NavBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

    </header>
  );
}