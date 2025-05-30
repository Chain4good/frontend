import { Outlet, Link } from "react-router-dom";
import Footer from "@/components/Footer/Footer";
import Header from "../components/Header";
import Auth from "./Auth";
import { Separator } from "@/components/ui/separator";
import Brand from "../components/Brand";

export default function MainLayout() {
  return (
    <>
      <Header />
      <div className=" mx-auto py-20">
        <Outlet />
      </div>
      <Brand />
      <Footer />
      <Separator className="mt-10" />
      <div className="py-10 container">
        <span className="font-bold ">@MakeByManhCuong</span>
      </div>
      <Auth />
    </>
  );
}
