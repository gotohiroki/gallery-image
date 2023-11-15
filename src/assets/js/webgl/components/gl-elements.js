export default class GLElements {
  constructor(targetElArray) {
    this.targetElArray = targetElArray;

    // GLElements クラス内で Three.js の要素に関する情報を格納するためのプロパティ optionList を初期化します。
    // この配列は要素ごとにオブジェクトを持ち、要素の寸法や位置、画像のパスなどの情報を保持します。
    this.optionList = [];
  }

  init() {
    this._initOptionlist();
  }

  // init メソッドから呼び出され、targetElArray 内の各要素に関する情報を optionList に初期化します。
  _initOptionlist() {
    for( let i = 0; i < this.targetElArray.length; i++ ) {
      
      const target = this.targetElArray[i];
      // 要素の位置や寸法に関する情報を取得します。
      const rect = target.getBoundingClientRect(); 

      // optionList 配列に新しいオブジェクトを作成し、その中に要素に関する情報を格納するためのプロパティを追加します。
      this.optionList[i] = {};
      this.optionList[i].width = rect.width;
      this.optionList[i].height = rect.height;
      this.optionList[i].top = rect.top;
      this.optionList[i].left = rect.left;

      // 
      const imagePatch = target.querySelector('img').src;
      this.optionList[i].img = imagePatch;
    }
  }

  // optionList を更新するメソッドです。
  _updateOptionList() {
    for( let i = 0; i < this.targetElArray.length; i++ ) {
      const rect = this.targetElArray[i].getBoundingClientRect();

      this.optionList[i].width = rect.width;
      this.optionList[i].height = rect.height;
      this.optionList[i].top = rect.top;
      this.optionList[i].left = rect.left;
    }
  }
}