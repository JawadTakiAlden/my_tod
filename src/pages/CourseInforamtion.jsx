import React from "react";
import { useNavigate, useParams } from "react-router";
import NetworkError from "./Errors/NetworkError";
import CubeLoader from "../components/CubeLoader/CubeLoader";
import { request } from "../api/request";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import GridBox from "../components/GridBox";
import GridItem from "../components/GridItem";
import { tokens } from "../assets/theme";
import ChildCard from "../layouts/ChildCard";

const CourseInforamtion = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { courseID } = useParams();
  const navigate = useNavigate();

  const getCourse = () => {
    return request({ url: `/course/${courseID}` });
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [`get-course-${courseID}-details`],
    queryFn: getCourse,
  });

  if (isLoading) {
    return <CubeLoader />;
  }

  if (isError) {
    if (error.response.status === 401) {
      navigate("/auth/signin");
    } else if (error.message === "Network Error") {
      return <NetworkError />;
    } else {
      refetch();
    }
  }

  const course = data.data.course;
  const children = data.data.course.children;
  console.log(children);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Typography
          sx={{
            width: "fit-contetn",
            textAlign: "center",
            color: colors.pinkAccent[500],
            fontSize: { xs: "28px", sm: "30px", md: "34px" },
            fontWeight: "500",
            position: "relative",
            "&::after": {
              content: "''",
              position: "absolute",
              width: "50px",
              height: "1px",
              backgroundImage: `linear-gradient(to right ,${colors.indigoAccent[800]} , ${colors.pinkAccent[500]})`,
              left: "-60px",
              top: "50%",
              transform: "translateY(-50%)",
            },
            "&::before": {
              content: "''",
              position: "absolute",
              width: "50px",
              height: "1px",
              backgroundImage: `linear-gradient(to right ,${colors.pinkAccent[500]} , ${colors.indigoAccent[800]})`,
              right: "-60px",
              top: "50%",
              transform: "translateY(-50%)",
            },
          }}
        >
          Students
        </Typography>
      </Box>
      <Box>
        <GridBox spacing={1}>
          {children.map((item) => {
            return (
              <GridItem xs={12} sm={6} md={4} lg={3}>
                <ChildCard classRoomName={"child.classRoo"} child={item} />
              </GridItem>
            );
          })}
        </GridBox>
      </Box>
    </>
  );
};

export default CourseInforamtion;
