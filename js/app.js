window.app = {};

var renderErr404 = function () {
    setTimeout(function () {
        document.querySelector('#js-realSceneContent').innerHTML = `<div>
            <div>
                <h1>404 找不到页面</h1>
                <p>无法找到页面。</p>
                <p>回到<a href="/?/home/">网站首页</a>？</p>
            </div>
        </div>`;
    }, 400);
};

app.get = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function (e) {
        callback(e);
    };
    xhr.send();
};

app.scenes = {};

app.scenes.home = {};

app.parseScene = function () {
    if (location.search === '') {
        location.replace('/?/home/');
    } else {
        var totalScenes = [ 'home', 'dangjian', 'xinxi', 'huodong' ];
        window.currentScene = 'null';
        totalScenes.map(function (x) {
            if (location.search.indexOf(`?/${x}/`) === 0) {
                window.currentScene = x;
            };
        });
        if (window.currentScene === 'null') {
            renderErr404();
        } else {
            app.get(`/scenes/${currentScene}.html`, function (e) {
                document.querySelector('#js-realSceneContent').innerHTML = e.target.responseText;
            });
        }
    };
};

app.parseScene();
