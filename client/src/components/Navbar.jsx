import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

// src/Navbar.jsx
function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600">Lingua.IO</div>

      {/* Nav Tabs */}
      <div className="space-x-6 text-gray-700 font-medium">
        <a href="#" className="hover:text-blue-600">
          Explore
        </a>
        <a href="#" className="hover:text-blue-600">
          Practices
        </a>
        <a href="#" className="hover:text-blue-600">
          Grammar
        </a>
        <a href="#" className="hover:text-blue-600">
          Settings
        </a>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;
