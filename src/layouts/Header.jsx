import {
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useContext } from "react";
import { ColorModeContext } from "../assets/theme";
import {
  DarkModeOutlined,
  LightModeOutlined,
  LogoutOutlined,
  MenuOpen,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router";
import logo from "../assets/images/logo.png";
import { logout, setOpenSidebar, useJawadAuthController } from "../context";

const Header = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [controller, dispatch] = useJawadAuthController();
  const { pathname } = useLocation();
  const isInAuthPage = pathname.includes("auth");
  const isInMedScreen = useMediaQuery("(max-width:767px)");
  const navigate = useNavigate();

  const logoutUser = () => {
    logout(dispatch, null);
    navigate("/auth/signin");
  };

  return (
    <Box
      sx={{
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: 'space-between',
        borderRadius: "12px",
        padding: isInAuthPage ? "0 30px" : "0 6px",
        marginTop: "8px",
        marginBottom: "15px",
      }}
    >
        <Box>
          <img style={{ width: "130px" }} src={logo} alt="logo" />
        </Box>
      

      <Box>
        <IconButton
          onClick={() => {
            setOpenSidebar(dispatch , !controller.openSidebar)
          }}
        >
          <MenuOpen />
        </IconButton>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined color="secondary" />
          )}
        </IconButton>
        <Button color="error" onClick={logoutUser}>
          logout
          <LogoutOutlined />
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
