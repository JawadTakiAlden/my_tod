import React from 'react'
import Page from '../layouts/Page'
import * as Yup from 'yup'
import { useQuery } from '@tanstack/react-query'
import { request } from '../api/request'
import CubeLoader from '../components/CubeLoader/CubeLoader'
import { useNavigate } from 'react-router'

const validationSchema = Yup.object({
  class_name : Yup.string().required('class name field is required'),
  age_section : Yup.string().required('age section field is required'),
  teacher_name : Yup.string().required('teacher name field is required'),
})



const classColumns = [
  {
      field : 'id',
      headerName : 'ID',
      width : 50
  },
  {
      field : 'name',
      headerName : 'Class Name',
      width : 150,
      editable : true
      // flex : 1
  },
  {
      field : 'age_section',
      headerName : 'Age Section',
      width : 150,
      valueGetter : (params) => {
        return 'from ' + params.row.age_section.from + ' to ' + params.row.age_section.to 
      }
      // flex : 1
  },
  {
      field : 'teacher_name',
      headerName : 'Teacher Name',
      width : 150,
      editable : true
      // flex : 1
  },
]

const getClassesFromServer = () => {
  return request({
    url : '/classroom',
    method : 'get'
  })
}

const getTeachersFromServer = () => {
  return request({
    url : '/accounts?type=stuff',
    method : 'get'
  })
}

const getAgeSectionFromServer = () => {
  return request({
    url : '/age-section',
    method : 'get'
  })
}

const orginizeData = (values) => {
  const newValues = values.map(valuesObject => (
    {
      name : valuesObject.first_name + ' ' +valuesObject.last_name,
      value : valuesObject.id
    }
  ))

  return newValues
}

const Classes = () => {
  const navigate = useNavigate()
  const {isLoading , isError , error , data , refetch} = useQuery({
    queryKey : ['get-classes-from-server'],
    queryFn : getClassesFromServer
  })

  const teachersQuery = useQuery({
    queryKey : ['get-teachers-for-classes'],
    queryFn : getTeachersFromServer
  })

  const ageSectionQuery = useQuery({
    queryKey : ['get-age-section-for-classes'],
    queryFn : getAgeSectionFromServer
  })
  
  if(isLoading || teachersQuery.isLoading || ageSectionQuery.isLoading){
      return <CubeLoader />
    }
    
    if(isError || teachersQuery.isError || ageSectionQuery.isError){
      if(error?.response?.status === 401 || teachersQuery?.error?.response?.status === 401 || ageSectionQuery?.error?.response?.status === 401){
        navigate('/auth/signin')
      }else if(error?.message === "Network Error" || teachersQuery?.error?.message === "Network Error" || ageSectionQuery?.error?.message === "Network Error"){
        return 'newtwork error'
      }else{
        refetch()
        teachersQuery.refetch()
        ageSectionQuery.refetch()
      }
    }

    const teachers = teachersQuery.data.data.data.filter((obj) => {
      return obj.role === 'teacher'  
    })

    // const ageSection = ageSectionQuery.data.data.data
  return (
    <Page 
      name={'class'} 
      data={data.data} 
      columns={classColumns}
      link={{
        path : 'classroom'
      }}
      formInputs={[
        {
          name : 'class_name',
          lable : 'Class Name',
          type : 'text',
          initialValues : '',
          fullWidth : true
        },
        {
          name : 'teacher_id',
          lable : 'Teacher',
          type : 'select',
          initialValues : '',
          fullWidth : true,
          valueOptions : orginizeData(teachers)
        },
      ]}
      initialValues={{
        class_name : '',
        teacher_id : '',
      }}
      validationSchema={validationSchema}
      valuesShouldUpdate={['class_name' , 'age_section']}

    />
  )
}

export default Classes