"use client";

import { useCallback, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import Avatar from "../Avatar";
import Link from "next/link";
import MenuItem from "./MenuItem";
import { signOut } from "next-auth/react";
import BackDrop from "./BackDrop";
import { SafeUser } from "@/types";

interface UserMenuProps {
  currentUser: SafeUser | null | undefined;
}
// const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const toggleOpen = useCallback(() => {
//     setIsOpen((prev) => !prev);
//   }, []);

//   return (
//     <>
//       <div className="relative z-30">
//         <div
//           onClick={toggleOpen}
//           className="p-2 border-[1px] border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700"
//         >
//           <Avatar src={currentUser?.image} />
//           <AiFillCaretDown />
//         </div>
//         {/* render conditionally */}
//         {isOpen && (
//           <div className="absolute rounded-md w-[170px] bg-white overflow-hidden top-12 right-0 text-sm flex flex-col  cursor-pointer">
//             {currentUser ? (
//               <div>
//                 <Link href="/orders">
//                   <MenuItem onClick={toggleOpen}>Your Orders</MenuItem>
//                 </Link>
//                 <Link href="/admin">
//                   <MenuItem onClick={toggleOpen}>Admin Dashboard</MenuItem>
//                 </Link>
//                 <MenuItem
//                   onClick={() => {
//                     toggleOpen();
//                     signOut();
//                   }}
//                 >
//                   Log Out
//                 </MenuItem>
//               </div>
//             ) : (
//               <div>
//                 <Link href="/login">
//                   <MenuItem onClick={toggleOpen}>Login</MenuItem>
//                 </Link>
//                 <Link href="/register">
//                   <MenuItem onClick={toggleOpen}>Register</MenuItem>
//                 </Link>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       {isOpen ? <BackDrop onClick={toggleOpen} /> : null}
//     </>
//   );
// };

// export default UserMenu;
// ... (other imports)



// ... (other imports)

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      <div className="relative z-30">
        <div
          onClick={toggleOpen}
          className="p-2 border-[1px] border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700"
        >
          <div style={{ color: currentUser?.role === 'ADMIN' ? 'blue' : (currentUser ? 'green' : 'slate') }}>
            <Avatar src={currentUser?.image} />
          </div>
          <div className="text-sm mt-1 mx-2 text-pink-600">{currentUser?.name}</div>
          <AiFillCaretDown />
        </div>
        {/* render conditionally */}
        {isOpen && (
          <div className="absolute rounded-md w-[170px] bg-white overflow-hidden top-12 right-0 text-sm flex flex-col cursor-pointer">
            {currentUser ? (
              <div>
                <Link href="/orders">
                  <MenuItem onClick={toggleOpen}>Your Orders</MenuItem>
                </Link>
                {currentUser.role === 'ADMIN' && (
                  <Link href="/admin">
                    <MenuItem onClick={toggleOpen}>Admin Dashboard</MenuItem>
                  </Link>
                )}
                <MenuItem
                  onClick={() => {
                    toggleOpen();
                    signOut();
                  }}
                >
                  Log Out
                </MenuItem>
              </div>
            ) : (
              <div>
                <Link href="/login">
                  <MenuItem onClick={toggleOpen}>Login</MenuItem>
                </Link>
                <Link href="/register">
                  <MenuItem onClick={toggleOpen}>Register</MenuItem>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      {isOpen ? <BackDrop onClick={toggleOpen} /> : null}
    </>
  );
};

export default UserMenu;

