"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useCreateStep from "@/hooks/use-create-step";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Layout = ({ children }) => {
  const { t } = useTranslations();
  const { steps, nextStep, prevStep, setStep, currentStep } = useCreateStep();
  console.log(steps, currentStep);

  return (
    <div className="bg-[#F4F2EC] grid grid-cols-3 w-screen h-screen">
      <div className="col-span-1 p-10 flex flex-col">
        <div>
          <Image src={"/logo.svg"} className="" width={40} height={40} />
        </div>
        <div className="flex-1 flex items-center justify-center flex-col ">
          <div>
            <h2 className="text-left text-4xl mb-4 leading-9">
              {steps[currentStep].title}
            </h2>
            <p className="text-left">{steps[currentStep].description}</p>
          </div>
        </div>
      </div>
      <div className="col-span-2 flex rounded-l-[64px] bg-white  h-full flex-col items-center justify-center">
        <main className="flex-1 w-full flex items-center justify-center">
          {children}
        </main>
        <Separator />
        <div className="h-32 flex px-10 w-full justify-between items-center">
          {currentStep > 0 && steps[currentStep - 1] && (
            <Link href={`${steps[currentStep - 1].slug}`}>
              <Button
                variant={"outline"}
                size="lg"
                className="text-md"
                onClick={prevStep}
              >
                <ChevronLeft />
                Quay lại
              </Button>
            </Link>
          )}
          {currentStep < steps.length - 1 && steps[currentStep + 1] && (
            <Link href={`${steps[currentStep + 1].slug}`}>
              <Button size="lg" className="text-md" onClick={nextStep}>
                Tiếp tục
                <ChevronRight />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
