import React, { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Logout } from "@mui/icons-material";
import theme from "../theme";
import { logout } from "../authApi";
import { useUser } from "../ContextProvider";
import { useRouter } from "next/navigation";

const Header = () => {
  const { setUser, user } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout(setUser);
  };

  return (
    <header className="w-full h-[5rem] bg-bg-gradient flex justify-between items-center px-[5rem]">
      <Box className="flex items-center space-x-4">
        <Image src="/logo.png" alt="App Logo" width={40} height={40} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.common.white,
            fontSize: "30px",
          }}
        >
          Ekagra
        </Typography>
      </Box>

      <Box className="flex items-center space-x-4">
        <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar
            alt="User Avatar"
            src="/path/to/user-avatar.jpg"
            className="w-[50px] h-[50px] bg-orange-500"
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              width: "150px",
              borderRadius: "8px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuItem onClick={handleLogout} sx={{ color: "black" }}>
            {user?.firstName} {user?.lastName}
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "black" }}>
            <Logout sx={{ marginRight: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Box>
    </header>
  );
};

export default Header;
