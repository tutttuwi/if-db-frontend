import React, { useState, ChangeEvent } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { ElementDefinition } from 'cytoscape'
import cys from 'cytoscape'
/**@ts-ignore */
import cola from 'cytoscape-cola'
import Link from 'next/link'
cys.use(cola)

function Cytoscape() {
  const [width, setWith] = useState('100%')
  const [height, setHeight] = useState('70vh')
  const [base64png, setBase64png] = useState('')
  const [nodeSpacing, setNodeSpacing] = useState(50)
  const [graphData, setGraphData] = useState({
    nodes: [
      { data: { id: 's1', label: 'uketsuke', type: 'system' } },
      { data: { id: 's2', label: 'api', type: 'system' } },
      { data: { id: 's3', label: 'kikan', type: 'system' } },
      { data: { id: 's4', label: 'subsys', type: 'system' } },

      { data: { id: 'a1', label: 'customer-web', type: 'app', parent: 's1' } },
      { data: { id: 'a2', label: 'tempo-web', type: 'app', parent: 's1' } },
      { data: { id: 'a3', label: 'app-web', type: 'app', parent: 's1' } },
      { data: { id: 'a4', label: 'com-api', type: 'app', parent: 's2' } },
      { data: { id: 'a5', label: 'sys-api', type: 'app', parent: 's2' } },
      { data: { id: 'a6', label: 'tasha-api', type: 'app', parent: 's2' } },
      { data: { id: 'a7', label: 'flow', type: 'app', parent: 's3' } },
      { data: { id: 'a8', label: 'db', type: 'app', parent: 's3' } },
      { data: { id: 'a9', label: 'db-2', type: 'app', parent: 's3' } },
      { data: { id: 'a10', label: 'yuso', type: 'app', parent: 's4' } },
      { data: { id: 'a11', label: 'tasha', type: 'app', parent: 's4' } },
      { data: { id: 'a12', label: 'mail', type: 'app', parent: 's4' } }
    ],
    edges: [
      { data: { source: 'a1', target: 'a4', label: 'i1' } },
      { data: { source: 'a2', target: 'a5', label: 'i3' } },
      { data: { source: 'a3', target: 'a4', label: 'i1' } },
      { data: { source: 'a4', target: 'a8', label: 'i2' } },
      { data: { source: 'a1', target: 'a10', label: 'i4' } },
      { data: { source: 'a3', target: 'a10', label: 'i4' } },
      { data: { source: 'a2', target: 'a11', label: 'i5' } },
      { data: { source: 'a5', target: 'a9', label: 'i6' } },
      { data: { source: 'a2', target: 'a7', label: 'i7' } }
    ]
  })

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
      selector: "node[type='device']",
      style: {
        shape: 'barrel '
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
      selector: 'edge',
      style: {
        width: 3,
        // "line-color": "#6774cb",
        'line-color': '#AAD8FF',
        'target-arrow-color': '#6774cb',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
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
        width: 5,
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

  return (
    <>
      <div>
        <h1>システム連携一覧</h1>
        {/* TODO: ノードスペーシングおしゃれにする */}
        <input type='number' value={nodeSpacing} onChange={handleNodeSpacing} />
        {/* TODO: ダウンロードボタン実装 */}
        {/* <a download='system-if.png' href={`${base64png}`} id='download'>
          ダウンロード
        </a> */}
        <div id='popup' className='popup'></div>
        <div
          style={{
            border: '1px solid',
            backgroundColor: '#f5f6fe'
          }}
        >
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

              cy.on('mouseover', evt => {
                console.log('mouseover.evt', evt)
                console.log('mouseover.evt.target', evt.target)
                var node = evt.target
                console.log(node)
                var position = evt.position
                console.log('position', position)
                var data = node.data()
                if (popup && position && data.id) {
                  popup.style.display = 'block'
                  // canvasの左上に付ける
                  // popup.style.left = position.x + 200 + 'px'
                  // popup.style.top = position.y + 50 + 'px'
                  popup.innerHTML = 'ID: ' + data.id + '<br>Name: ' + data.name + '<br>Info: ' + data.info
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
                console.log('EVT.cy._private', '')
                // console.log('cy.nodes', cy.nodes())
                // cy.nodes()[0].active()
                // console.log('TARGET', node.data())
                // console.log('TARGET TYPE', typeof node[0])
                // var png64 = cy.png()
                // setBase64png(png64)
                const filterCy = cy.filter(function (element, i) {
                  console.log('filter', element)
                  return false
                  // return element.isNode() && element.data('weight') > 50
                })
                console.log(filterCy)
                cy.data(filterCy)
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
        </div>
      </div>
    </>
  )
}

export default Cytoscape
