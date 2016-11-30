# jquery.verticalScroller

overflow領域で内部スクロールさせる際にデフォルトの`overflow:scroll`ではなく任意にイージングさせる。<br>
スマートフォンのサイドメニューなどでの利用可能

@author: Nobuyuki Kondo<br>
@license: MIT<br>
@support: IE8+, Chrome, Firefox, Safari, Android 4+, iOS8+<br>
@use: jQuery 1.11.x/2.x/3.x


[動作デモ](http://demo.artprojectteam.jp/jquery_vertical_scroller/)



## Install

```
bower install  jquery_vertical_scroller --save
```



## Setup

**File Read**

```html
<script src="/path/to/jquery.verticalScroller.js"></script>
```

`</body>`前でスクリプトファイルを読む

**html**

```html
<div class="wrapper">
  <div class="container">
    <p>...</p>
  </div>
</div>
```

**css**

```css
.wrapper {
  height: 200px;
  overflow: hidden;
}

.container {
  position: relative;
}
```


## Usage

インスタンスを生成し、制御を可能にする。

```javascript
var hoge = new verticalScroller();
```

### setup option

| option | デフォルト | 備考 |
| ------- | ------ | ------ |
| wrapper | '.wrapper' | |
| container | '.container' | |
| duration | 0.3 | アニメーション時間 |
| cssEasing | 'cubic-bezier(0.165, 0.840, 0.440, 1.000)' | CSS3が利用できる場合のイージング。<br>デフォルトはQuartのease out |
| jsEasing | 'linear' | CSS3が利用できない場合のjQuery.animateで使用するイージング |


```javascript
var hoge = new verticalScroller({
  wrapper: '.wrapper',
  container: '.container',
  duration: 0.3,
  cssEasing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
  jsEasing: 'linear'
});
```




## Method

このプラグインでは下記のメソッドを任意の場所で使用することが出来ます。

**使用例**

```javascript
var foo = new verticalScroller();
```

### update()

領域の情報をアップデート。<br>
高さが変更したり、内包するコンテンツに変化が生じた場合に利用可能

**例**

```javascript
var foo = new verticalScroller();

foo.update();
```

### reset(id)

表示位置を0にする。<br>
idを指定すれば特定のIDエリアのみリセットが可能。<br>
※作成したインスタンス外のIDに対しては効かないので要注意

**例**

```javascript
var foo = new verticalScroller();

foo.reset();
foo.reset('#bar');
```


### destroy()

イベントを破棄。

**例**

```javascript
var foo = new verticalScroller();

foo.destroy();
```


