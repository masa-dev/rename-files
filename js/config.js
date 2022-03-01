let config = {
    sortType: 0,   //ソートの種別[最終更新日，サイズ，タイプ，名前]
    frontName: '', //番号の前に入る指定された名前
    startNumber: 0,    //開始番号
    threeDigitization: false,  // 三桁化
    noUnderscore: false,    //アンダースコア無し
    descendingOrder: false  //降順（デフォルトは昇順）
}

const LOCAL_STORAGE_ID = 'rename-files-config';

function saveConfigToLS() {
    getConfig();

    let configJson = JSON.stringify(config)
    localStorage.setItem(LOCAL_STORAGE_ID, configJson);
}

function fetchConfigToLS() {
    let configJson = localStorage.getItem(LOCAL_STORAGE_ID);

    if (configJson) {
        config = JSON.parse(configJson);
        setInputs();
    }
}

function getConfig() {
    config.sortType = document.getElementById('sort-type').value;
    config.frontName = document.getElementById('name-text').value;
    config.startNumber = parseInt(document.getElementById('start-number').value, 10);
    config.threeDigitization = document.getElementsByClassName('check')[0].checked;
    config.noUnderscore = document.getElementsByClassName('check')[1].checked;
    config.descendingOrder = document.getElementsByClassName('check')[2].checked;
}

function setInputs() {
    document.getElementById('sort-type').value = config.sortType;
    document.getElementById('name-text').value = config.frontName;
    document.getElementById('start-number').value = config.startNumber;
    document.getElementsByClassName('check')[0].checked = config.threeDigitization;
    document.getElementsByClassName('check')[1].checked = config.noUnderscore;
    document.getElementsByClassName('check')[2].checked = config.descendingOrder;
}