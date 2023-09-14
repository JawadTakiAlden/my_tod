import React from 'react'
import Page from '../layouts/Page'
import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import CubeLoader from '../components/CubeLoader/CubeLoader'
import { useNavigate } from 'react-router'
import { request } from '../api/request'
import * as Yup from 'yup'

const cloumns = [
  {
    field : 'id',
    headerName : 'ID',
    width : 50
  },
    {
        field : 'name',
        headerName : 'Name',
        editable : true,
        width : 150
    },
    {
        field : 'image',
        headerName : 'Image',
        width : 120,
        alignHeader : 'center',
        align : 'center',
        renderCell : (params) => {
            return <a href={`http://192.168.1.19:9000${params.row.image}`} target='_blanck'><Box
                sx={{
                    width : '50px',
                    height : '50px',
                    borderRadius : '50%',
                    backgroundImage : `url(http://192.168.1.19:9000${params.row.image})`,
                    backgroundRepeat : 'no-repeat',
                    backgroundSize : 'cover',
                    backgroundPosition : 'center'
                }}
            >

            </Box>
            </a>
        }
    },
    {
        field : 'isExtra',
        type : 'boolean',
        editable : true,
        headerName : 'Is Extra'
    },
    {
      field : 'gender',
      headerName : 'Gender',
      width : 60,
      type : 'singelSelect',
      valueOptions : ['mail' , 'femail'],
      editable : true
    },
]

const getChildrensFromServer = () => {
    return request({
        url : '/children'
    })
}

const getParentsFromServer = () => {
  return request({
      url : '/accounts?type=parent',
      method : 'get'
  })
}

const getClassesFromServer = () => {
  return request({
    url : '/classroom',
    method : 'get'
  })
}


const validationSchema = Yup.object({
  name : Yup.string().required('name field is requied'),
  image : Yup.string().required('image field is requied'),
  isExtra : Yup.boolean().required('is extra field is required'),
  gender : Yup.string().required('gender field is required'),
  parent_id : Yup.string().required('parent is a required field'),
  classRoom_id : Yup.string().required('class room is a required field')
})


const orginizeParentsData = (data) => {
  return data.map(obj => ({name : obj.username , value : obj.id}))
}

const orginizeClassesData = (data) => {
  return data.map(obj => ({name : obj.name , value : obj.id}))
}


const Childrens = () => {

    const navigate = useNavigate()
    const childrensQuery = useQuery({
        queryKey : ['get-childrens-from-server'],
        queryFn : getChildrensFromServer
    })

    const parentsQuery = useQuery({
      queryKey : ['get-parents-from-server-for-childrens'],
      queryFn : getParentsFromServer
    })

    const classesQuery = useQuery({
      queryKey : ['get-classes-from-server-for-childrens'],
      queryFn : getClassesFromServer
    })

    if(childrensQuery.isLoading || parentsQuery.isLoading || classesQuery.isLoading){
        return <CubeLoader />
      }
    
      if(childrensQuery.isError){
        if(childrensQuery.error.response){
          if(childrensQuery.error.response.status === 401){
            return navigate('/auth/signin')
          }
        }else if(childrensQuery.error.request){
          return "no response receved from server"
        }else{
          return "unknown error with message" + childrensQuery.error.message
        }
      }

      const parentsSelectOptions = orginizeParentsData(parentsQuery.data.data.data)
      const classesSelectOptions = orginizeClassesData(classesQuery.data.data)

      console.log(classesSelectOptions)
  return (
    <Page 
    name={'childrens'} 
    data={childrensQuery.data.data.children} 
    columns={cloumns}
    link={{
      path : 'children'
    }}
    formInputs={[
      {
        name : 'name',
        lable : 'First Name',
        type : 'text',
        initialValues : '',
        fullWidth : true
      },
      {
        name : 'image',
        lable : 'Image',
        type : 'file',
        fullWidth : true
      },
      {
        name : 'parent_id',
        lable : 'Parent',
        type : 'select',
        fullWidth : true,
        valueOptions : parentsSelectOptions
      },
      {
        name : 'gender',
        lable : 'Gender',
        type : 'select',
        fullWidth : true,
        valueOptions : [
          {name : 'mail' , value : 'mail'},
          {name : 'femail' , value : 'femail'},
        ]
      },
      {
        name : 'isExtra',
        lable : 'Is Extra',
        type : 'select',
        fullWidth : true,
        valueOptions : [
          {name : 'normal' , value : 0},
          {name : 'extra' , value : 1},
        ]
      },
      {
        name : 'classRoom_id',
        lable : 'Class',
        type : 'select',
        fullWidth : true,
        valueOptions : classesSelectOptions
      },
      
    ]}
      initialValues={{
        name : '',
        image : '',
        isExtra : 0,
        gender : 'mail',
        parent_id : '',
        classRoom_id : classesSelectOptions.length > 0  ? 1 : '' 
      }}
        validationSchema={validationSchema}
        valuesShouldUpdate={['name' , 'isExtra' , 'gender']}
        updateAPI={'/children'}
    />
  )
}

export default Childrens