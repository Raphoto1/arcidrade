import React from "react";
import Image from "next/image";
import Link from "next/link";

function NavBar() {
  return (
    <nav className='navbar bg-base-100 shadow-sm'>
      <div className="navbar-start hidden lg:flex">
        <div className='flex-1 pl-5'>
          <Image src='/logos/Logo Arcidrade Full.png' alt='Arcidrade Consulting' width={150} height={150} />
        </div>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1 font-oswald font-bold text-base'>
          <li>
            <a >Acerca de nosotros</a>
          </li>
          <li>
            <details>
              <summary>Ofertas</summary>
              <ul className='p-2'>
                <li>
                  <a>Instituciones</a>
                </li>
                <li>
                  <a>Profesionales</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link href={"/services"}>Servicios</Link>
          </li>
        </ul>
      </div>
      <div className='navbar-end gap-3 pr-5 hidden lg:flex font-oswald'>
        <a className='btn'>Ingresar</a>
        <a className='btn'>Registrarse</a>
      </div>
      <div className='menuMobile flex-1 navbar-end lg:hidden'>
        <div className='flex-1 pl-5 lg:hidden navbar-start'>
          <Image src='/logos/Logo Arcidrade Cond.png' alt='Arcidrade Consulting' width={50} height={50} />
        </div>
        <div className='dropdown dropdown-center'>
          <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-10 w-10' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              {" "}
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h8m-8 6h16' />{" "}
            </svg>
          </div>
          <ul tabIndex={0} className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'>
            <li>
              <a>Acerca de nosotros</a>
            </li>
            <li>
              <a>Ofertas</a>
              <ul className='p-2'>
                <li>
                  <a>Instituciones</a>
                </li>
                <li>
                  <a>Profesionales</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Servicios</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
