"use client";

import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/app/client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                EthBank
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/savings">Savings</NavLink>
              <NavLink href="/funding">Lending</NavLink>
              <NavLink href="/borrow">Borrow</NavLink>
            </div>
          </div>
          <div className="pt-2 pb-3 border-t border-gray-200"></div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="mr-10 pt-2 pb-3 border-t border-gray-200">
              <ConnectButton
                connectButton={{
                  label: "Connect",
                  className: "bg-red-400",
                  style: {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
                client={client}
                appMetadata={{
                  name: "NeoHack",
                  url: "https://neohack.vercel.com",
                }}
              />
            </div>
            <UserMenu />
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink href="/savings">Savings</MobileNavLink>
            <MobileNavLink href="/funding">Lending</MobileNavLink>
            <MobileNavLink href="/borrow">Borrow</MobileNavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <ConnectButton
              connectButton={{
                label: "Connect",
                className: "bg-red-400",
                style: {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
              client={client}
              appMetadata={{
                name: "NeoHack",
                url: "https://neohack.vercel.com",
              }}
            />
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 rounded-full bg-gray-300 p-2" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  John Doe
                </div>
                <div className="text-sm font-medium text-gray-500">
                  john@example.com
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <MobileNavLink href="/profile">Your Profile</MobileNavLink>
              <MobileNavLink href="/settings">Settings</MobileNavLink>
              <MobileNavLink href="/sign-out">Sign out</MobileNavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
    >
      {children}
    </Link>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <User className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              john@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile">Your Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/sign-out">Sign out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
