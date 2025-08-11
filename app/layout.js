import '../styles/globals.css'

export const metadata = {
  title: 'CycleSync App',
  description: 'A women\'s health cycle tracking application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}