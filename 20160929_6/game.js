var canvas = null;
var context = null;

class GameObject {
  constructor(src) {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.image = new Image();

    //() => {} Arrow function
    this.image.addEventListener('load', () => {
      this.width = this.image.width;
      this.height = this.image.height;
    });
    this.image.src = src;
  }
}

class Ball extends GameObject {
  constructor() {
    super('image/ball.png');

    this.speed = {x:-4, y:-2.5};
  }
}

var clicked = false;

var gameObjectList = [];
var ballList = [];
var brickList = [];

function init() {
  canvas = document.getElementById('gameCanvas');
  context = canvas.getContext('2d');

  create('brick', 300, 50);
  create('brick', 100, 50);
  create('ball', 240, 200);

  requestAnimationFrame(update);
}

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let o of gameObjectList) {
    context.drawImage(o.image, o.x, o.y);
  }

  for (let ball of ballList) {
    for (let brick of brickList) {
      //AABB 충돌
      if(brick.x + brick.width > ball.x &&
        brick.x < ball.x + ball.width &&
        brick.y + brick.height > ball.y &&
        brick.y < ball.y + ball.height
      ) {
        let collisionX = Math.max(ball.x, brick.x);
        let collisionY = Math.max(ball.y, brick.y);
        let collisionWidth = Math.min(ball.x + ball.width, brick.x + brick.width) - collisionX;
        let collisionHeight = Math.min(ball.y + ball.height, brick.y + brick.height) - collisionY;
        // console.log("width:"+cw+" height:"+ch);
        if(collisionHeight > collisionWidth)
          ball.speed.x *= -1;
        else
          ball.speed.y *= -1;
      }
    }

    if(clicked) {
      ball.x += ball.speed.x;
      ball.y += ball.speed.y;
    }

    if(ball.x < 0 || ball.x + ball.width > canvas.width)
      ball.speed.x *= -1;
    else if(ball.y < 0)
      ball.speed.y *= -1;
  }

  requestAnimationFrame(update);
}

function create(id, x, y) {
  let ret;

  switch (id) {
    case 'brick':
      ret = new GameObject('image/brick.png');
      brickList.push(ret);
      break;
    case 'ball':
      ret = new Ball();
      ballList.push(ret);
      break;
    default:
      return null;
  }

  ret.x = x;
  ret.y = y;
  gameObjectList.push(ret);

  return ret;
}

function onClick() {
  clicked = true;
}

window.addEventListener('click', onClick);
window.addEventListener('load', init);
