import { TopBar } from './shared/Topbar'
import { Footer } from './shared/Footer'
import MainPage from './features/main/components/MainPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1">
        <MainPage />
      </main>
      <Footer />
    </div>
  )
}

export default App