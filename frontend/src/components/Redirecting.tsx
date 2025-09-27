import Logo from "./Logo";
import RedOcean from "./RedOcean";

function Redirecting({ message = "Redirecting..." }: { message: string }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <Logo />
          <RedOcean />
        </div>
        <div className="text-muted-foreground text-lg">{message}</div>
      </div>
    </div>
  );
}

export default Redirecting;
