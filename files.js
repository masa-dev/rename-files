//ファイル情報のクラス
class singleFileInfo {
    constructor(number, name, lastModified, size, type) {
        this.number = number;
        this.name = name;
        this.lastModified = lastModified;
        this.size = size;
        this.type = type;
    }
}

//数字を三桁にする関数
function threeDigits(value, i) {
    if(value ==true) {
        if(i == 0) {
            return '000';
        }
        else if(i < 10) {
            return '00'+i;
        }
        else if(i <100) {
            return '0'+i;
        }
        else {
            return i;
        }
    }
    else if(value == false){
        return i;
    }
}

//メインコード
let fileArea = document.getElementById('dragDropArea');
let fileInput = document.getElementById('fileInput');
let btn = document.getElementById('execute');
let files;  //画像ファイルを格納する変数

fileArea.addEventListener('dragover', function(evt){
    evt.preventDefault();
    fileArea.classList.add('dragover');
});
fileArea.addEventListener('dragleave', function(evt){
    evt.preventDefault();
    fileArea.classList.remove('dragover');
});

fileArea.addEventListener('drop', function(evt){
    evt.preventDefault();
    fileArea.classList.remove('dragenter');
    //このfilesに画像データが入る
    files = evt.dataTransfer.files;
    fileInput.files = files;
});

btn.addEventListener('click', function() {
    //ファイルが選択されていないとき
    if(files == null) {
        if(document.getElementById('fileInput').files[0] == null){
            return;
        }
        else{
            files = document.getElementById('fileInput').files;
        }
    }
    
    let sortType = document.getElementById('sort-type').value;
    let fileName = document.getElementById('name-text');
    let checkBox = document.getElementsByClassName('check');//[0]が三桁の数字化, [1]がアンダースコアなし, [2]が降順
    let underScore = '_';
    //アンダースコアを入れない処理
    if(checkBox[1].checked){
        underScore = '';
    }

    let fileInfo = [];
    //初期化
    for(let i = 0; i < files.length; i++) {
        fileInfo[i] = new singleFileInfo(i, files[i].name, files[i].lastModified, files[i].size, files[i].type);
    }

    //sortTypeでソート
    //checkBoxで降順が指定されている場合とどうかで処理を分ける
    if(checkBox[2].checked == true) {
        //降順
        fileInfo.sort(function(a, b) {
            if (a[sortType] < b[sortType]) {    //プロパティとして変数の値を読むためにブラケット演算子を使う
                return 1;
            } else {
                return -1;
            }
        });
    }
    else if(checkBox[2].checked == false) {
        //昇順
        fileInfo.sort(function(a, b) {
            if (a[sortType] > b[sortType]) {    //変数の値を読むためにブラケット演算子を使う
                return 1;
            } else {
                return -1;
            }
        });
    }

    //zipでダウンロード
    let zip = new JSZip();
    let num;    //ファイルの番号
    for(let i = 0; i < files.length; i++) {
        //番号を三桁にする処理をする
        num = threeDigits(checkBox[0].checked, i);
        if(files[i].type == 'image/png') {
            zip.file(fileName.value + underScore + num + '.png', files[fileInfo[i].number], {base64: true});
        }
        else if(files[i].type == 'image/jpeg') {
            zip.file(fileName.value + underScore + num + '.jpg', files[fileInfo[i].number], {base64: true});
        }
    }
    //zipファイル作成
    zip.generateAsync({type:'blob'}).then(function(content) {
        //see FileSaver.js
        saveAs(content, 'images.zip');
    });
}, false);
