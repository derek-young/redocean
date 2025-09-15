import Image from "next/image";

function Logo() {
  return (
    <Image
      src="/shark-fin.svg"
      alt="Shark Fin Logo"
      width={36}
      height={36}
      style={{
        filter:
          "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)",
      }}
    />
  );
}

export default Logo;
