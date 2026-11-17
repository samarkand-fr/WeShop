import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Navbar from './components/nav/navbar'
import Footer from './components/footer/Footer'
import CartProvider from '@/providers/CartProvider'
import { Toaster } from 'react-hot-toast'

// The shared navigation reads the authenticated user from request headers.
// Render this app per request instead of trying to statically prerender it.
export const dynamic = 'force-dynamic'

// use font poppins
const poppins = Poppins({ subsets: ['latin'],weight:['400','700'] })

export const metadata: Metadata = {
  title: 'WeShop',
  description: 'Ecommerce app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  
  return (
    <html lang="en">
      <body className={`${poppins.className} text-slate-700`}>
       <Toaster  toastOptions={{
            style:{
              background: "rgb(51 65 80)",
              color :"#fff"
            }}
       }/>
       <CartProvider>
       <div className='flex flex-col min-h-screen'>
          <Navbar />
            <main className='flex-grow'>{children}</main>
            <Footer />
        </div>
       </CartProvider>
        </body>
    </html>
  )
}
