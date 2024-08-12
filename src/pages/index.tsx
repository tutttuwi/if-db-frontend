// ** Custom Components Imports
import DataTableWithFilter from 'src/views/dashboard/DataTableWithFilter'
import Cytoscape from 'src/views/dashboard/Cytoscape'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

// ** API Access
import axios from 'axios'

import React, { useState, ChangeEvent, useEffect } from 'react'

const Dashboard = () => {
  const [nodes, setNodes] = useState([]) /** APIで取得したノード情報 */
  const [edges, setEdges] = useState(Array) /** APIで取得したエッジ情報 */
  const [ifs, setIfs] = useState(Array) /** APIで取得したインターフェース情報 */

  const [groupNodes, setGroupNodes] = useState(Array) /** フィルターオプション（グループ） */
  const [systemNodes, setSystemNodes] = useState(Array) /** フィルターオプション（グループ） */
  const [appNodes, setAppNodes] = useState(Array) /** フィルターオプション（グループ） */

  const [filterNodeCondition, setfilterNodeCondition] = useState({}) /** 選択されたフィルター条件 */
  const [targetAppList, setTargetAppList] = useState(Array) /** フィルター後の表示対象IFに紐づくアプリ配列 */

  const [filteredNodesTerm, setFilteredNodesTerm] = useState(Array)
  const [filteredIfsTerm, setFilteredIfsTerm] = useState(Array)
  const [iffilterNodeCondition, setIffilterNodeCondition] = useState({})

  /** LOADING表示用情報 */
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  // localStorageから位置データを取得する関数
  function getStoredPositions() {
    return JSON.parse(localStorage.getItem('nodePositions')) || {}
  }

  // localStorageに位置データを保存する関数
  function storePositions(positions: any) {
    localStorage.setItem('nodePositions', JSON.stringify(positions))
  }

  // ノードの位置をlocalStorageから設定する関数
  function applyStoredPositions(elements, storedPositions) {
    let ret: Array<any> = []
    elements.forEach((element: any) => {
      if (storedPositions[element.id]) {
        ret.push({ data: element, position: storedPositions[element.id] })
      }
    })
    return ret
  }

  /**
   * 初期処理
   */
  useEffect(() => {
    ;(async () => {
      setLoading(true) // LOADING表示

      // 機能情報取得
      const ifList = await axios.get('http://localhost:4001/api/ifs')
      setIfs(
        ifList.data.map((n: any) => {
          n.value = n.name
          n.label = n.name
          return n
        })
      )

      const nodeList = await axios.get('http://localhost:4001/api/nodes')
      console.log('nodeList.data', nodeList.data)

      const edgeList = await axios.get('http://localhost:4001/api/edges')
      console.log('edgeList.data', edgeList.data)

      // CytoscapeJSで利用するため、edge情報にsource,targetを設定
      console.log('[ifs]', ifs)
      const addAppInfoEdges = edgeList.data.map((json: any) => {
        console.log('[json]', json)
        json.source = ifList.data.find((i: any) => i.id === json.src_if_id).node_id
        json.target = ifList.data.find((i: any) => i.id === json.dst_if_id).node_id
        return json
      })
      console.log('[addAppInfoEdges]', addAppInfoEdges)
      setNodes(nodeList.data)
      setEdges(addAppInfoEdges)

      setGroupNodes(
        nodeList.data
          .filter((n: any) => n.type === 'group')
          .map((n: any) => {
            n.value = n.name
            return n
          })
      )
      setSystemNodes(
        nodeList.data
          .filter((n: any) => n.type === 'system')
          .map((n: any) => {
            n.value = n.name
            return n
          })
      )
      setAppNodes(
        nodeList.data
          .filter((n: any) => n.type === 'app')
          .map((n: any) => {
            n.value = n.name
            return n
          })
      )

      // node位置情報取得
      const storedPositions = getStoredPositions()
      // ノードの位置をlocalStorageから適用
      const nodeAppliedPosition = applyStoredPositions(nodeList.data, storedPositions)
      console.log('[nodeAppliedPosition]', nodeAppliedPosition)

      setLoading(false)
    })()
  }, []) // 一度しか呼び出さない

  // useEffect(() => {
  //   console.log('[useEffect] START <filterNodeCondition>')
  //   const groupNodesSetting = [...groupNodes]
  //   const systemNodesSetting = [...systemNodes]
  //   const appNodesSetting = [...appNodes]
  //   const groupFilteredSystemNodeSetting = systemNodesSetting.filter(sn => {
  //     sn.parent === filterNodeCondition.group
  //   })
  //   const groupFilteredAppNodeSetting = groupFilteredSystemNodeSetting.filter(sn => {
  //     sn.parent === filterNodeCondition.group
  //   })

  //   console.log('[useEffect] END <filterNodeCondition>')
  // }, [filterNodeCondition.group, filterNodeCondition.system, filterNodeCondition.app])

  useEffect(() => {
    console.log('[useEffect] START - フィルター条件変更', filterNodeCondition)
    const filterGroupNodeId = filterNodeCondition['group']
    const filterSystemNodeId = filterNodeCondition['system']
    const filterAppNodeId = filterNodeCondition['app']

    if (filterGroupNodeId) {
      setGroupNodes(groupNodes.filter((n: any) => n.id === filterGroupNodeId))
      const filterSystemNodeIdList = findTargetNode('system', filterGroupNodeId) // GroupIDに紐づくSystemIDに絞り込み
      console.log('filterSystemNodeIdList', filterSystemNodeIdList)
      setSystemNodes(systemNodes.filter((n: any) => filterSystemNodeIdList.includes(n.id)))
      const filterAppNodeIdList = findTargetNode('app', filterGroupNodeId) // GroupIDに紐づくAppIDに絞り込み
      setAppNodes(appNodes.filter((n: any) => filterAppNodeIdList.includes(n.id)))
    }
    if (filterSystemNodeId) {
      const filterSystemNode: any = nodes.find((n: any) => n.id === filterSystemNodeId) || {}
      const filterSystemNodeParentGroup = nodes.find((n: any) => n.id === filterSystemNode.parent)
      setGroupNodes([filterSystemNodeParentGroup])
      const filterAppNodeIdList = findTargetNode('app', filterSystemNodeId) // GroupIDに紐づくAppIDに絞り込み
      setAppNodes(appNodes.filter((n: any) => filterAppNodeIdList.includes(n.id)))
    }
    if (filterAppNodeId) {
      const filterAppNode: any = nodes.find((n: any) => n.id === filterAppNodeId) || {}
      const filterAppNodeParentSystem = nodes.find((n: any) => n.id === filterAppNode.parent)
      setSystemNodes([filterAppNodeParentSystem])
      const filterSystemNode: any = nodes.find((n: any) => n.id === filterSystemNodeId) || {}
      const filterSystemNodeParentGroup = nodes.find((n: any) => n.id === filterSystemNode.parent)
      setGroupNodes([filterSystemNodeParentGroup])
    }

    // フィルター条件設定無しの場合
    if (!(filterGroupNodeId || filterSystemNodeId || filterAppNodeId)) {
      setGroupNodes(
        nodes
          .filter((n: any) => n.type === 'group')
          .map((n: any) => {
            n.value = n.name
            return n
          })
      )
      setSystemNodes(
        nodes
          .filter((n: any) => n.type === 'system')
          .map((n: any) => {
            n.value = n.name
            return n
          })
      )
      setAppNodes(
        nodes
          .filter((n: any) => n.type === 'app')
          .map((n: any) => {
            n.value = n.name
            return n
          })
      )
    }
    console.log('[useEffect] END - フィルター条件変更')
  }, [filterNodeCondition.group, filterNodeCondition.system, filterNodeCondition.app])

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>
  if (loading) return <h1>loading...</h1>
  // if (!data) return null

  /**
   * フィルター変更処理
   * @param e フィルター要素
   * @param nodeType フィルター種別タイプ(group|system|app)
   */
  function filterNode(e: ChangeEvent<HTMLInputElement>, nodeType: string) {
    const elId: string = e.currentTarget.dataset.id || ''
    console.log('[elId]', elId, '[nodeType]', nodeType)
    console.log(e.currentTarget)
    console.log(e.currentTarget.dataset.id)
    if (elId) {
      filterNodeCondition[nodeType] = elId
    } else {
      filterNodeCondition[nodeType] = ''
    }
    setfilterNodeCondition(filterNodeCondition)
    console.log('filterNodeCondition', filterNodeCondition)
    const selectedNode = e.currentTarget.value
    const filteredNodes = nodes.filter(node => true)

    filterIfsTerm()
  }

  function filterIfsTerm() {
    let targetAppList: Array<any> = []
    Object.keys(filterNodeCondition).forEach((termKey: string) => {
      const nodeId = filterNodeCondition[termKey]
      const findedTargetAppList = findTargetNode('app', nodeId)
      targetAppList = Array.from(new Set(targetAppList.concat(findedTargetAppList)))
    })
    console.log('[targetAppList]', targetAppList)

    // 関連するIFも含めた絞り込み設定
    const filteredEdges = edges.filter((edgesInfo: any) => {
      return targetAppList.includes(edgesInfo.source) || targetAppList.includes(edgesInfo.target)
    })
    console.log('[filteredEdges]', filteredEdges)
    const ifFilterTerm = {
      srcIfIdList: filteredEdges.map((edge: any) => edge.src_if_id),
      dstIfIdList: filteredEdges.map((edge: any) => edge.dst_if_id)
    }
    const srcIfIdList = ifFilterTerm.srcIfIdList || []
    const dstIfIdList = ifFilterTerm.dstIfIdList || []

    setTargetAppList(targetAppList)
  }

  /**
   * 指定されたNodeIDから子NodeのIDを取得して配列で返却
   * @param nodeId nodeId
   * @returns
   */
  function findTargetNode(targetNodeType: String, nodeId: String) {
    let targetNodeList = new Array()
    nodes.forEach((node: any) => {
      if (node.parent === nodeId) {
        if (node.type === targetNodeType) {
          // console.log(`[findTargetNode]>${targetNodeType}`, nodeId)
          targetNodeList.push(node.id)
        } else {
          // console.log(`[findTargetNode]>${targetNodeType}以外 START`, node.id, nodeId)
          targetNodeList = targetNodeList.concat(findTargetNode(targetNodeType, node.id))
          // console.log(`[findTargetNode]>${targetNodeType}以外 END`, targetNodeList, nodeId)
        }
      }
    })
    // console.log('[findTargetNode]>targetNodeList', targetNodeList, nodeId)
    return targetNodeList
  }

  return (
    <>
      <div>
        {/* <h1>システム連携一覧</h1> */}
        {/* TODO: ノードスペーシングおしゃれにする */}
        {/* <input type='number' value={nodeSpacing} onChange={handleNodeSpacing} /> */}
        {/* TODO: ダウンロードボタン実装 */}
        {/* <a download='system-if.png' href={`${base64png}`} id='download'>
        ダウンロード
      </a> */}
        <div id='popup' className='popup'></div>
        <Grid container spacing={6}>
          {/* システム連携図 表示領域 */}
          <Cytoscape nodes={nodes} edges={edges} />

          <Grid item xs={6} md={6} container direction='row'>
            {/* システム検索条件 */}
            <Grid item xs={12} sx={{ flex: 1, height: '50px' }}>
              <Card>
                <CardHeader
                  title='システム検索条件'
                  action={
                    <IconButton
                      size='small'
                      aria-label='settings'
                      className='card-more-options'
                      sx={{ color: 'text.secondary' }}
                    >
                      {/* <DotsVertical /> */}
                    </IconButton>
                  }
                  titleTypographyProps={{
                    sx: {
                      mb: 2.5,
                      lineHeight: '2rem !important',
                      letterSpacing: '0.15px !important'
                    },
                    alignItems: 'center'
                  }}
                />
                <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
                  <Grid container sx={{ mb: 2, justifyContent: 'space-between' }}>
                    <Grid item xs={4} sx={{ width: '100px' }}>
                      <Autocomplete
                        id='combo-box-group'
                        options={groupNodes}
                        getOptionLabel={(option: any) => option.label}
                        renderOption={(props, option: any) => (
                          <li {...props} data-id={option.id} data-type='group'>
                            {option.label}
                          </li>
                        )}
                        onChange={(event, value, reason) => {
                          // if (reason === 'clear') {
                          filterNode(event, 'group')
                          // }
                        }}
                        sx={{ margin: '0 3px 0 0px' }}
                        renderInput={params => <TextField {...params} label='グループ' data-type='group' />}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Autocomplete
                        id='combo-box-system'
                        options={systemNodes}
                        getOptionLabel={(option: any) => option.label}
                        renderOption={(props, option: any) => (
                          <li {...props} data-id={option.id} data-type='system'>
                            {option.label}
                          </li>
                        )}
                        onChange={(event, value, reason) => {
                          // if (reason === 'clear') {
                          filterNode(event, 'system')
                          // }
                        }}
                        sx={{ margin: '0 3px 0 3px' }}
                        renderInput={params => <TextField {...params} label='システム' />}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Autocomplete
                        id='combo-box-app'
                        options={appNodes}
                        getOptionLabel={(option: any) => option.label}
                        renderOption={(props, option: any) => (
                          <li {...props} data-id={option.id} data-type='app'>
                            {option.label}
                          </li>
                        )}
                        onChange={(event, value, reason) => {
                          // if (reason === 'clear') {
                          filterNode(event, 'app')
                          // }
                        }}
                        sx={{ margin: '0 0px 0 3px' }}
                        renderInput={params => <TextField {...params} label='アプリ' />}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12}>
                      <Autocomplete
                        id='combo-box-if'
                        options={ifs}
                        sx={{ width: 'auto' }}
                        renderInput={params => <TextField {...params} label='インターフェース' />}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* インターフェース一覧 表示領域 */}
            <Grid item xs={12} sx={{ flex: 1 }}>
              <Box sx={{ padding: 0, height: '100%' }}>
                <DataTableWithFilter
                  ifs={ifs}
                  filterNodeCondition={filterNodeCondition}
                  targetAppList={targetAppList}
                  edges={edges}
                  nodes={nodes}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default Dashboard
