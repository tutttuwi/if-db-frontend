// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { TextField } from '@mui/material'
import Grid from '@mui/material/Grid'

const initialRows = [
  { id: 1, name: 'John Doe', age: 25 },
  { id: 2, name: 'Jane Smith', age: 30 },
  { id: 3, name: 'Alice Johnson', age: 35 },
  { id: 4, name: 'Bob Brown', age: 40 }
]

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'age', headerName: 'Age', width: 110 }
]

const DataTableWithFilter = () => {
  const [rows, setRows] = useState(initialRows)
  const [filterText, setFilterText] = useState('')

  const handleFilterChange = event => {
    const value = event.target.value
    setFilterText(value)

    const filteredRows = initialRows.filter(row => {
      const paramList: string[] = Object.keys(row)
      for (let index = 0; index < paramList.length; index++) {
        const param = paramList[index]
        const matched = new String(row[param]).toLowerCase().includes(value.toLowerCase())
        if (matched) return true
      }
    })
    setRows(filteredRows)
  }

  return (
    <Card style={{ height: '100%' }}>
      <CardContent>
        <Grid style={{ height: '400px' }}>
          <TextField
            label='検索'
            variant='outlined'
            value={filterText}
            onChange={handleFilterChange}
            style={{ marginBottom: 16 }}
          />
          <Box sx={{ height: '480px' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection autoHeight />
          </Box>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DataTableWithFilter
