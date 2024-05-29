/** MEMO:process.env.xxx の型定義のため作成 */
/** @see <https://stackoverflow.com/questions/45194598/using-process-env-in-typescript> */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SECRET_KEY: string
      NODE_ENV: 'development' | 'production'
      DB_API_KEY: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
