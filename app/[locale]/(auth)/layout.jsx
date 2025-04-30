export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        backgroundImage: "url('/auth-bg.jpg')",
      }}
      className="bg-cover bg-center h-screen flex items-center justify-center"
    >
      {children}
    </div>
  );
}
