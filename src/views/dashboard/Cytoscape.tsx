// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'

// ** API Access
import axios from 'axios'

import React, { useState, ChangeEvent, useEffect } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import cys from 'cytoscape'
/**@ts-ignore */
import cola from 'cytoscape-cola'
cys.use(cola)

function wrapCytoscapeData(ary: Array<Object>): [] {
  const ret: [] = ary.map(_data => {
    return { data: _data }
  })
  return ret
}

function Cytoscape(props: any) {
  // const graphData = props.graphData || {}
  const nodes = props.nodes || []
  const edges = props.edges || []
  // =============================================
  // state変数定義
  // =============================================
  // Cytoscape図 表示幅調整 デフォルト値入力しているが、最大表示などをしたい場合変更できるようにState変数化
  const [width, setWith] = useState('100%')
  const [height, setHeight] = useState('70vh')
  const [base64png, setBase64png] = useState('')
  const [nodeSpacing, setNodeSpacing] = useState(50)

  // const [nodes, setNodes] = useState([])
  const [groupNodes, setGroupNodes] = useState(Array)
  const [systemNodes, setSystemNodes] = useState(Array)
  const [appNodes, setAppNodes] = useState(Array)
  const [filteredNodesTerm, setFilteredNodesTerm] = useState(Array)
  const [filteredIfsTerm, setFilteredIfsTerm] = useState(Array)
  const [filterTerm, setFilterTerm] = useState({})
  // const [edges, setEdges] = useState(Array)
  const [ifs, setIfs] = useState(Array)
  const [ifFilterTerm, setIfFilterTerm] = useState({})
  const [targetAppList, setTargetAppList] = useState(Array)

  const [cy, setCy] = useState({})
  const [graphData, setGraphData] = useState({})
  const [data, setData] = useState()
  const [error, setError] = useState()

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
        // element.position = storedPositions[element.id]
      }
    })
    return ret
    // setNodes(elements)
  }

  // if (!storedPositions) {
  //   // ノードの位置をlocalStorageに保存
  //   cy.nodes().forEach(function (node) {
  //     storedPositions[node.id()] = node.position()
  //   })
  //   storePositions(storedPositions)
  // }

  /**
   * 初期処理
   */
  useEffect(() => {
    setGraphData([].concat(wrapCytoscapeData(nodes), wrapCytoscapeData(edges)))
  }, [])

  useEffect(() => {
    console.log('[useEffect] START <filterTerm>')
    const groupNodesSetting = [...groupNodes]
    const systemNodesSetting = [...systemNodes]
    const appNodesSetting = [...appNodes]
    const groupFilteredSystemNodeSetting = systemNodesSetting.filter(sn => {
      sn.parent === filterTerm.group
    })
    const groupFilteredAppNodeSetting = groupFilteredSystemNodeSetting.filter(sn => {
      sn.parent === filterTerm.group
    })

    console.log('[useEffect] END <filterTerm>')
  }, [filterTerm.group, filterTerm.system, filterTerm.app])

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

  const handleNodeSpacing = (e: ChangeEvent<HTMLInputElement>) => {
    setNodeSpacing(Number(e.currentTarget.value))
  }

  function filterIfs(e: ChangeEvent<HTMLInputElement>, elType: string) {
    console.log('[e]', e)
    const elId: string = e.currentTarget.dataset.id
    // const elType: any = e.currentTarget.dataset.type
    console.log('[elId]', elId)
    console.log('[elType]', elType)
    if (elId && elType) {
      filterTerm[elType] = elId
    } else {
      filterTerm[elType] = ''
    }
    console.log(e.currentTarget)
    console.log(e.currentTarget.dataset.id)
    setFilterTerm(filterTerm)
    console.log('filterTerm', filterTerm)
    const selectedNode = e.currentTarget.value
    const filteredNodes = nodes.filter(node => true)

    // TODO: 選択されたnodes情報を基にCytoscape図をActiveにしたい
    // -----------------------------------------------------------------
    // console.log('[cy]', cy)
    // // cy.getElementById(elId).select()
    // const filterTerm = []
    // for (const key in Object.keys(filteredIfsTerm)) {
    //   const value = filteredIfsTerm[key]
    //   filterTerm.push(value)
    // }
    // // cy.nodes().forEach(node => {
    // //   node.unselect()
    // // })
    // filterTerm.forEach(value => {
    //   cy.getElementById(value).select()
    // })

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
    // -----------------------------------------------------------------

    console.log('[ifs]', ifs)
    // setFilteredNodes(filteredNodes)
    // const targetAppList = findTargetApp(elId)
    // console.log('[targetAppList]', targetAppList)
    // console.log('[edges]', edges)
    // setTargetAppList(targetAppList)
    // const filteredEdges = edges.filter((edgesInfo: any) => {
    //   return targetAppList.includes(edgesInfo.source) || targetAppList.includes(edgesInfo.target)
    // })
    // console.log('[filteredEdges]', filteredEdges)
    // const srcIfIdList = filteredEdges.map((edge: any) => edge.src_if_id)
    // const dstIfIdList = filteredEdges.map((edge: any) => edge.dst_if_id)
    // const ifFilterTerm = {
    //   srcIfIdList: srcIfIdList,
    //   dstIfIdList: dstIfIdList
    // }
    // setIfFilterTerm(ifFilterTerm)
    // const filteredIfs = ifs.filter((ifItem: any) => {
    //   return srcIfIdList.includes(ifItem.id) || dstIfIdList.includes(ifItem.id)
    // })
    // console.log('[filteredIfs]', filteredIfs)
    // setIfs(filteredIfs)
  }

  // function findTargetApp(elId: String) {
  //   let targetAppList = []
  //   nodes.forEach(node => {
  //     // console.log('[findTargetApp]', node)
  //     if (node.parent === elId) {
  //       if (node.type === 'app') {
  //         console.log('[findTargetApp]>app', elId)
  //         targetAppList.push(node.id)
  //       } else {
  //         console.log('[findTargetApp]>app以外 START', node.id, elId)
  //         targetAppList = targetAppList.concat(findTargetApp(node.id))
  //         console.log('[findTargetApp]>app以外 END', targetAppList, elId)
  //       }
  //     }
  //   })
  //   console.log('[findTargetApp]>targetAppList', targetAppList, elId)
  //   return targetAppList
  // }

  return (
    <>
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
                  setCy(cy)

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

                  // cy.on('grab', 'node', function (event) {
                  //   event.target.ungrabify()
                  // })

                  cy.nodes().forEach(function (node) {
                    // 配置されたnode位置を取得
                    // console.log(node.position())
                  })
                  const storedPositions = getStoredPositions()

                  // ノードのドラッグイベントでlocalStorageを更新
                  cy.on('dragfree', 'node', function (event) {
                    var node = event.target
                    storedPositions[node.id()] = node.position()
                    storePositions(storedPositions)
                  })

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
              />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default Cytoscape
