import { Alert, Box, Button, Snackbar, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import GridBox from '../components/GridBox'
import GridItem from '../components/GridItem'
import { tokens } from '../assets/theme'
import { Formik } from 'formik'
import * as yup from 'yup'
import signinBackground from '../assets//images/signin2.png'
import Form from '../components/Form'
import { request } from '../api/request'
import { useNavigate } from 'react-router'
import CubeLoader from '../components/CubeLoader/CubeLoader'
import { useMutation } from '@tanstack/react-query'
import { login, useJawadAuthController } from '../context'

const signinHandler = (values) => {
  return request({
    url : '/login',
    method : 'post',
    data : values,
  }).then(res => res)
}

const Signin = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const isExtraSmall = useMediaQuery('(max-width:599px)')
    const [open , setOpen] = useState(false)
    const [error , setError] = useState("")
    const [ , dispatch] = useJawadAuthController()

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };
    const navigate = useNavigate()

    const { mutate , isLoading} = useMutation({
      mutationFn : signinHandler,
      onSuccess : (data) => {
        login(dispatch , {
          token : data.data.token,
          user : data.data.user
        })
        navigate('/dashboard')
      },
      onError : (error) => {
        if(!error.response && error.message === 'Network Error'){
          setError("obbs , you have internet connection problems")
          setOpen(true)
          return
        }
            switch(error.response.status){
                case 404 : {
                    setError("obbs , you're out of space , the destenation not found in our system")
                    setOpen(true)
                    break ;
                }
                case 401 : {
                    setError("you're not authorize to get in our system")
                    setOpen(true)
                    break ;
                }

                case 500 : {
                    setError("obbs , there are some problems in our server , we will fix it soon , come backe later")
                    setOpen(true)
                    break
                }
                case 422 : {
                    setError("obbs , may you are making mistake with your password or email")
                    setOpen(true)
                    break
                }
                default : {
                    setError(`obbs ,unknown error happend with status code ${error.status}`)
                    setOpen(true)
                    break
                }
            }        
        }
    })

    const loginFormHandler = (values) => {
      mutate(values)
      // login.mutate(values)
      // request({
      //   url : '/login',
      //   method : 'POST',
      //   data : values
      // }).then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
    }

    if(isLoading){
      return <CubeLoader />
    }

  return (
    <>
    <Box>
    <GridBox
      height={'calc(100vh - 80px)'}
      alignItems={'center'}
      spacing={4}
    >
      <GridItem xs={12} sm={5} >
        <Box
          sx={{
            padding : isExtraSmall ? '0 15px' : '0 0 0 30px'
          }}
        >

          <Typography
            sx={{
              color : colors.pinkAccent[500],
              textTransform : 'capitalize',
              marginBottom : '15px',
            }}
            variant='h2'
          >
            welcome back
          </Typography>
          <Typography
            sx={{
              color :colors.grey[400],
              marginBottom : '15px',
            }}
            variant='h4'
          >
            Enter your email and password to sign up
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={loginFormHandler}
          >
            {
              ({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                    <Form>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Username"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.username}
                      name="username"
                      error={!!touched.username && !!errors.username}
                      helperText={touched.username && errors.username}
                      sx={{ 
                          gridColumn: "span 4" ,
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="password"
                      label="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={!!touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      sx={{ 
                          gridColumn: "span 4" ,
                      }}
                    />
                    </Form>
                  <Box display="flex" justifyContent="center" mt="20px">
                    <Button type="submit" fullWidth sx={{color : colors.indigoAccent[500] , padding:'10px' , backgroundImage : `linear-gradient(90deg , ${colors.yellowAccent[500]} , ${colors.yellowAccent[400]})` }} color="secondary" variant="contained">
                      Sign in
                    </Button>
                  </Box>
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    flexDirection={'column'}
                    rowGap={2}
                    mt={3}
                    textAlign={'center'}
                    
                  >
                  </Box>
                </form>
              )
            }
          </Formik>
        </Box>
      </GridItem>
      {
        !isExtraSmall && (
          <GridItem xs={12} sm={7} sx={{height:'100%'}}>
          <Box
            height={'100%'}
            overflow ='hidden'
            mt={1}
          >

            <Box
              sx={{

                backgroundImage : `url(${signinBackground})`,
                backgroundSize : 'cover',
                backgroundRepeat : 'no-repeat',
                backgroundPosition : 'center',
                height : '100%',
                transform: "skewX(-15deg)",
                borderRadius : '16px',
                position : 'relative',
                right : '-100px',
              }}
            >
            </Box>
          </Box>
          </GridItem>
        )
      }
      
    </GridBox>
    </Box>
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>
    </>
  )
}

const initialValues = {
    username : '',
    password : ''
  }
  
  const validationSchema = yup.object({
    username : yup.string().required('username field is required'),
    password : yup.string().required('password field is required')
  })
export default Signin