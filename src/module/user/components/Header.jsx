import { Button } from "@/components/ui/button";
import {
  HeartHandshake,
  LogIn,
  Menu,
  MenuIcon,
  Search,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useUserStore from "@/hooks/useUserStore";
import { LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import MetaMaskAccount from "./MetaMaskAccount";
import NotificationList from "@/components/NotificationList";
import { useWallet } from "@/hooks/useWallet";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { address, isConnected, connect, disconnect } = useWallet();

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
  const { user } = useUserStore();

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 flex flex-col justify-between">
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* <MetaMaskAccount /> */}
            </div>
            <Button
              className="w-full justify-start font-semibold"
              variant={""}
              onClick={() => handleNaivigation("/create/fundraiser/category")}
            >
              <span>Tạo chiến dịch</span>
            </Button>
          </div>

          <div className="border-t pt-4">
            <Link to="/search" className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              <span>Tìm kiếm</span>
            </Link>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Quyên góp</h3>
              <div className="grid gap-2 pl-2">
                <Link to="/discover">Danh mục</Link>
                <Link to="/post/khi-lng-tt-c-ghi-du-vnh-vin-trn-blockchain">
                  Hỗ trợ khẩn cấp
                </Link>
                <Link to="/post/khi-lng-tt-c-ghi-du-vnh-vin-trn-blockchain">
                  Quỹ tác động xã hội
                </Link>
                <Link to="/post/khi-lng-tt-c-ghi-du-vnh-vin-trn-blockchain">
                  Không gian ủng hộ
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gây quỹ</h3>
              <div className="grid gap-2 pl-2">
                <Link to="/post/khi-lng-tt-c-ghi-du-vnh-vin-trn-blockchain">
                  Cách bắt đầu
                </Link>
                <Link to="/post/khi-lng-tt-c-ghi-du-vnh-vin-trn-blockchain">
                  Danh mục gây quỹ
                </Link>
                <Link to="/post/khi-lng-tt-c-ghi-du-vnh-vin-trn-blockchain">
                  Gây quỹ theo nhóm
                </Link>
                <Link to="/post/khi-lng-tt-c-ghi-du-vnh-vin-trn-blockchain">
                  Blog về gây quỹ
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          {!user && (
            <Button
              variant="outline"
              className="flex gap-1 w-full justify-start"
              onClick={() => handleNaivigation("/sign-in")}
            >
              <LogIn />
              <span>Đăng nhập</span>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header
      className={`z-50 h-20 py-4 items-center fixed top-0 left-0 right-0 transition-all duration-300 
        ${
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-md"
            : "bg-transparent"
        }`}
    >
      <div className="flex items-center container mx-auto px-4">
        <div className="flex-1 flex gap-2 items-center">
          <MobileNav />
          <div className="hidden md:flex gap-2">
            <Button
              variant="nav"
              className="flex gap-1"
              onClick={() => handleNaivigation("/search")}
            >
              <Search />
              <span>Tìm kiếm</span>
            </Button>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent rounded-full">
                    <span>Quyên góp</span>
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
                          Khám phá các chiến dịch gây quỹ để ủng hộ
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <NavLink
                          href={"/discover"}
                          title={"Danh mục"}
                          sub={"Duyệt các chiến dịch theo danh mục"}
                        />
                        <NavLink
                          href={"/nfts"}
                          title={"NFTs"}
                          sub={"Bảng xếp hạng NFT"}
                        />
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent rounded-full">
                    <span>{"Gây quỹ"}</span>
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
                          {"Bắt đầu gây quỹ, mẹo và tài nguyên"}
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <NavLink
                          href={
                            "/post/khi-lng-tt-c-ghi-du-vnh-vin-trn-blockchain"
                          }
                          title={"Cách bắt đầu một chiến dịch Chain4Good"}
                          sub={
                            "Hướng dẫn từng bước, ví dụ minh họa và hơn thế nữa"
                          }
                        />
                        <NavLink
                          href={
                            "/post/khi-lng-tt-c-ghi-du-vnh-vin-trn-blockchain"
                          }
                          title={"Danh mục gây quỹ"}
                          sub={"Tìm danh mục phù hợp với bạn"}
                        />
                        <NavLink
                          href={
                            "/post/khi-lng-tt-c-ghi-du-vnh-vin-trn-blockchain"
                          }
                          title={"Gây quỹ theo nhóm"}
                          sub={"Gây quỹ cùng với một nhóm"}
                        />
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div>
          <Link to="/">
            <img
              src={"/logo.png"}
              alt="logo"
              className="object-center overflow-hidden w-[100px] md:w-[120px]"
            />
          </Link>
        </div>

        <div className="flex-1 hidden md:flex items-center justify-end gap-3">
          <Button
            className="font-medium text-sm bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-white shadow-sm transition-all duration-300"
            size="sm"
            onClick={() => handleNaivigation("/create/fundraiser/category")}
          >
            Bắt đầu chiến dịch
          </Button>

          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
            {isConnected ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={disconnect}
                className="text-xs font-medium hover:bg-gray-100"
              >
                <Wallet className="w-3.5 h-3.5 mr-1.5 text-primary" />
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={connect}
                className="text-xs font-medium hover:bg-gray-100"
              >
                <Wallet className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Kết nối ví
              </Button>
            )}

            {!user && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium hover:bg-gray-100"
                onClick={() => handleNaivigation("/sign-in")}
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                Đăng nhập
              </Button>
            )}

            <NotificationList />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="flex items-center gap-2 hover:bg-gray-100 py-1 px-2 rounded-full transition-colors">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={user.image || "https://github.com/shadcn.png"}
                        alt="@shadcn"
                      />
                      <AvatarFallback>CG</AvatarFallback>
                    </Avatar>
                    <MenuIcon size={16} className="text-gray-600" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleNaivigation("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleNaivigation("/my-campaigns")}
                  >
                    <HeartHandshake className="mr-2 h-4 w-4" />
                    <span>Chiến dịch của tôi</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleNaivigation("/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => {
                      const userStore = useUserStore.getState();
                      userStore.logout();
                      handleNaivigation("/logout");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, title, sub }) => {
  return (
    <NavigationMenuLink
      href={href}
      className="cursor-pointer hover:bg-primary/10 rounded-md p-2 flex flex-col"
    >
      <h3 className="font-semibold text-sm md:text-base">{title}</h3>
      <p className="text-muted-foreground text-xs hidden md:block">{sub}</p>
    </NavigationMenuLink>
  );
};

export default Header;
