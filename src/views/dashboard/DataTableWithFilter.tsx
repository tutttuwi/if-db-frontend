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

import React, { useEffect, useState, useRef } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { TextField } from '@mui/material'
import Grid from '@mui/material/Grid'

const initialRows = [
  { id: 1, name: 'John Doe', age: 25 },
  { id: 2, name: 'Jane Smith', age: 30 },
  { id: 3, name: 'Alice Johnson', age: 35 },
  { id: 4, name: 'Bob Brown', age: 40 }
]

// TODO: フィルター処理リファクタリング

// const columns = [
//   { field: 'id', headerName: 'ID', width: 90 },
//   { field: 'code', headerName: 'システムコード', width: 90 },
//   { field: 'subcode', headerName: 'サブシステムコード', width: 90 },
//   { field: 'name', headerName: 'Name', width: 150 },
//   { field: 'type', headerName: 'タイプ', width: 90 },
//   { field: 'parent', headerName: '親ノード', width: 90 }
// ]
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'type', headerName: 'タイプ', width: 90 },
  { field: 'name_id', headerName: 'インターフェースID', width: 150 },
  { field: 'name', headerName: 'インターフェース名', width: 150 },
  { field: 'endpoint', headerName: 'エンドポイント', width: 150 },
  { field: 'status', headerName: 'ステータス', width: 90 },
  { field: 'doc', headerName: 'ドキュメントリンク', width: 90 },
  { field: 'description', headerName: '詳細説明', width: 150 },
  { field: 'misc', headerName: '備考', width: 150 }
]

const DataTableWithFilter = (props: any) => {
  console.log('[props]', props)
  // const [rows, setRows] = useState(initialRows)
  const [rows, setRows] = useState(props.ifs)
  const [filterText, setFilterText] = useState('')
  const filterChange = useRef<HTMLInputElement>(null)

  const handleFilterChange = (event: any, text: any = '') => {
    const value = event ? event.target.value : text
    setFilterText(value)

    const filteredRows = props.ifs.filter(row => {
      const paramList: string[] = Object.keys(row)
      for (let index = 0; index < paramList.length; index++) {
        const param = paramList[index]
        const matched = new String(row[param]).toLowerCase().includes(value.toLowerCase())
        if (matched) return true
      }
    })
    // setRows(filteredRows)
    filterIfsTerm(filteredRows)
  }
  const filterIfsTerm = (ifs: Array<any> = props.ifs) => {
    let targetAppList: Array<any> = []
    Object.keys(props.filterTerm).forEach(termKey => {
      const findedTargetAppList = findTargetApp(props.filterTerm[termKey])
      targetAppList = duplicatedArr(targetAppList, findedTargetAppList)
    })
    // const targetAppList = findTargetApp(elId)
    console.log('[targetAppList]', targetAppList)
    // console.log('[edges]', edges)
    // setTargetAppList(targetAppList)

    // const targetAppList = props.targetAppList
    const filteredEdges = props.edges.filter((edgesInfo: any) => {
      return targetAppList.includes(edgesInfo.source) || targetAppList.includes(edgesInfo.target)
    })
    console.log('[filteredEdges]', filteredEdges)
    const ifFilterTerm = {
      srcIfIdList: filteredEdges.map((edge: any) => edge.src_if_id),
      dstIfIdList: filteredEdges.map((edge: any) => edge.dst_if_id)
    }

    const srcIfIdList = ifFilterTerm.srcIfIdList || []
    const dstIfIdList = ifFilterTerm.dstIfIdList || []
    console.log('[props.filterTerm]', props.filterTerm)
    const hasFilterTerm = Object.keys(props.filterTerm).find(e => props.filterTerm[e] !== '') // フィルター条件が設定されているかどうか
    console.log('[hasFilterTerm]', hasFilterTerm)
    if (srcIfIdList.length || dstIfIdList.length || hasFilterTerm) {
      // const filteredIfs = ifs.filter((ifItem: any) => {
      //   return srcIfIdList.includes(ifItem.id) || dstIfIdList.includes(ifItem.id)
      // })
      const filteredIfs = ifs.filter((ifItem: any) => {
        return targetAppList.includes(ifItem.node_id)
      })
      setRows(filteredIfs)
    } else {
      setRows(ifs)
    }
  }

  
  useEffect(() => {
    handleFilterChange(null, filterChange?.current?.value)
    filterIfsTerm()
  }, [props.filterTerm])

  return (
    <Card style={{ height: '100%' }}>
      <CardContent>
        <Grid style={{ height: '300px' }}>
          <TextField
            ref={filterChange}
            label='検索'
            variant='outlined'
            value={filterText}
            onChange={handleFilterChange}
            style={{ marginBottom: 16 }}
          />
          <Box sx={{ height: '420px' }}>
            <DataGrid rows={rows} data-ifs={props.ifs} columns={columns} pageSize={5} checkboxSelection />
          </Box>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DataTableWithFilter
