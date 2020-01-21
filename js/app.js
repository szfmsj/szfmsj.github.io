window.app = {};

window.allXhr = [];

app.renderErr404 = function () {
    setTimeout(function () {
        app.setTitle('404 找不到页面');
        document.querySelector('#js-realSceneContent').innerHTML = `<div>
            <div>
                <h1>404 找不到页面</h1>
                <p>无法找到页面。</p>
                <p>回到<a href="/?/home/">网站首页</a>？</p>
            </div>
        </div>`;
    }, 400);
};

app.setTitle = function (title) {
    document.title = `${title} — 三自飞面神教爱国会`
};

app.setHierarchyLocation = function (argv) {
    document.querySelector('#js-pageNavHierarchyLocation').innerHTML = `
        <span><a href="/">首页</a></span> /
    ` + argv.map(function (arg) {
        var $sample_arg = [
            'link',
            'dangjian'
        ];
        return ({
            link: `<span><a href="/?/${arg[1]}"></a></span>`,
            label: `<span>${arg[1]}</span>`
        })[arg[0]]
    }).join(' / ');
};

app.get = function (url, callback) {
    var xhr = new XMLHttpRequest();
    window.allXhr.push(xhr);
    xhr.open('GET', url);
    xhr.onload = function (e) {
        callback(e);
    };
    xhr.send();
};

app.scenes = {};

app.sceneRenderers = {
    'home': function () {},
    'dangjian': function () {
        app.get('/db/dangjian/list.json', function (e) {
            document.querySelector('#js-scene-dangjian-listOfArticles').innerHTML = JSON.parse(e.target.responseText).reverse().map(function (entry, index) {
                if (entry.t === '{{null}}') {
                    return '';
                } else {
                    return `<div class="articles-list-item">
                        <a class="articles-list-item-inner" href="/?/dangjian/${entry.i}">
                            <div class="articles-list-item-inner-title">
                                ${entry.t}
                            </div>
                            <div class="articles-list-item-inner-metadata">
                                <span class="articles-list-item-inner-metadata-date">
                                    ${(new Date(entry.d)).toISOString().replace('T', ' ').replace(/\d{2}:\d{2}:\d{2}\.\d{3}Z/, '')}
                                </span>
                            </div>
                        </a>
                    </div>`;
                };
            }).join('');
        });
    }
};

app.parseScene = function () {
    if (location.search === '') {
        location.replace('/?/home/');
    } else {
        app.scenesDict = [
            [ 'home', '网站首页' ],
            [ 'dangjian', '党建工作' ],
            [ 'xinxi', '信息公开' ],
            [ 'huodong', '宗教活动' ]
        ]
        window.currentScene = 'null';
        app.scenesDict.map(function (x) {
            if (location.search.indexOf(`?/${x[0]}/`) === 0) {
                window.currentScene = x;
            };
        });
        if (window.currentScene === 'null') {
            app.renderErr404();
        } else {
            app.setTitle(currentScene[1]);
            app.get(`/scenes/${currentScene[0]}.html`, function (e) {
                document.querySelector('#js-realSceneContent').innerHTML = e.target.responseText;
                setTimeout(app.sceneRenderers[currentScene[0]], 50);
            });
        }
    };
};

app.parseScene();
