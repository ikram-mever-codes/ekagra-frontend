import React from "react";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="w-full bg-[#374D68] p-6 text-white">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-center text-sm">
          <p>&copy; 2024 Ekagra. All rights reserved.</p>
        </div>

        <div className="flex space-x-8">
          <Link
            href="/admission-form"
            className="text-white hover:underline text-sm"
          >
            Enroll into Course
          </Link>
          <Link
            href="/admission-form"
            className="text-white hover:underline text-sm"
          >
            Admissions
          </Link>
          <Link
            href="/admission-form"
            className="text-white hover:underline text-sm"
          >
            Privacy Policy{" "}
          </Link>
          <Link
            href="/admission-form"
            className="text-white hover:underline text-sm"
          >
            Coupons
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
