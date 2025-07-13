import Footer from "@/components/Footer/Footer";
import { Outlet } from "react-router-dom";
import Brand from "../components/Brand";
import Header from "../components/Header";
import Auth from "./Auth";

export default function MainLayout() {
  return (
    <>
      <Header />
      <div className=" mx-auto py-20">
        <Outlet />
      </div>
      <Brand />
      <Footer />
      {/* <Separator className="mt-10" /> */}
      {/* <div className="py-10 container">
        <span className="font-bold ">@MakeByManhCuong</span>
      </div> */}
      <Auth />
    </>
  );
}
