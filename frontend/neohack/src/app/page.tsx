"use client";

import {
  Building,
  ChevronRight,
  CreditCard,
  Menu,
  PiggyBank,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      {isMenuOpen && (
        <nav className="md:hidden bg-blue-800 p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="#lending"
                className="block hover:text-blue-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Lending
              </a>
            </li>
            <li>
              <a
                href="#savings"
                className="block hover:text-blue-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Savings
              </a>
            </li>
            <li>
              <a
                href="#future"
                className="block hover:text-blue-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Future Features
              </a>
            </li>
          </ul>
        </nav>
      )}

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to the Future of Banking
          </h2>
          <p className="text-xl md:text-2xl mb-8">
            Decentralized finance solutions for the modern world
          </p>
          <a
            href="#"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center"
          >
            Get Started <ChevronRight className="ml-2" />
          </a>
        </section>

        <section id="lending" className="mb-20">
          <h3 className="text-3xl font-bold mb-6">Lending</h3>
          <div className="bg-white/10 p-6 rounded-lg">
            <Building className="w-12 h-12 mb-4 text-blue-300" />
            <h4 className="text-xl font-semibold mb-2">
              Real Estate Project Funding
            </h4>
            <p>
              Users can deposit funds into our liquidity pool, enabling
              institutions to borrow for real estate development projects. Earn
              passive income while supporting infrastructure growth.
            </p>
          </div>
        </section>

        <section id="savings" className="mb-20">
          <h3 className="text-3xl font-bold mb-6">High Yield Savings</h3>
          <div className="bg-white/10 p-6 rounded-lg">
            <PiggyBank className="w-12 h-12 mb-4 text-green-300" />
            <h4 className="text-xl font-semibold mb-2">Stake on Ethena</h4>
            <p>
              Maximize your savings with our high-yield account. Stake your
              assets on Ethena and earn substantial rewards, outperforming
              traditional savings accounts.
            </p>
          </div>
        </section>

        <section id="future" className="mb-20">
          <h3 className="text-3xl font-bold mb-6">Future Features</h3>
          <div className="bg-white/10 p-6 rounded-lg">
            <CreditCard className="w-12 h-12 mb-4 text-purple-300" />
            <h4 className="text-xl font-semibold mb-2">
              Crypto Repayable Credit Card
            </h4>
            <p>
              Coming soon: A revolutionary credit card that can be repaid with
              cryptocurrency. Plus, users will be able to borrow directly from
              our liquidity pools.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-blue-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 DeFi NeoBank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
