import Image from "next/image";

function Logo() {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-red-600 font-bold text-3xl font-michroma">
        RED OCEAN
      </div>
      <div className="relative">
        <Image
          src="/shark-fin.svg"
          alt="Shark Fin Logo"
          width={40}
          height={40}
          className="text-red-600"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)",
          }}
        />
      </div>
    </div>
  );
}

export default Logo;
