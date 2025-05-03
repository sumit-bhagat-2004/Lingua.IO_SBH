import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600">Lingua.IO</div>

      {/* Nav Tabs */}
      <div className="space-x-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-blue-600">
          Explore
        </Link>
        <Link to="/practices" className="hover:text-blue-600">
          Practices
        </Link>
        <Link to="/grammar" className="hover:text-blue-600">
          Grammar
        </Link>
        <Link to="/pronounciation" className="hover:text-blue-600">
          Pronounciation
        </Link>
        <Link to="/settings" className="hover:text-blue-600">
          Settings
        </Link>
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
