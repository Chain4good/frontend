"use client";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState, useEffect } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const Header = () => {
  const t = useTranslations("Header");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNaivigation = (path) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      window.location.href = path;
    }, 500);
  };

  return (
    <header
      className={` z-50 h-20 py-4 items-center fixed top-0 left-0 right-0 transition-all duration-300 
        ${
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-md"
            : "bg-transparent"
        }`}
    >
      <div className="flex items-center container">
        <div className="flex-1 flex gap-2">
          <Button
            variant="nav"
            className="flex gap-1"
            onClick={() => handleNaivigation("/search")}
          >
            <Search />
            <span>{t("search")}</span>
          </Button>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent rounded-full">
                  <span>{t("donate.title")}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-fit">
                  <div className="p-3 md:w-[600px] w-fit flex flex-col">
                    <div className="flex gap-2 items-center font-semibold">
                      <img
                        className="size-10"
                        src="/images/heart.png"
                        alt="heart"
                      />
                      <h2 className="text-nowrap text-lg">
                        {t("donate.children.title")}
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <NavLink
                        href={"/category"}
                        title={t("donate.children.children.category.title")}
                        sub={t("donate.children.children.category.sub")}
                      />
                      <NavLink
                        href={"/category"}
                        title={t(
                          "donate.children.children.supporterSpace.title"
                        )}
                        sub={t("donate.children.children.crisisRelief.sub")}
                      />
                      <NavLink
                        href={"/category"}
                        title={t("donate.children.children.social.title")}
                        sub={t("donate.children.children.social.sub")}
                      />
                      <NavLink
                        href={"/category"}
                        title={t(
                          "donate.children.children.supporterSpace.title"
                        )}
                        sub={t("donate.children.children.supporterSpace.sub")}
                      />
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent rounded-full">
                    <span>{t("fundraise.title")}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-fit">
                    <div className="p-3 md:w-[600px] w-fit flex flex-col">
                      <div className="flex gap-2 items-center font-semibold">
                        <img
                          className="size-10"
                          src="/images/heart.png"
                          alt="heart"
                        />
                        <h2 className="text-nowrap text-lg">
                          {t("fundraise.children.title")}
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <NavLink
                          href={"/category"}
                          title={t("fundraise.children.children.howTo.title")}
                          sub={t("fundraise.children.children.howTo.sub")}
                        />
                        <NavLink
                          href={"/category"}
                          title={t(
                            "fundraise.children.children.categories.title"
                          )}
                          sub={t("fundraise.children.children.categories.sub")}
                        />
                        <NavLink
                          href={"/category"}
                          title={t("fundraise.children.children.team.title")}
                          sub={t("fundraise.children.children.team.sub")}
                        />
                        <NavLink
                          href={"/category"}
                          title={t("fundraise.children.children.blog.title")}
                          sub={t("fundraise.children.children.blog.sub")}
                        />
                        <NavLink
                          href={"/category"}
                          title={t("fundraise.children.children.tips.title")}
                          sub={t("fundraise.children.children.tips.sub")}
                        />
                        <NavLink
                          href={"/category"}
                          title={t("fundraise.children.children.ideas.title")}
                          sub={t("fundraise.children.children.ideas.sub")}
                        />
                        <NavLink
                          href={"/category"}
                          title={t("fundraise.children.children.charity.title")}
                          sub={t("fundraise.children.children.charity.sub")}
                        />
                        <NavLink
                          href={"/category"}
                          title={t("fundraise.children.children.claim.title")}
                          sub={t("fundraise.children.children.claim.sub")}
                        />
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div>
          <Link href="/">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={120}
              height={0}
              className="object-center overflow-hidden"
            />
          </Link>
        </div>
        <div className="flex-1 flex gap-2 items-center justify-end">
          <Button variant="nav" className="flex gap-1">
            <span>{t("about")}</span>
          </Button>
          <Button variant="nav" className="flex gap-1">
            <span>{t("signIn")}</span>
          </Button>
          <Button className="font-semibold rounded-full">
            <span>{t("startCampaign")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

const NavLink = ({ href, title, sub }) => {
  return (
    <NavigationMenuLink
      href={href}
      className="cursor-pointer hover:bg-primary/10 rounded-md p-2 flex flex-col "
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground text-xs">{sub}</p>
    </NavigationMenuLink>
  );
};
