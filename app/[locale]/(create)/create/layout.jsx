import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="bg-[#F4F2EC] grid grid-cols-3 w-screen h-screen">
      <div className="col-span-1 p-10 flex flex-col">
        <div>
          <Image src={'/logo.svg'} className="" width={40} height={40} />
        </div>
        <div className="flex-1 flex items-center justify-center flex-col ">
          <div>
            <h2 className="text-left text-4xl mb-4 leading-9">Hãy bắt đầu hành trình gây quỹ của bạn</h2>
            <p className="text-left">Chúng tôi ở đây để hướng dẫn bạn từng bước trên đường đi.</p>
          </div>
        </div>
      </div>
      <div className="col-span-2 flex rounded-l-[64px] bg-white  h-full flex-col items-center justify-center">
        <main className="flex-1 w-full flex items-center justify-center">
          {children}
        </main>
        <Separator />
        <div className="h-32 flex px-10 w-full justify-between items-center">
          <Button variant={"outline"} size="lg" className="text-md"><ChevronLeft /> Quay lại</Button>
          <Button size="lg" className="text-md">Tiếp tục
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
