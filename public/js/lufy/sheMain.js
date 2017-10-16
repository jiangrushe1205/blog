LInit(60, "mygame", 580, 390 , main);

var speed = 2;
var _speed = 0;
var loadingLayer;
function main(){

    if(LGlobal.mobile){
        LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
    }
    LGlobal.screen(LGlobal.FULL_SCREEN)
    var loading = new LTextField();
    loading.text = "资源正在加载,请稍等..."
    loading.size = 30;
    loading.x = (LGlobal.width - loading.getWidth()) /2;
    loading.y = (LGlobal.height - loading.getHeight()) /4;
    addChild(loading);

    //用来显示进度条,引擎中目前提供的进度条有1-7;
    loadingLayer = new LoadingSample7();
    addChild(loadingLayer);
    LLoadManage.load([{name : "img", path : "/images/lufy/player.png"}],function(progress){
        loadingLayer.setProgress(progress);
    },gameInit)
}


function gameInit(result){
    removeChild(loadingLayer);

    loadingLayer = null;
    backLayer = new LSprite("#000");
    addChild(backLayer);

    playLayer = new LSprite();
    backLayer.addChild(playLayer);


    //全局变量，我喜欢用dataList
    dataList = result;
    console.log(result);
    initPlayer(result);

    initAnimate();
    //进入图之后，按帧速率调用onframe函数
    backLayer.addEventListener(LEvent.ENTER_FRAME,onframe);
}

function initPlayer(result){
    var palyerImg = dataList["img"];
    console.log(palyerImg);
    //设置图片资源
    playermapData = new LBitmapData(palyerImg);

    playerBitmap = new LBitmap(playermapData);
    //定位图片出现的位置
    playerBitmap.x = 0;
    playerBitmap.y = 0;
    playLayer.addChildAt(playerBitmap);
}

function initAnimate(){
    var coordinateList = LGlobal.divideCoordinate(
        playermapData.image.width,
        playermapData.image.height,4,4);

    animate =new LAnimation(playLayer,playermapData ,coordinateList);

    animate.setAction(0);
}


function onframe(){
    //控制走帧的速度
    //_speed自增不到speed，不动，继续自增
    if(_speed++<speed){
        return ;
    }
    //等于speed的时候，重置，animate走一帧
    _speed = 0;
    animate.onframe();//animate从第一帧（第一行1/4图）到第二帧（第一行2/4图）
}