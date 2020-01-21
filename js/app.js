window.app = {};

window.allXhr = [];

app.finallyShow = function () {
    document.querySelectorAll('.finallyShow').forEach(function (node) {
        node.style.opacity = '1';
    });
};

app.db = {};

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
        app.finallyShow();
    }, 5);
};

app.setTitle = function (title) {
    document.title = `${title} — 三自飞面神教爱国会`;
};

app.setHierarchyLocation = function (argv) {
    document.querySelector('#js-pageNavHierarchyLocation').innerHTML = `
        位置：<span><a href="/">首页</a></span> /
    ` + argv.map(function (arg) {
        var $sample_arg = [
            'link',
            'dangjian'
        ];
        var tmp = ({
            link: `<span><a href="/?/${arg[1]}/">${currentScene[1]}</a></span>`,
            label: `<span>${arg[1]}</span>`
        })[arg[0]];
        return tmp;
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

app.canvasRenderers = {
    '_articleListItem': function (scene, entry) {
        return `<div class="articles-list-item">
            <a class="articles-list-item-inner" href="/?/${scene}/${entry.i}">
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
    },
    'article_detail': function (argv) {
        console.log(argv);
        app.setHierarchyLocation(argv.hierarchyLocation);
        document.querySelector('#js-realSceneContent').innerHTML = `<div>
            <div>
                <h2>${app.db[argv.scene][argv.index].t}</h2>
            </div>
            <div style="padding: 0 0 30px;">
                <div class="articles-list-item-inner-metadata">
                    <div class="articles-list-item-inner-metadata-date">
                        ${(new Date(app.db[argv.scene][argv.index].d)).toISOString().replace('T', ' ').replace(/\d{2}:\d{2}:\d{2}\.\d{3}Z/, '')}
                    </div>
                </div>
            </div>
            <div id="js-articleFileContent">
            </div>
        </div>`;
        app.get(`/db/${argv.scene}/db/${argv.index}.html`, function (e) {
            document.querySelector('#js-articleFileContent').innerHTML = e.target.responseText;
            app.finallyShow();
        });
    },
    'home': function () {
        app.finallyShow();
    },
    'dangjian': function () {
        app.setHierarchyLocation([['label', '党建工作']]);
        app.renderInnerPage('dangjian');
    },
    'xinxi': function () {
        app.setHierarchyLocation([['label', '信息公开']]);
        app.finallyShow();
    },
    'huodong': function () {
        app.setHierarchyLocation([['label', '宗教活动']]);
        app.renderInnerPage('huodong');
    }
};

app.renderInnerPage = function (scene, isEinListPage) {
    app.get(`/db/${scene}/list.json`, function (e) {
        app.db[scene] = JSON.parse(e.target.responseText);
        var newRegExp = new RegExp(`^\\?\\/${scene}\\/(\\d+)$`);
        if (location.search.match(newRegExp)) {
            var matcher = parseInt(location.search.match(newRegExp)[1]);
            if (matcher >= app.db[scene].length) {
                app.renderErr404();
            } else {
                app.canvasRenderers['article_detail']({
                    index: matcher,
                    scene: scene,
                    hierarchyLocation: [['link', scene],['label',app.db[scene][matcher].t]]
                });
            }
        } else {
            document.querySelector('#js-scene-listOfArticles').innerHTML = JSON.parse(e.target.responseText).reverse().map(function (entry, index) {
                if (entry.t === '{{null}}') {
                    return '';
                } else {
                    return app.canvasRenderers['_articleListItem'](scene, entry);
                };
            }).join('');
            app.finallyShow();
        };
    });
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
                setTimeout(app.canvasRenderers[currentScene[0]], 50);
            });
        }
    };
};

app.parseScene();
