/*!
 vertical overflow area easing scroll
 @uri: https://github.com/artprojectteam/jquery.verticalScroller
 @use: jQuery

 Copyright (c) 2016 Nobuyuki Kondo All Rights Reserved.
 This software is released under the MIT License, see LICENSE
 */
const FR = (function (ua) {
  let div = $('<div>Test</div>');
  $('body').append(div);
  div.css(
    {
      'transform' : "translate3d(20px,0,0)",
      '-webkit-transform' : "translate3d(20px,0,0)"
    });
  let is3dSupport = (div.offset().left == 20);
  div.empty().remove();
  
  let is_msie = (ua.indexOf('msie') > 0 || ua.indexOf('trident/7') > 0 || ua.indexOf('applewebkit') > 0 && ua.indexOf('edge') > 0) && ua.indexOf('chrome') === 0 && ua.indexOf('safari') === 0;
  let isFirefox = ua.indexOf('firefox') > 0;

  return {
    WHEEL: 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll',
    isTranslate3d: is3dSupport,
    isIE: is_msie,
    isFirefox: isFirefox
  }
})(window.navigator.userAgent.toLowerCase());

if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  }
}


export default class verticalScroller {
  constructor(ops) {
    let default_setting = {
      wrapper: '.wrapper',
      container: '.container',
      duration: 0.3,
      cssEasing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
      jsEasing: 'linear'
    };

    this.OLD_W = 0;
    this.OPTION = $.extend({}, default_setting, ops);
    this.CONTENTS = this.init();

    // イベントのネームスペースを作成
    let _name = this.OPTION.wrapper.replace(/\.|#/, '');
    this.NAMESPACE = `.${_name}_swipe_${Date.now()}`;

    this.update();
    this.onSwipe();
    this.onWheel();
  }


  /**
   * Initialize
   * @returns {Array}
   */
  init() {
    let target = $(this.OPTION.wrapper),
      res = [];

    target.removeAttr('data-vs-num').removeData('vsNum');

    for (let i = 0, iLen = target.length; i < iLen; i++) {
      let obj = target.eq(i),
        temp = {
          wrapperH: 0,
          containerH: 0,
          scrollFlg: false,
          y: 0,
          timer: false
        };

      obj.attr('data-vs-num', i);
      res.push(temp);
    }

    return res;
  }

  /**
   * 高さやフラグのセット
   * 領域のアップデート
   */
  update() {
    let w = document.documentElement.clientWidth || document.body.clientWidth,
      WRP = $(this.OPTION.wrapper);

    for (let i = 0, iLen = this.CONTENTS.length; i < iLen; i++) {
      let obj = this.CONTENTS[i],
        wrapper = WRP.eq(i),
        container = wrapper.find(this.OPTION.container),
        _tempWrapperH = wrapper.innerHeight(),
        _tempContainerH = container.outerHeight(true);

      obj.wrapperH = _tempWrapperH;
      obj.containerH = _tempContainerH;
      obj.scrollFlg = _tempContainerH > _tempWrapperH;
      obj.vsNum = wrapper.data('vsNum');

      // ブラウザサイズが変わった場合はアニメーションを消す(リサイズイージングを発火させない)
      if (w !== this.OLD_W) {
        obj.y = 0;
        container.attr('style', '');
      }

      // スクロールフラグがfalseかつ要素位置が変更になっている場合は強制的に0にする
      if (!obj.scrollFlg && obj.y !== 0){
        if (!!FR.isTranslate3d && !FR.isIE){
          this.goCSS(container, 0, this.OPTION.duration);
        }else{
          this.goAnimate(container, 0, this.OPTION.jsEasing, this.OPTION.duration);
        }
      }

      this.OLD_W = w;
    }
  }


  /**
   * Swipe Event
   */
  onSwipe() {
    let _t = this;

    $(document)
      .on(`touchstart${_t.NAMESPACE}`, _t.OPTION.wrapper, function (e) {

        let _self = $(this),
          touch = e.originalEvent.touches[0],
          num = _self.data('vsNum');

        this._data = _t.CONTENTS[num];
        this._elem = _self.find(_t.OPTION.container);
        this.start_y = touch.pageY;
        this.start_time = e.timeStamp;
        this.move_y = void 0;
      })
      .on(`touchmove${_t.NAMESPACE}`, _t.OPTION.wrapper, function (e) {
        if(this._data !== void 0 && (this._data.scrollFlg || this._data.y < 0)){
          let touch = e.originalEvent.touches[0];
          this.move_y = touch.pageY - this.start_y - Math.abs(this._data.y) >> 0;
          this.end_time = e.timeStamp;
          _t.goCSS(this._elem, this.move_y, 0);
        }
      })
      .on(`touchend${_t.NAMESPACE}`, _t.OPTION.wrapper, function () {
        let pos = 0;

        if (this.move_y !== void 0) {
          let diff_h = this._data.containerH - Math.abs(this.move_y),
            diff_time = this.end_time - this.start_time,
            last_pos = this._data.wrapperH - this._data.containerH;

          if (this.move_y > 0) {
            // 下に引っ張り過ぎたら戻す
            pos = 0;
          } else if (diff_h < this._data.wrapperH) {
            // 上に引っ張り過ぎたら最下部にフィット
            pos = last_pos;
          } else {
            let vertical = this.move_y - this._data.y,
              reverb = Math.abs(vertical) / diff_time * 100 >> 0;

            if (vertical > 0) {
              // 下へスワイプ
              pos = this.move_y + reverb;
              if (pos > 0) pos = 0;
            } else {
              // 上へスワイプ
              pos = this.move_y - reverb;
              if (pos < last_pos) pos = last_pos;
            }
          }

          // スクロールフラグがfalseだったら強制的に0をセット
          if (!this._data.scrollFlg) pos = 0;

          _t.goCSS(this._elem, pos, _t.OPTION.duration);
          this._data.y = pos;
        }
      });

  }


  /**
   * Mouse Event
   */
  onWheel() {
    let _t = this;

    $(document).on(FR.WHEEL + _t.NAMESPACE, _t.OPTION.wrapper, function (e) {
      e.preventDefault();

      let _self = $(this),
        num = _self.data('vsNum'),
        elem = _self.find(_t.OPTION.container),
        _data = _t.CONTENTS[num],
        delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);

      if (!_data.scrollFlg && _data.y >= 0) return false;    // スクロールフラグがfalseかつ要素位置が0の時は処理しない
      if (_data.timer !== false) clearTimeout(_data.timer);

      let set_delta = FR.isFirefox ? delta * 2 : delta / 4;
      let pos = _data.y + set_delta >> 0,
        diff = _data.wrapperH - _data.containerH;

      if (pos > 0) {
        pos = 0;
      } else if (pos < diff) {
        pos = diff;
      }

      // スクロールフラグがfalseだったら強制的に0
      if (!_data.scrollFlg) pos = 0;
      if (!!FR.isTranslate3d && !FR.isIE) {
        // transform3dが利用できる場合
        _t.goCSS(elem, pos, _t.OPTION.duration);
      } else {
        _t.goAnimate(elem, pos, _t.OPTION.jsEasing, _t.OPTION.duration);
      }

      _data.y = pos;
    });
  }


  /**
   * CSS3 アニメーション
   * @param elem
   * @param pos
   * @param duration
   */
  goCSS(elem, pos, duration) {
    let ease = duration > 0 ? this.OPTION.cssEasing : 'linear';

    elem.css({
      '-webkit-transform': `translate3d(0, ${pos}px, 0)`,
      'transform': `translate3d(0, ${pos}px, 0)`,
      '-webkit-transition': `-webkit-transform ${duration}s ${ease}`,
      'transition': `transform ${duration}s ${ease}`
    });
  }

  /**
   * jQuery Animation (IE)
   * @param elem
   * @param pos
   * @param animation
   * @param duration
   */
  goAnimate(elem, pos, animation, duration) {
    let speed = duration * 1000;

    elem.stop().animate({
      top: pos
    }, speed, animation);
  }



  /**
   * スクロール位置のリセット
   * @param id[string] HTML ID
   */
  reset(id = null) {
    for (let i = 0, iLen = this.CONTENTS.length; i < iLen; i++) {
      let obj = this.CONTENTS[i];

      if (id !== null) {
        // 特定IDのみリセットする場合
        let target = $(id),
          container = target.find(this.OPTION.container),
          target_num = target.data('vsNum');
        if (obj.vsNum === target_num) {
          obj.y = 0;

          if (FR.isTranslate3d === true && !FR.isIE) {
            this.goCSS(container, 0, 0);
          } else {
            this.goAnimate(container, 0, 'liner', 0);
          }
        }
      } else {
        obj.y = 0;
      }
    }


    if (id === null) {
      // 全てをリセットする場合
      if (FR.isTranslate3d === true && !FR.isIE) {
        this.goCSS($(this.OPTION.container), 0, 0);
      } else {
        this.goAnimate($(this.OPTION.container), 0, 'liner', 0);
      }
    }
  }

  /**
   * イベントの破棄
   */
  destroy() {
    $(document).off(this.NAMESPACE);
  }
}


