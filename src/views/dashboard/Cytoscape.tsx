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

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import DataTableWithFilter from 'src/views/dashboard/DataTableWithFilter'

// ** DB Access
import connectDB from 'src/db/ifdb/db'
import { NodeModel } from 'src/db/models/IFDBNode'
// var NodeSchema = model.NodeSchema
// import IFDBNode from 'src/db/models/IFDBNode'
// ;async () => {
//   await connectDB()
//   const node = await IFDBNode.find()
//   console.log(node)
// }
// import { test } from 'src/db/nodesApi'
// test()
// ** API Access
import axios from 'axios'

import React, { useState, ChangeEvent, useEffect } from 'react'
import dynamic from 'next/dynamic'
import CytoscapeComponent from 'react-cytoscapejs'
// const CytoscapeComponent = dynamic(() => import('react-cytoscapejs'), { ssr: false })
import { ElementDefinition } from 'cytoscape'
import cys from 'cytoscape'
/**@ts-ignore */
import cola from 'cytoscape-cola'
import Link from 'next/link'
cys.use(cola)

function wrapCytoscapeData(ary: Array<Object>): [] {
  const ret: [] = ary.map(_data => {
    return { data: _data }
  })
  return ret
}

function Cytoscape() {
  const [width, setWith] = useState('100%')
  const [height, setHeight] = useState('70vh')
  const [base64png, setBase64png] = useState('')
  const [nodeSpacing, setNodeSpacing] = useState(50)

  const [nodes, setNodes] = useState([])
  const [groupNodes, setGroupNodes] = useState(Array)
  const [systemNodes, setSystemNodes] = useState(Array)
  const [appNodes, setAppNodes] = useState(Array)
  const [filteredNodes, setFilteredNodes] = useState(Array)
  const [edges, setEdges] = useState([])
  // データ取得
  // axios.get('http://localhost:4001/api/nodes').then(result => {
  //   console.log(result.data)
  // })
  // axios.get('http://localhost:4001/api/edges').then(result => {
  //   // console.log(result.data)
  //   // setNodes(result.data)
  //   // setEdges(result.data)
  // })
  const [graphData, setGraphData] = useState({})
  const [data, setData] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get('http://localhost:4001/api/nodes').then(ret1 => {
      console.log('ret1.data', ret1.data)
      axios.get('http://localhost:4001/api/edges').then(ret2 => {
        console.log('ret2.data', ret2.data)
        setNodes(ret1.data)
        setEdges(ret2.data)
        const nodes: [] = ret1.data
        setGroupNodes(
          nodes
            .filter((n: any) => n.type === 'group')
            .map((n: any) => {
              n.value = n.name
              return n
            })
        )
        // setSystemNodes(nodes.filter((n: any) => n.type === 'system'))
        setSystemNodes(
          nodes
            .filter((n: any) => n.type === 'system')
            .map((n: any) => {
              n.value = n.name
              return n
            })
        )

        // setAppNodes(nodes.filter((n: any) => n.type === 'app'))
        setAppNodes(
          nodes
            .filter((n: any) => n.type === 'app')
            .map((n: any) => {
              n.value = n.name
              return n
            })
        )

        setGraphData([].concat(wrapCytoscapeData(ret1.data), wrapCytoscapeData(ret2.data)))
        setLoading(false)
      })
    })
  }, [])

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>
  if (loading) return <h1>loading...</h1>
  // if (!data) return null

  // const layout = {
  //   name: 'breadthfirst',
  //   fit: true,
  //   // circle: true,
  //   directed: true,
  //   padding: 50,
  //   // spacingFactor: 1.5,
  //   animate: true,
  //   animationDuration: 1000,
  //   avoidOverlap: true,
  //   nodeDimensionsIncludeLabels: false,
  // };

  const layout = {
    name: 'cola',
    animate: true, // レイアウトが実行中に表示するかどうか
    refresh: 1, // フレームあたりのティック数；数値が高いほど速いが、動きがぎこちなくなる
    maxSimulationTime: 4000, // レイアウトを実行する最大時間（ミリ秒）
    ungrabifyWhileSimulating: false, // レイアウト中にノードをドラッグできないようにする
    fit: true, // ノードの再配置ごとにビューポートにフィットさせる
    padding: 30, // シミュレーション周りの余白
    boundingBox: undefined, // レイアウトの境界を制約する；{ x1, y1, x2, y2 } または { x1, y1, w, h }
    nodeDimensionsIncludeLabels: false, // ノードが占有するスペースの決定にラベルを含めるかどうか

    // レイアウトイベントのコールバック
    ready: function () {}, // レイアウトが準備完了したときに呼ばれる
    stop: function () {}, // レイアウトが停止したときに呼ばれる

    // 位置決定オプション
    randomize: false, // レイアウトの開始時にランダムなノード位置を使用する
    avoidOverlap: true, // trueの場合、ノードの境界ボックスの重なりを防ぐ
    handleDisconnected: true, // trueの場合、切断されたコンポーネントが重ならないようにする
    convergenceThreshold: 0.01, // アルファ値（システムエネルギー）がこの値を下回ると、レイアウトが停止する
    nodeSpacing: function (node: any) {
      return nodeSpacing
    }, // ノード周りの余分なスペース | 値を大きくしすぎると縮小されすぎて見づらい
    flow: undefined, // 指定された場合、DAG/ツリーフローのレイアウトを使用する　例：{ axis: 'y', minSeparation: 30 }
    alignment: undefined, // ノードの相対的な位置合わせの制約例：{vertical: [[{node: node1, offset: 0}, {node: node2, offset: 5}]], horizontal: [[{node: node3}, {node: node4}], [{node: node5}, {node: node6}]]}
    gapInequalities: undefined, // ノード間のギャップに対する不等式制約のリスト例： [{"axis":"y", "left":node1, "right":node2, "gap":25}]
    centerGraph: true, // 初期のノード位置を調整してグラフを中央に配置する（現在の位置からレイアウトを開始したい場合はfalseを指定）

    // エッジ長さを指定するさまざまな方法
    // 各項目は定数の数値または `function( edge ){ return 2; }` のような関数で指定可能
    edgeLength: undefined, // シミュレーション内でエッジの長さを直接設定
    edgeSymDiffLength: undefined, // シミュレーション内の対称差エッジの長さ
    edgeJaccardLength: undefined, // シミュレーション内のジャッカードエッジの長さ

    // コーラアルゴリズムの反復；未定義の場合はデフォルト値を使用
    unconstrIter: undefined, // 制約なしの初期レイアウト反復
    userConstIter: undefined, // ユーザー指定の制約を使用した初期レイアウト反復
    allConstIter: undefined // 非重複を含むすべての制約を使用した初期レイアウト反復
  }

  const styleSheet = [
    {
      selector: 'node',
      style: {
        backgroundColor: '#4a56a6',
        width: 30,
        height: 30,
        label: 'data(label)',

        // "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "text-valign": "center",
        // "text-halign": "center",
        'overlay-padding': '6px',
        'z-index': '10',
        //text props
        'text-outline-color': '#4a56a6',
        'text-outline-width': '2px',
        color: 'white',
        fontSize: 20
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': '6px',
        'border-color': '#FF8E9E',
        'border-opacity': '0.5',
        'background-color': '#FF597B',
        width: 50,
        height: 50,
        //text props
        'text-outline-color': '#FF8E9E',
        'text-outline-width': 2
      }
    },
    {
      selector: "node[type='group']",
      style: {
        shape: 'round-rectangle',
        backgroundColor: '#EEE',
        label: 'data(label)',

        'overlay-padding': '6px',
        'z-index': '10',
        //text props
        'text-outline-color': '#4a56a6',
        'text-outline-width': '2px',
        color: 'white',
        fontSize: 20
      }
    },
    {
      selector: "node[type='system']",
      style: {
        'background-color': '#FFF',
        shape: 'round-rectangle'
      }
    },
    {
      selector: "node[type='app']",
      style: {
        shape: 'barrel'
      }
    },

    {
      selector: 'edge',
      style: {
        width: 3,
        // "line-color": "#6774cb",
        'line-color': '#AAD8FF',
        'target-arrow-color': '#6774cb',
        'target-arrow-shape': 'triangle',
        // ex) <https://js.cytoscape.org/demos/edge-types/>
        'curve-style': 'unbundled-bezier'
      }
    },
    {
      selector: 'edge:selected',
      style: {
        'line-color': '#FF8E9E',
        'target-arrow-color': '#FF597B',
        'border-width': '5px',
        'border-color': '#AAD8FF',
        'border-opacity': '0.5',
        'background-color': '#77828C',
        width: 10,
        height: 5,
        //text props
        'text-outline-color': '#77828C',
        'text-outline-width': 8
      }
    }
  ]

  let myCyRef

  const handleNodeSpacing = (e: ChangeEvent<HTMLInputElement>) => {
    setNodeSpacing(Number(e.currentTarget.value))
  }

  function filterdNodes(e: ChangeEvent<HTMLInputElement>) {
    const selectedNode = e.currentTarget.value
    const filteredNodes = nodes.filter(node => true)
    setFilteredNodes(filteredNodes)
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
          <Grid item xs={6} md={6}>
            <Card>
              <CardHeader
                title='システム連携図'
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
                  }
                }}
              />
              <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
                <Grid container spacing={[5, 0]}>
                  <CytoscapeComponent
                    elements={CytoscapeComponent.normalizeElements(graphData)}
                    // pan={{ x: 200, y: 200 }}
                    style={{ width: width, height: height }}
                    zoomingEnabled={true}
                    maxZoom={3}
                    minZoom={0.1}
                    autounselectify={false}
                    boxSelectionEnabled={true}
                    layout={layout}
                    stylesheet={styleSheet}
                    cy={cy => {
                      myCyRef = cy

                      console.log('EVT', cy)
                      var popup = document.getElementById('popup')

                      // node,edgeを選択状態にする
                      // // すべてのノードのIDを取得する
                      // cy.nodes().forEach(function (node) {
                      //   console.log(node.id())
                      // })

                      // // すべてのエッジのIDを取得する
                      // cy.edges().forEach(function (edge) {
                      //   console.log(edge.id())
                      // })
                      // cy.getElementById('s1').select()
                      // cy.getElementById('s2').select()
                      // cy.getElementById('s3').select()
                      // cy.getElementById('s4').select()
                      // 複数のノードやエッジを選択状態にする
                      // cy.batch(function () {
                      //   cy.getElementById('s1').select()
                      //   cy.getElementById('s2').select()
                      //   cy.getElementById('s3').select()
                      //   cy.getElementById('s4').select()
                      // })

                      cy.on('mouseover', 'node', evt => {
                        // console.log('mouseover.evt', evt)
                        // console.log('mouseover.evt.target', evt.target)
                        var node = evt.target
                        // console.log(node)
                        var position = evt.position
                        // console.log('position', position)
                        var data = node.data()
                        if (popup && position && data.id) {
                          popup.style.display = 'block'
                          // canvasの左上に付ける
                          // popup.style.left = position.x + 200 + 'px'
                          // popup.style.top = position.y + 50 + 'px'
                          popup.innerHTML =
                            'システムID: ' +
                            data.id +
                            '<br>システム名: ' +
                            data.label +
                            '<br>タイプ: ' +
                            data.type +
                            '<br>説明: ' +
                            data.description
                        }
                      })

                      cy.on('mouseover', 'edge', evt => {
                        var node = evt.target
                        var position = evt.position
                        var data = node.data()
                        if (popup && position && data.id) {
                          popup.style.display = 'block'
                          popup.innerHTML =
                            'インターフェスID: ' +
                            data.label +
                            '<br>アクセス元システム： ' +
                            '（アクセス元システム名）' +
                            '<br>アクセス先システム: ' +
                            '（アクセス先システム名）'
                        }
                      })

                      cy.on('mouseout', evt => {
                        var popup = document.getElementById('popup')
                        if (popup) {
                          popup.style.display = 'none'
                        }
                      })
                      cy.on('tap', 'node', evt => {
                        var node = evt.target
                        console.log('click!node')
                        // console.log('EVT', evt)
                        // console.log('EVT.cy', evt.cy)
                        // console.log('EVT.cy._private', evt.cy._private)
                        console.log('EVT.cy._private', evt)
                        // console.log('cy.nodes', cy.nodes())
                        // cy.nodes()[0].active()
                        // console.log('TARGET', node.data())
                        // console.log('TARGET TYPE', typeof node[0])
                        // var png64 = cy.png()
                        // setBase64png(png64)

                        // TODO: フィルター処理実装
                        // const filterCy = cy.filter(function (element, i) {
                        //   // console.log('filter', element)
                        //   return false
                        //   // return element.isNode() && element.data('weight') > 50
                        // })
                        // console.log(filterCy)
                        // cy.data(filterCy)

                        // TODO: ノードに関するノード/エッジをハイライトさせたい（調べたができなさそう）
                        // 関連要素をハイライト
                        // 既存の選択をクリア
                        // cy.elements().forEach(el => {
                        //   console.log(el.classes())
                        //   el.removeClass('highlighted')
                        //   console.log(el.classes())
                        // })
                        // // タップされたノードと関連エッジ、ノードを選択状態にする
                        // var connectedEdges = node.connectedEdges()
                        // var connectedNodes = connectedEdges.connectedNodes()
                        // node.addClass('highlighted')
                        // connectedEdges.addClass('highlighted')
                        // connectedNodes.addClass('highlighted')
                      })
                      cy.on('tap', 'edge', evt => {
                        var edge = evt.target
                        console.log('click!edge')
                        console.log('EVT', evt)
                        console.log('TARGET', edge.data())
                        console.log('TARGET TYPE', typeof edge[0])
                      })
                    }}
                    abc={console.log('myCyRef', myCyRef)}
                  />
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={6} container direction='row'>
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
                  <Grid container>
                    <Grid item xs={4}>
                      <Autocomplete
                        id='combo-box-demo'
                        options={groupNodes}
                        onInputChange={filterdNodes}
                        sx={{ width: 'auto' }}
                        renderInput={params => <TextField {...params} label='グループ' />}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Autocomplete
                        id='combo-box-demo'
                        options={systemNodes}
                        sx={{ width: 'auto' }}
                        renderInput={params => <TextField {...params} label='システム' />}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Autocomplete
                        id='combo-box-demo'
                        options={appNodes}
                        sx={{ width: 'auto' }}
                        renderInput={params => <TextField {...params} label='アプリ' />}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sx={{ flex: 1 }}>
              <Box sx={{ padding: 0, height: '100%' }}>
                <DataTableWithFilter nodes={nodes} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default Cytoscape
