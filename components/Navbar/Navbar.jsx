"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Container from "@mui/material/Container";
import cls from "./navbar.module.scss";
import Image from "next/image";
import NavbarMenu from "./navbar-menu";
import Link from "next/link";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const handleClose = (route) => {
    setAnchorEl(null);
    if (route) {
      router.push(route);
    }
  };
  return (
    <div className={cls.navbar}>
      <Container maxWidth="xl" className={cls.wrapper}>
        <Link href="/" >
          <Image src="/imgs/logo.png" alt="logoImage" width={140} height={60} />
        </Link>

        <div className={cls.optionsWrapper}>
          <span className={cls.back} onClick={() => router.back()}>
            <Icon icon="ic:round-settings-backup-restore" width="20px" height="20px" />
          </span>
          <div className={cls.options}>
            <button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              className={cls.userNav}
            >
              <Image src={"/imgs/default.jpg"} alt="user photo" width={120} height={120} />
              <Icon icon="solar:hamburger-menu-line-duotone" width="30px" height="30px" />
            </button>
            <NavbarMenu anchorEl={anchorEl} open={open} handleClose={handleClose} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
