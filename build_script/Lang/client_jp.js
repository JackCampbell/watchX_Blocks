
var watchXBlocks = watchXBlocks || {};
watchXBlocks.LOCALISED_TEXT = {
  translationLanguage: "英語",
  title: "watchX Blocks",
  blocks: "ブロック",
  /* メニュー */
  new: "新",
  open: "オーペン",
  save: "保存",
  saveAs: "別名で保存",
  exportArduinoSketch: "Arduinoのスケッチとしてエクスポート",
  deleteAll: "すべて削除",
  settings: "設定",
  documentation: "ドキュメンテーション",
  reportBug: "バグを報告する",
  examples: "例題",
  about: 'について,
  /* 設定 */
  compilerLocation: "コンパイラ",
  compilerLocationDefault: "コンパイラアンノウン",
  sketchFolder: "スケッチフォルダ",
  sketchFolderDefault: "スケッチフォルダアンノウン",
  arduinoBoard: "Arduinoボード",
  arduinoBoardDefault: "Arduinoボードアンノウン",
  comPort: "COMポート",
  comPortDefault: "COMポートアンノウン",
  defaultIdeButton: "デフォルトIDEボタン",
  defaultIdeButtonDefault: "IDEオプションアンノウン",
  language: "言語",
  languageDefault: "言語アンノウン",
  sketchName: "スケッチ名",
  /* Arduinoンソール出力*/
  arduinoOpMainTitle: "コミュニケーションメッセージ",
  arduinoOpWaiting: "IDE出力待ち",
  arduinoOpUploadedTitle: "スケッチのアップロードが完了しました。",
  arduinoOpVerifiedTitle: "スケッチの検証に成功しました。",
  arduinoOpProcess: "アップロードが成功です。",
  arduinoOpOpenedTitle: "スケッチはIDEで開きます。",
  arduinoOpOpenedBody: "スケッチがArduino IDEに読み込まれている必要があります。.",
  arduinoOpErrorTitle: "エラーが発生しました。",
  arduinoOpErrorIdContext_0: "エラーなし.",
  arduinoOpErrorIdContext_1: "ビルド又はアップロードに失敗しました。",
  arduinoOpErrorIdContext_2: "スケッチが存在しません。",
  arduinoOpErrorIdContext_3: "コマンドラインの引数が無効です。",
  arduinoOpErrorIdContext_4: "'get-pref'フラグに渡されたプリファレンスが存在しません。",
  arduinoOpErrorIdContext_5: "明確ではありませんが、Arduino IDEがこの問題でエラーになることがあります。",
  arduinoOpErrorIdContext_50: "Arduino IDEからの予期しないエラーコード",
  arduinoOpErrorIdContext_51: "スケッチファイルを作成できませんでした。",
  arduinoOpErrorIdContext_52: "内部で作成されたスケッチファイルのパスが無効です。",
  arduinoOpErrorIdContext_53: "Arduino IDEが見つかりません。<br>" +
                              "コンパイラーのディレクトリが正しく設定されていません。<br>" +
                              "設定からパスが正しいことを確認してください。",
  arduinoOpErrorIdContext_54: "スケッチはどうすればいいですか？<br>" +
                              "IDEの起動オプションが設定されていません。<br>" +
                              "設定からIDEを選択してください。.",
  arduinoOpErrorIdContext_55: "シリアルポートの利用不可<br>" +
                              "シリアルポートにアクセスできません。<br>" +
                              "Arduinoがコンピューターに正しく接続されているか確認し、設定から「シリアルポート」を選択してください。",
  arduinoOpErrorIdContext_56: "不明なArduinoボード<br>" +
                              "Arduino Boardは設定されていません。<br>" +
                              "設定から適切なArduinoボードを選択してください。",
  arduinoOpErrorIdContext_57: "予期しないサーバーエラー",
  arduinoOpErrorIdContext_64: "JSON解析に失敗しました。",
  arduinoOpErrorUnknown: "予期しないサーバーエラー",
  /* モーダル */
  noServerTitle: "watchX Blocksアプリが起動していません。",
  noServerTitleBody: '<p>watchX Blocksのすべての機能を有効にするには、お使いのコンピュータでwatchX Blocksデスクトップアプリケーションがローカルに起動している必要があります。</p>' +
                     '<p>オンライン版をご利用の場合は、設定を行ったり、ブロックコードをArduinoに読み込んだりすることはできません。</p>' +
                     '<p>インストール方法は、<a target="_blank" href="https://github.com/argeX-official/watchX_Blocks">watchX Blocksのリポジトリに記載されています</a>.</p>' +
                     '<p>watchX Blocksがインストールされている場合は、アプリケーションが正常に動作しているか確認してください。.</p>',
  noServerNoLangBody: "watchX Blocksアプリケーションが動作していない場合、言語を完全に変更することはできません。",
  addBlocksTitle: "追加ブロック",
  aboutTitle: 'について',
  aboutHeader: '<h4 id="watchx-blocks-is-a-visual-coding-editor-for-watchx"><strong>watchX Blocks is a visual coding editor<br/>for watchX</strong></h4>',
  aboutBody:
    '<span>Contact: <a target="_blank" href="mainto:info@argex.io">info@argex.io</a></span>\n' +
    '<p>watchX®およびargeX®の名称とロゴは、argeX Inc.の商標です。<br/>' +
      '<span><a target="_blank" href="http://argex.io">www.argex.io</a></span></p>\n' +
    '<h4 id="credits"><strong>Credits</strong></h4>\n' +
    '<p>This project has been forked directly from Carlos Pereira Atencio\'s <a target="_blank" href="https://github.com/carlosperate/ardublockly">Ardublockly</a><br/>and developed further on by the argeX team.</p>\n' +
    '<h5>argeX team is;</h5>\n' +
      '<p>Battal Fırat ÖZDEMİR<br/> <em>フルスタックデベロッパー</em></p>' +
      '<p>Enes ÇALDIR<br/> <em>ロゴ、ブランディング、UI、ブロック辞書、ドキュメント</em></p>' +
      '<p>Mustafa TÜLÜ<br/> <em>watchXの新しいブロックの統合</em></p>' +
      '<p>Hande KOÇHAN<br/> <em>アストロボーイのデッサン</em></p>' +
      '<p>Gökhan SELAMET<br/> <em>テストとバグレポート</em></p>' +
    '<h5>watchX Blocksに使用されているオープンソース・ソフトウェアのリスト;</h5>' +
      '<p>' +
      '<a target="_blank" href="https://github.com/arduino/arduino-cli">Arduino CLI</a> by <a target="_blank" href="https://www.arduino.cc/">Arduino</a> is used under <a target="_blank" href="https://github.com/arduino/arduino-cli/blob/master/LICENSE.txt">GPL V3.0 License</a><br/>' +
      '<a target="_blank" href="https://github.com/google/blockly">Blockly</a> by <a target="_blank" href="https://opensource.google/">Google</a> is used under <a target="_blank" href="https://github.com/google/blockly/blob/master/LICENSE">Apache V2.0 License</a><br/>' +
      '<a target="_blank" href="https://github.com/google/closure-library">Closure Library</a> by <a target="_blank" href="https://opensource.google/">Google</a> is used under <a target="_blank" href="https://github.com/google/closure-library/blob/master/LICENSE">Apache V2.0 License</a><br/>' +
      '<a target="_blank" href="https://github.com/BlocklyDuino/BlocklyDuino">BlocklyDuino</a> by <a target="_blank" href="https://github.com/gasolin">Fred LIN</a> is used under <a target="_blank" href="http://www.apache.org/licenses/LICENSE-2.0">Apache V2.0 License</a><br/>' +
      '<a target="_blank" href="https://github.com/carlosperate/ardublockly">Ardublockly</a> by <a target="_blank" href="https://github.com/carlosperate">Carlos Pereira ATENCIO</a> is used under <a target="_blank" href="https://github.com/carlosperate/ardublockly/blob/master/LICENSE">Apache V2.0 License</a><br/>' +
      '<a target="_blank" href="https://github.com/electron/electron">Electron</a> is used under <a target="_blank" href="https://github.com/electron/electron/blob/main/LICENSE">MIT License</a><br/>' +
      '<a target="_blank" href="https://github.com/expressjs/express">Express JS</a> is used under <a target="_blank" href="https://github.com/expressjs/express/blob/master/LICENSE">MIT License</a><br/>' +
      '</p>' +
    '<h4 id="license"><strong>License</strong></h4>\n' +
    '<p>Copyright (C) 2021 <a target="_blank" href="http://argex.io/">argeX Inc.</a></p>\n' +
    '<p>このプログラムはフリーソフトウェアです。Free Software Foundationが発行したGNU General Public Licenseのバージョン3、または（あなたの選択により）それ以降のバージョンのいずれかの条件の下で、再配布または変更することができます。</p>\n' +
    '<p>この文書の全文は <a target="_blank" href="https://github.com/argeX-official/watchX_Blocks/blob/master/LICENSE.txt">LICENSE</a> file.</p>\n' +
    '<p>このプログラムは、有用であることを期待して配布されていますが、商品性や特定目的への適合性の暗黙の保証も含めて、いかなる保証もありません。</p>\n',


  close: 'クローズ',
  /* アラート */
  loadNewBlocksTitle: "新しいブロックの読み込みしますか？",
  loadNewBlocksBody: "新しいXMLファイルを読み込むと、ワークスペースの現在のブロックが置き換えられます。<br>" +
                     "続行しますか？",
  discardBlocksTitle: "ブロックを削除しますか？",
  discardBlocksBody: "ワークスペースに %1 ブロックがあります。<br>" +
                     "すべてを削除しますか？",
  invalidXmlTitle: "無効なXML",
  invalidXmlBody: "XMLファイルのブロックへの解析がうまくいきませんでした。XMLコードを確認して、再度お試しください。",
  /* Tooltips */
  uploadingSketch: "スケッチをwatchXにアップロードします。",
  uploadSketch: "スケッチをwatchXにアップロードする",
  verifyingSketch: "スケッチの検証.",
  verifySketch: "スケッチを検証する",
  openingSketch: "Arduino IDEでスケッチを開きます。",
  openSketch: "Arduino IDEでスケッチを開く",
  notImplemented: "機能は実装されていません。",
  /* プロンプト */
  ok: "OK",
  okay: "オーケー",
  cancel: "キャンセル",
  return: "リターン",
  /* カード*/
  arduinoSourceCode: "Arduinoソースコード",
  blocksXml: "ブロック XML",
  /* ツールボックスカテゴリー*/
  catLogic: "ロジック",
  catLoops: "ループ",
  catMath: "マス",
  catText: " テキスト",
  catVariables: "変数",
  catFunctions: "ファンクション",
  catInputOutput: "入力／出力",
  catTime: "タイム",
  catAudio: "オーディオ",
  catMotors: "モーター",
  catComms: "コミュニケーション",
  catDisplay: "ディスプレイ",
  catDraw: "ドロー",
  catSensors: "センサー",
  catBattery: "バッテリー",
  catUSB: "USB",
  catSleep: "スリープ",
  catBluetooth: "ブルートゥース ",
  version: 'バージョン',
  watchx_source_code: '<a target="_blank" href="https://github.com/argeX-official/watchX_Blocks">source code</a>',
  argex_team: '<h5>argeX Team</h5>',
  watch_faces: 'ウォッチフェイス',
  games: 'ゲーム',
  learning_center: '学習センター',
  example_blink: 'ブリンク',
  example_blink_desc: 'by argeX',
  example_hello_world: 'ハロー・ワールド',
  example_hello_world_desc: 'by argeX',
  example_button_counter: 'ボタンカウンター',
  example_button_counter_desc: 'by argeX',
  example_drawing_lines: 'ドローイングの線',
  example_drawing_lines_desc: 'by argeX',
  example_sensor_movement: 'モーションセンサー',
  example_sensor_movement_desc: 'by argeX',
  example_sensor_temp_and_press: 'センサーPRS温度',
  example_sensor_temp_and_press_desc: 'by argeX',
  example_move_the_dot: 'ドット移動',
  example_move_the_dot_desc: 'by argeX',
  example_siren: 'サイレン',
  example_siren_desc: 'by argeX',
  example_watch_face: 'ウォッチフェイス',
  example_watch_face_desc: 'by argeX',
  example_bounce: 'バウンス',
  example_bounce_desc: 'by argeX',
  dictionary: 'ディクショナリ',
  game_source_code: 'ソースコード',
  playable_without_gpad: 'playable without<br/>G-Pad Accessory'
};