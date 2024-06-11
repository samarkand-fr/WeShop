import Link from "next/link";
import Container from "../Container";
import { Redressed } from "next/font/google";
import CartCount from "./CartCount";
import UserMenu from "./UserMenu";
import getCurrentUser from "@/actions/getCurrentUser";
import Categories from "./Categories";
import SearchBar from "./SearchBar";

// font for logo
const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const Navbar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="sticky top-0 w-full bg-gray-200 z-30 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md-gap-0">
            <Link
              href="./"
              className={`${redressed.className} text-4xl font-bold text-pink-400`}
            >
              {" "}
              WeShop
            </Link>
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <div className="flex items-center gap-8 md-gap-12">
              <div>
                <CartCount />
              </div>
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
