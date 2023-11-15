import gsap from 'gsap';
import Plane from './components/mesh';
import Stage from './components/stage';
import GLElements from './components/gl-elements';
import {x, y, lerp} from './utils'

export default class webGL {
  constructor() {
    this.body = document.body;
    this.list = document.querySelector('.list');
    this.items = document.querySelectorAll('.item');
    this.deviceRatio = window.innerWidth > 767 ? 1.0 : 2.0
    
    this.isDown = false;
    this.keyStrength = 0;
    
    this.meshList = [];
    this.array = [];

    this.stage = new Stage('#webgl');
    this.stage.init();
    this.glElements = new GLElements(this.items);
    this.glElements.init();

    for( let i = 0; i < this.items.length; i++ ) {
      this.array.push({
        item: this.items[i],
        extra: { x: 0, y: 0 },
      });
      this.meshList.push(new Plane(this.stage, this.glElements.optionList[i]));
      this.meshList[i].init();
    }
  }

  init() {
    this.setEventListeners();
    this.setTicker();
  }

  setEventListeners() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
    window.addEventListener('mousedown', this.onTouchDown.bind(this));
    window.addEventListener('mousemove', this.onTouchMove.bind(this));
    window.addEventListener('mouseup', this.onTouchUp.bind(this));
    window.addEventListener('touchstart', this.onTouchDown.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('touchend', this.onTouchUp.bind(this));
    window.addEventListener('wheel', this.onMouseWheel.bind(this), { passive: false });
    window.addEventListener('resize', this.onResize.bind(this));
  }

  setTicker() {
    gsap.ticker.fps(60);
    gsap.ticker.add(this.raf.bind(this));
  }

  onTouchDown(e) {
    this.isDown = true;
    console.log('down');

    // マウスとタッチイベントでスタート位置の取得の方法が違うので条件分岐
    x.start = e.touches ? e.touches[0].clientX : e.clientX;
    y.start = e.touches ? e.touches[0].clientY : e.clientY;

    // 過去の移動量を取得しておく
    x.scroll = x.save;
    y.scroll = y.save;
  }

  onTouchMove(e) {
    // downしていない時は処理を返す
    if(!this.isDown) return;
    console.log('move');

    this.body.style.cursor = 'grabbing';
    this.list.style.pointerEvents = 'none';

    // マウスとタッチイベントでスタート位置の取得の方法が違うので条件分岐
    x.end = e.touches ? e.touches[0].clientX : e.clientX;
    y.end = e.touches ? e.touches[0].clientY : e.clientY;

    // down後に動いた移動量を取得
    x.distance = (x.start - x.end) * this.deviceRatio;
    y.distance = (y.start - y.end) * this.deviceRatio;

    // 目標位置 = down後に動いた移動量 + 過去の移動量
    x.target = x.distance + x.scroll;
    y.target = y.distance + y.scroll + x.distance;
  }

  onTouchUp() {
    this.isDown = false;
    console.log('up');

    this.body.style.cursor = 'auto';
    this.list.style.pointerEvents = 'auto';

    x.mouse += x.distance;
    y.mouse += y.distance + x.distance;
  }

  onMouseWheel(e) {
    e.preventDefault();

    x.wheel += e.deltaX;
    y.wheel += e.deltaY + (e.deltaX * 0.5);

    // 全てのイベントの総移動量から目標位置を計算
    x.target = x.wheel + x.mouse + x.key;
    y.target = y.wheel + y.mouse + y.key;

    console.log(x.direction);
    console.log(y.direction);
  }

  onKeyDown(e) {
    console.log('down');

    if (this.keyStrength < 140) this.keyStrength += 12.0

    if (e.key === 'ArrowDown') {
      y.key += this.keyStrength
    }
    if (e.key === 'ArrowUp') {
      y.key += -this.keyStrength
    }
    if (e.key === 'ArrowRight') {
      x.key += this.keyStrength
    }
    if (e.key === 'ArrowLeft') {
      x.key += -this.keyStrength
    }

    // 全てのイベントの総移動量から目標位置を計算
    x.target = x.key + x.wheel + x.mouse;
    y.target = y.key + y.wheel + y.mouse;
  }

  onKeyUp() {
    console.log('up');
    this.keyStrength = 0;
  }

  raf() {
    // 線形補完
    x.current = gsap.utils.interpolate(
      x.current,
      x.target,
      lerp
    );
    
    y.current = gsap.utils.interpolate(
      y.current,
      y.target,
      lerp
    );

    // 移動方向を取得
    if(x.save < x.current) {
      x.direction = 'left'
    } else if(x.save > x.current) {
      x.direction = 'right';
    }

    if (y.save < y.current) {
      y.direction = 'top'
    } else if (y.save > y.current) {
      y.direction = 'bottom'
    }

    x.save = x.current;
    y.save = y.current;

    for( let i = 0; i < this.array.length; i++ ) {
      const rect = this.array[i].item.getBoundingClientRect();

      // windowの画面外に行った時に、wrapper要素の横幅分ずらしていく
      if( i % 4 - 1 === 0 || i % 4 - 1 === 2 ) {

        if( x.direction === 'left' && rect.left < -rect.width ) {
          console.log('画面外');
          this.array[i].extra.x += this.list.clientWidth;
        } else if( x.direction === 'right' && window.innerWidth < rect.left ) {
          console.log('画面外')
          this.array[i].extra.x += -this.list.clientWidth;
        }

        if( y.direction === 'top' && window.innerHeight < rect.top ) {
          console.log('画面外');
          this.array[i].extra.y += -this.list.clientHeight;
        } else if( y.direction === 'bottom' && rect.top < -rect.height ) {
          console.log('画面外');
          this.array[i].extra.y += this.list.clientHeight;
        }

      } else {

        if( x.direction === 'left' && rect.left < -rect.width ) {
          console.log('画面外')
          this.array[i].extra.x += this.list.clientWidth;
        } else if( x.direction === 'right' && window.innerWidth < rect.left ) {
          console.log('画面外');
          this.array[i].extra.x += -this.list.clientWidth;
        }

        if( y.direction === 'bottom' && window.innerHeight < rect.top ) {
          console.log('画面外');
          this.array[i].extra.y += -this.list.clientHeight;
        } else if( y.direction === 'top' && rect.top < -rect.height ) {
          console.log('画面外');
          this.array[i].extra.y += this.list.clientHeight;
        }

      }

      let finalX = 0;
      let finalY = 0;

      finalX = -x.current + this.array[i].extra.x;
      finalY = -y.current + this.array[i].extra.y;

      if( i % 4 - 1 === 0 || i % 4 - 1 === 2 ) {
        finalX = (-x.current + this.array[i].extra.x);
        finalY = -(-y.current - this.array[i].extra.y);
      }

      this.array[i].item.style.transform = `translate(${finalX}px, ${finalY}px)`;
    }

    this.stage.onRaf();
    this.glElements._updateOptionList();

    for( let i = 0; i < this.array.length; i++ ) {
      const strength = ((y.current - y.target)) * 0.10
      if( i % 4 - 1 === 0 || i % 4 - 1 === 2 ) {
        this.meshList[i]._setStrength(strength);
      } else {
        this.meshList[i]._setStrength(-strength);
      }
      this.meshList[i].onRaf();
    }
  }

  onResize() {
    console.log('resize');

    x.current = 0;
    y.current = 0;
    x.wheel = 0;
    y.wheel = 0;
    x.allDistance = 0;
    y.allDistance = 0;
    x.save = 0;
    y.save = 0;
    x.target = 0;
    y.target = 0;

    for( let i = 0; i < this.array.length; i++ ) {
      this.array[i].extra.x = 0;
      this.array[i].extra.y = 0;
    }

    this.stage.onResize();

    for( let i = 0; i < this.array.length; i++ ) {
      this.meshList[i].onResize();
    }
  }
}
