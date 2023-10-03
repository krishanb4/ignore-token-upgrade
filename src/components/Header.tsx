import Image from "next/image";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <>
      <header className="lg:border-transparent text-black dark:text-white bg-transparent sticky flex items-center top-0 z-[1] transition-all h-[56px]">
        <div className="mx-auto flex items-center max-w-full w-full h-[56px]">
          <div className="grid grid-cols-2 items-center w-full mx-auto z-[101] px-4">
            <div className="flex items-center sm:gap-1">
              <Link
                className="flex flex-row items-center sm:pl-2 sm:pr-6"
                href="/"
              >
                <div className="block md:hidden w-7 h-7 sm:w-[115px] sm:h-[37px]">
                  <Image
                    src="/images/4logo.png"
                    alt=""
                    width={800}
                    height={800}
                  />
                </div>
                <div className="hidden md:block w-7 h-7 sm:w-[115px] sm:h-[37px]">
                  <Image
                    src="/images/logo_name.png"
                    alt=""
                    width={800}
                    height={800}
                  />
                </div>
              </Link>
            </div>
            <div className="flex items-center justify-end">
              <div className="flex transform scale-100 opacity-100">
                <div
                  data-headlessui-state=""
                  className="sm:w-auto md:w-auto"
                ></div>
                <div data-headlessui-state="">
                  <w3m-button />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
