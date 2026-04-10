import { TopBar } from './shared/Topbar'
import { Footer } from './shared/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1">
        {/* 여기에 페이지 라우팅 */}
      </main>
      <Footer />
    </div>
  )
}

export default App