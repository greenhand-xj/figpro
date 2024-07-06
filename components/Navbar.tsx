import { ActiveElement, NavbarProps } from "@/types/type";
import Image from "next/image";
import ActiveUsers from "./users/ActiveUsers";
import { memo } from "react";
import { navElements } from "@/constants";

const Navbar = ({ activeElement }: NavbarProps) => {
  return (
    <nav className="flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white">
      <Image src="/assets/logo.svg" alt="material logo" width={58} height={20} />
      {/* <ul className="flex flex-row">
        {navElements.map((item: ActiveElement | any) => (
          <li key={item.name}>
            {Array.isArray(item.value) ? (
              <ShapeMenu />
            ) : item.value === 'comments' ? (
              <NewThread>

              </NewThread>
            ) : (
              <button></button>
            )}
          </li>
        ))}
      </ul> */}
      <ActiveUsers />
    </nav>
  )
}

export default memo(Navbar, (prev, next) => prev.activeElement === next.activeElement)