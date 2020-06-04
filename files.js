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

function numberReplacer(match) {
    let num = match;
    const numLength = String(match).length;
    for(let i = 0; i < 20-numLength; i++) {
        num = '0' + num;
    }
    return num;
}

//メインコード
let fileArea = document.getElementById('drag-drop-area');
let fileInput = document.getElementById('file-input');
let btn = document.getElementById('execute');
let droppedFiles;  //画像ファイルを格納する変数

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
    //このdroppedFilesに画像データが入る
    droppedFiles = evt.dataTransfer.files;
    fileInput.files = droppedFiles;
});

btn.addEventListener('click', function() {
    let tempFiles;
    //ファイルが選択されていないとき
    if(droppedFiles == null) {
        if(document.getElementById('file-input').files[0] == null){
            window.alert('ファイルが選択されていません');
            return;
        }
        else{
            tempFiles = document.getElementById('file-input').files;
        }
    }
    else {
        tempFiles = droppedFiles;
    }

    let sortType = document.getElementById('sort-type').value;
    let fileName = document.getElementById('name-text').value;
    let startNum = document.getElementById('start-number').value;
    let checkBox = document.getElementsByClassName('check');//[0]が三桁の数字化, [1]がアンダースコアなし, [2]が降順
    let underScore = '_';
    //アンダースコアを入れない処理
    if(checkBox[1].checked){
        underScore = '';
    }

    let fileInfo = [];
    //初期化
    for(let i = 0; i < tempFiles.length; i++) {
        fileInfo[i] = new singleFileInfo(i, tempFiles[i].name, tempFiles[i].lastModified, tempFiles[i].size, tempFiles[i].type);
    }

    for(let i = 0; i < fileInfo.length; i++) {
        fileInfo[i].name = fileInfo[i].name.replace(/[0-9]+/g, numberReplacer);
        fileInfo[i].name = fileInfo[i].name.replace(/(.png|.jpg|.jpg)/g, '');
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
    for(let i = 0; i < tempFiles.length; i++) {
        //番号を三桁にする処理をする
        num = parseInt(i,10) + parseInt(startNum,10);
        num = threeDigits(checkBox[0].checked, num);
        if(fileInfo[i].type == 'image/png') {
            zip.file(fileName + underScore + num + '.png', tempFiles[fileInfo[i].number], {base64: true});
        }
        else if(fileInfo[i].type == 'image/jpeg') {
            zip.file(fileName + underScore + num + '.jpg', tempFiles[fileInfo[i].number], {base64: true});
        }
    }
    //zipファイル作成
    zip.generateAsync({type:'blob'}).then(function(content) {
        //see FileSaver.js
        saveAs(content, 'images.zip');
    });
}, false);