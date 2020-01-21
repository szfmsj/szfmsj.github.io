window.app = {};

var renderErr404 = function () {
    document.body.innerHTML = `<div>
        <div>
            <h1>404 Not Found</h1>
            <p>Cannot find the page.</p>
            <p>Go to <a href="/?/home/">Homepage</a>?</p>
        </div>
    </div>`;
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
        var totalScenes = [
            [ 'home', 'dangjian', 'xinxi', 'hudong' ];
        ];
        window.currentScene = 'null';
        totalScenes.map(function (x) {
            if (location.search.indexOf(`?/${x}/`) === 0) {
                window.currentScene = x;
            };
        });
        if (window.currentScene === 'null') {
            renderErr404();
        }
    };
};

app.parseScene();
