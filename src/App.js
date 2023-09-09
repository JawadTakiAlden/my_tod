import React from "react";
import "./App.css";
import { ColorModeContext, useMode } from "./assets/theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes, useLocation } from "react-router";
import Dashboard from "./pages/Dashboard";
import Header from "./layouts/Header";
import DashboardSidebar from "./layouts/DashboardSidebar";
import Parents from "./pages/Parents";
import CreateNewParent from "./pages/CreateNewParent";
import ShowParentInformation from "./pages/ShowParentInformation";
import FAQs from "./pages/FAQs";
import Signin from "./pages/Signin";
import Events from "./pages/Events";
import Event from "./pages/Event";
import Status from "./layouts/Status";
import StatusInfo from "./pages/StatusInfo";
import Techers from "./pages/Techers";
import Classes from "./pages/Classes";
import Courses from "./layouts/Courses";
import TeacherInformation from "./pages/TeacherInformation";
import ClassInformation from "./pages/ClassInformation";
import PublicImages from "./pages/PublicImages";
import CourseInforamtion from "./pages/CourseInforamtion";
import StuffInformation from "./pages/StuffInformation";

const App = () => {
  const [theme, colorMode] = useMode();
  const { pathname } = useLocation();
  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              gap: "5px",
            }}
          >
            {pathname.includes("auth") ? undefined : <DashboardSidebar />}

            <Box
              sx={{
                flexBasis: "100%",
              }}
            >
              <Box
                sx={{
                  maxWidth: "calc(100% - 10px)",
                  transform: "translateX(5px)",
                }}
              >
                <Header />
                <Routes>
                  <Route path={"/dashboard"} element={<Dashboard />} />
                  <Route path={"/parents"} element={<Parents />} />
                  <Route
                    path={"/parents/:parentID"}
                    element={<ShowParentInformation />}
                  />
                  <Route path={"/faqs"} element={<FAQs />} />
                  <Route path={"/auth/signin"} element={<Signin />} />
                  <Route path={"/events"} element={<Events />} />
                  <Route path={"/events/:id"} element={<Event />} />
                  <Route path={"/status"} element={<Status />} />
                  <Route path={"/status/:id"} element={<StatusInfo />} />
                  <Route path={"/stuffs"} element={<Techers />} />
                  <Route
                    path={"/stuffs/:stuffID"}
                    element={<StuffInformation />}
                  />
                  <Route path={"/classes"} element={<Classes />} />
                  <Route
                    path={"/classes/:classID"}
                    element={<ClassInformation />}
                  />
                  <Route path={"/courses"} element={<Courses />} />
                  <Route
                    path={"/courses/:courseID"}
                    element={<CourseInforamtion />}
                  />
                  <Route path={"/images"} element={<PublicImages />} />
                </Routes>
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
};

export default App;
