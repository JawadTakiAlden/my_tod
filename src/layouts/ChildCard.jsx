<<<<<<< HEAD
import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../assets/theme";
import ChildImage from "../assets/images/shuffle-03.jpg";
import { baseURL } from "../api/request";

const ChildCard = ({ child, classRoomName }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  console.log(`${baseURL}${child.image}`);
  return (
    <Box
      sx={{
        overflow: "hidden",
        position: "relative",
        "&:hover .child-card-body": {
          bottom: "0",
        },
        "&:hover > img": {
          transform: "rotate(3deg) scale(1.1)",
        },
      }}
    >
      <img
        style={{
          maxWidth: "100%",
          transition: "0.3s",
        }}
        src={`${baseURL}${child?.image}`}
        locading={"lazy"}
      />
      <Box
        className={"child-card-body"}
        sx={{
          position: "absolute",
          width: "100%",
          padding: "20px",
          backgroundColor: "white",
          transition: "0.3s",
          left: "0",
          bottom: "-100%",
        }}
      >
        <Typography
          sx={{
            color: colors.indigoAccent[500],
            fontSize: "20px",
            fontWeight: "500",
          }}
        >
          {child.name}
        </Typography>
        <Typography
          sx={{
            color: colors.grey[200],
            fontSize: "16px",
            fontWeight: "300",
          }}
        >
          {classRoomName}
        </Typography>
        <Typography
          sx={{
            color: child.isExtra ? "#00a244" : "#e7121a",
            fontSize: "16px",
            fontWeight: "300",
          }}
        >
          {child.isExtra ? "Extra" : "Not Extra"}
        </Typography>
      </Box>
=======
import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'
import { tokens } from '../assets/theme'
import { Link } from 'react-router-dom'

const ChildCard = ({child , childClassName}) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    console.log(child)
  return (
    <Box
        sx={{
            overflow : 'hidden',
            position : 'relative',
            borderRadius : '8px',
            "&:hover .child-card-body" : {
                bottom : '0'
            },
            "&:hover > img" : {
                transform : 'rotate(3deg) scale(1.1)'
            }
        }}
    >
        <img 
            style={{
                maxWidth : '100%',
                transition : '0.3s'
            }}
            src={`http://192.168.1.19:9000${child.image}`}
            locading={'lazy'}
        />
        <Box
            className={'child-card-body'}
            sx={{
                position : 'absolute',
                width : '100%',
                padding : '20px',
                backgroundColor : 'white',
                transition : '0.3s',
                left : '0',
                bottom : '-100%'
            }}
        >
            <Typography
                sx={{
                    color : colors.indigoAccent[500],
                    fontSize : '20px',
                    fontWeight : '500'
                }}
            >
                {child.name}
            </Typography>
            <Typography
                sx={{
                    color : colors.grey[200],
                    fontSize : '16px',
                    fontWeight : '300'
                }}
            >
                {childClassName}
            </Typography>
        </Box>
>>>>>>> main
    </Box>
  );
};

export default ChildCard;
