const Header = ({ title }) => {
  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
      <span className="font-semibold truncate">{title}</span>
    </div>
  );
};

export default Header;