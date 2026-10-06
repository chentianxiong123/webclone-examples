window.abclite_extra_script_entry_2060 = function () {

    var fn = window.abclite_extra_script_entry_2060;

    if (fn._init) {
        return;
    }
    fn._init = true;
    var preTimestamp = 0;
    function isUrlHit() {
        var hostname = location.hostname;
        return hostname === 'fanyi.baidu.com';
    }
    function clickEvent() {
        var curTimestamp = +new Date();
        if (
            curTimestamp - preTimestamp > 1000 * 10 &&
            isUrlHit() &&
            window.BCat_2060 &&
            typeof window.BCat_2060.dr5 === 'function'
        ) {
            preTimestamp = curTimestamp;
            setTimeout(function () {
                window.BCat_2060.dr5({
                    subid: 'translate'
                });
            }, 1000);
        }
    }
    var btn = document.body.querySelector('#translate-button');
    if (btn) {
        btn.addEventListener('click', clickEvent);
    }
    var textarea = document.body.querySelector('#baidu_translate_input');
    var onChange = debounce(clickEvent);
    function debounce (fn) {
        var timer;
        return function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function() {
                fn.apply(this, arguments);
                timer = null;
            }, 1000);
        };
    };
    if (textarea) {
        textarea.addEventListener('keyup', onChange);
        textarea.addEventListener('change', onChange);
    }
    var mTextarea = document.body.querySelector('#j-textarea');
    if (mTextarea) {
        mTextarea.addEventListener('keyup', onChange);
        mTextarea.addEventListener('change', onChange);
    }
}


