import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 md:px-0">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Donate</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition">
                Categories
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Crisis Relief
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Social Funds
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Supporter Space
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Fundraise</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition">
                How To
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Fundraising
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Team
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Charity
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Sign Up
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-white">About</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Charity
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Sign Up
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Newsroom
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Careers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Help Center</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
            </li>
          </ul>
          <div className="flex space-x-4 mt-6">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-white transition"
            >
              <Facebook size={24} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-white transition"
            >
              <Twitter size={24} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-white transition"
            >
              <Instagram size={24} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-white transition"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 py-6 text-center text-sm text-gray-500">
        @MakeByManhCuong {new Date().getFullYear()} Charity Platform. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
