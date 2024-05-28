const gulp = require('gulp')

// MEMO: 暫定対応Cytoscapejsが動かないためパッケージJSONを上書き
// TODO: 恒久としてはnext.jsのバージョンを上げて読み替えができるようにする必要がある
function overrideReactCytoscapejsPackagejson() {
  return gulp
    .src('./custom-settings/node_modules__react-cytoscapejs/package.json') // コピー元のファイル/ディレクトリ
    .pipe(gulp.dest('./node_modules/react-cytoscapejs')) // コピー先のディレクトリ
}

// デフォルトタスクにコピータスクを追加
exports.overCytoPack = overrideReactCytoscapejsPackagejson
