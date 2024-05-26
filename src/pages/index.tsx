// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'

import Cytoscape from 'src/views/dashboard/Cytoscape'
// import React from 'react'
// import CytoscapeComponent from 'react-cytoscapejs'
// import { ElementDefinition } from 'cytoscape'

const Dashboard = () => {
  // const nodesLength = 10
  // let elements: ElementDefinition[] = []
  // for (let i = 0; i < nodesLength; i++) {
  //   elements.push({ data: { id: String(i), label: 'Node ' + i } })
  // }
  // for (let l = 0; l < nodesLength; l++) {
  //   for (let r = 0; r < nodesLength; r++) {
  //     elements.push({ data: { source: l, target: r, label: 'Edge from ' + l + ' to ' + r } })
  //   }
  // }
  // const layout1 = { name: 'random' }
  // const layout2 = { name: 'grid' }
  // const layout3 = { name: 'circle' }
  // const layout4 = { name: 'concentric' }
  // const layout5 = { name: 'breadthfirst' }
  // const layout6 = { name: 'cose' }
  // return (
  //   <div>
  //     <h1>自動レイアウトしたグラフ</h1>
  //     random
  //     <CytoscapeComponent elements={elements} layout={layout1} style={{ width: '300px', height: '300px' }} />
  //     grid
  //     <CytoscapeComponent elements={elements} layout={layout2} style={{ width: '300px', height: '300px' }} />
  //     circle
  //     <CytoscapeComponent elements={elements} layout={layout3} style={{ width: '300px', height: '300px' }} />
  //     concentric
  //     <CytoscapeComponent elements={elements} layout={layout4} style={{ width: '300px', height: '300px' }} />
  //     breadthfirst
  //     <CytoscapeComponent elements={elements} layout={layout5} style={{ width: '300px', height: '300px' }} />
  //     cose
  //     <CytoscapeComponent elements={elements} layout={layout6} style={{ width: '300px', height: '300px' }} />
  //   </div>
  // )
  return (
    // <ApexChartWrapper>
    //   <Grid container spacing={6}>
    //     <Grid item xs={12} md={4}>
    //       <Trophy />
    //     </Grid>
    //     <Grid item xs={12} md={8}>
    //       <StatisticsCard />
    //     </Grid>
    //     <Grid item xs={12} md={6} lg={4}>
    //       <WeeklyOverview />
    //     </Grid>
    //     <Grid item xs={12} md={6} lg={4}>
    //       <TotalEarning />
    //     </Grid>
    //     <Grid item xs={12} md={6} lg={4}>
    //       <Grid container spacing={6}>
    //         <Grid item xs={6}>
    //           <CardStatisticsVerticalComponent
    //             stats='$25.6k'
    //             icon={<Poll />}
    //             color='success'
    //             trendNumber='+42%'
    //             title='Total Profit'
    //             subtitle='Weekly Profit'
    //           />
    //         </Grid>
    //         <Grid item xs={6}>
    //           <CardStatisticsVerticalComponent
    //             stats='$78'
    //             title='Refunds'
    //             trend='negative'
    //             color='secondary'
    //             trendNumber='-15%'
    //             subtitle='Past Month'
    //             icon={<CurrencyUsd />}
    //           />
    //         </Grid>
    //         <Grid item xs={6}>
    //           <CardStatisticsVerticalComponent
    //             stats='862'
    //             trend='negative'
    //             trendNumber='-18%'
    //             title='New Project'
    //             subtitle='Yearly Project'
    //             icon={<BriefcaseVariantOutline />}
    //           />
    //         </Grid>
    //         <Grid item xs={6}>
    //           <CardStatisticsVerticalComponent
    //             stats='15'
    //             color='warning'
    //             trend='negative'
    //             trendNumber='-18%'
    //             subtitle='Last Week'
    //             title='Sales Queries'
    //             icon={<HelpCircleOutline />}
    //           />
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //     <Grid item xs={12} md={6} lg={4}>
    //       <SalesByCountries />
    //     </Grid>
    //     <Grid item xs={12} md={12} lg={8}>
    //       <DepositWithdraw />
    //     </Grid>
    //     <Grid item xs={12}>
    //       <Table />
    //     </Grid>
    //   </Grid>
    // </ApexChartWrapper>
    <Cytoscape />
  )
}

export default Dashboard
