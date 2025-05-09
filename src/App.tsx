import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Converter from '@/components/blocks/Conterter'

const App = () => {
  return (
    <>
      <Header />
      <main className='py-4' >
        <div className="container">
          <Converter />
        </div>

      </main>
      <Footer />
    </>
  )
}

export default App