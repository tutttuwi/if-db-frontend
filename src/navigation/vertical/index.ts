// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

import Group from 'mdi-material-ui/Group'
import PaletteSwatchVariant from 'mdi-material-ui/PaletteSwatchVariant'
import ApplicationBracesOutline from 'mdi-material-ui/ApplicationBracesOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'システム連携一覧',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'アカウント設定',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    {
      sectionTitle: 'システム設定'
    },
    {
      title: 'グループ一覧',
      icon: Group,
      path: '/pages/login',
      openInNewTab: true
    },
    {
      title: 'システム一覧',
      icon: PaletteSwatchVariant,
      path: '/pages/register',
      openInNewTab: true
    },
    {
      title: 'アプリ一覧',
      icon: ApplicationBracesOutline,
      path: '/pages/error',
      openInNewTab: true
    },
    {
      sectionTitle: 'User Interface'
    },
    {
      title: 'Typography',
      icon: FormatLetterCase,
      path: '/typography'
    },
    {
      title: 'Icons',
      path: '/icons',
      icon: GoogleCirclesExtended
    },
    {
      title: 'Cards',
      icon: CreditCardOutline,
      path: '/cards'
    },
    {
      title: 'Tables',
      icon: Table,
      path: '/tables'
    },
    {
      icon: CubeOutline,
      title: 'Form Layouts',
      path: '/form-layouts'
    }
  ]
}

export default navigation
