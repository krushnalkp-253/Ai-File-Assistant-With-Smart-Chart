// src/components/Footer.tsx

import { Star, Phone, LayoutGrid, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 sm:pt-12 lg:px-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center space-x-2">
              <LayoutGrid className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold">SmartFile AI</span>
            </a>
            <p className="mt-4 text-gray-400">
              Revolutionizing file management with AI-powered organization and
              smart chart generation.
            </p>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Features</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">API</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Community</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">
              Connect
            </h3>
            <div className="flex mt-4 space-x-4">
              <a href="https://www.instagram.com/shivam_deore_07?igsh=MTVka3BsY3Vxb2pqcg%3D%3D&utm_source=qr" className="text-gray-400 hover:text-white"><Github className="w-6 h-6" /></a>
              <a href="https://www.instagram.com/shivam_deore_07?igsh=MTVka3BsY3Vxb2pqcg%3D%3D&utm_source=qr" className="text-gray-400 hover:text-white"><Linkedin className="w-6 h-6" /></a>
              <a href="https://www.instagram.com/shivam_deore_07?igsh=MTVka3BsY3Vxb2pqcg%3D%3D&utm_source=qr" className="text-gray-400 hover:text-white"><Twitter className="w-6 h-6" /></a>
            </div>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="pt-8 mt-12 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} SmartFile AI. All rights reserved.
            </p>
            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
              Developed by Shubham Deore, Krushnal Patil, Bhupesh Patil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;