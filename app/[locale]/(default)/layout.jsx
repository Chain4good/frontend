// [locale]/(default)/layout.jsx
import Header from "../_components/header/header";
import Footer from "@/components/common/footer/footer";

export default function DefaultLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
