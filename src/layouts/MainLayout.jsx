import useLenis from '../hooks/useLenis'

export default function MainLayout({ children }) {
  useLenis()
  return (
     <div className="mx-auto flex min-h-svh max-w-[800px] flex-col bg-white px-4 pt-0 pb-32 sm:px-6 sm:pt-0 sm:pb-36 md:px-8">
      {children}
    </div>
  )
}
