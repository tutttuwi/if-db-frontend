import { NextRequest, NextResponse } from 'next/server'

// export function GET(request: NextRequest): Response {
//   // GET /api/users リクエストの処理
//   const params = request.nextUrl.searchParams
//   const query = params.get('query')
//   return NextResponse.json(
//     { response: 'Test response.' },
//     {
//       status: 200, // ステータスコード
//       headers: {
//         // レスポンスヘッダー
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type, Authorization'
//       }
//     }
//   )
// }

// export async function POST(request: NextRequest): Response {
//   // POST /api/users リクエストの処理
//   const params = await request.json()
// }

export default function handler(req: NextRequest, res: NextResponse) {
  console.log(req.method)
  switch (req.method) {
    case 'GET':
      // res.headers.set('Access-Control-Allow-Origin', '*')
      // res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      // res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      // @ts-ignore
      res.status(200).json({ name: 'John hoge' })
      // return ''
      break

    default:
      break
  }
}
