import Logo from "./Logo";

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <Logo />
      </div>
    </header>
  );
}

export default Header;
