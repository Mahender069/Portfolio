import useLenis from '../hooks/useLenis'

export default function MainLayout({ children }) {
  useLenis()
  return (
     <div className="mx-auto flex min-h-svh max-w-[800px] flex-col bg-white px-4 pt-16 pb-12 sm:px-6 sm:pt-20 sm:pb-16 md:px-8">
      {children}
    </div>
  )
}
