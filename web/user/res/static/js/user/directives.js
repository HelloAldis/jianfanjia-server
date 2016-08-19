'use strict';
!function($){$.Jcrop=function(obj,opt){function px(n){return Math.round(n)+"px"}function cssClass(cl){return options.baseClass+"-"+cl}function supportsColorFade(){return $.fx.step.hasOwnProperty("backgroundColor")}function getPos(obj){var pos=$(obj).offset();return[pos.left,pos.top]}function mouseAbs(e){return[e.pageX-docOffset[0],e.pageY-docOffset[1]]}function setOptions(opt){"object"!=typeof opt&&(opt={}),options=$.extend(options,opt),$.each(["onChange","onSelect","onRelease","onDblClick"],function(i,e){"function"!=typeof options[e]&&(options[e]=function(){})})}function startDragMode(mode,pos,touch){if(docOffset=getPos($img),Tracker.setCursor("move"===mode?mode:mode+"-resize"),"move"===mode)return Tracker.activateHandlers(createMover(pos),doneSelect,touch);var fc=Coords.getFixed(),opp=oppLockCorner(mode),opc=Coords.getCorner(oppLockCorner(opp));Coords.setPressed(Coords.getCorner(opp)),Coords.setCurrent(opc),Tracker.activateHandlers(dragmodeHandler(mode,fc),doneSelect,touch)}function dragmodeHandler(mode,f){return function(pos){if(options.aspectRatio)switch(mode){case"e":pos[1]=f.y+1;break;case"w":pos[1]=f.y+1;break;case"n":pos[0]=f.x+1;break;case"s":pos[0]=f.x+1}else switch(mode){case"e":pos[1]=f.y2;break;case"w":pos[1]=f.y2;break;case"n":pos[0]=f.x2;break;case"s":pos[0]=f.x2}Coords.setCurrent(pos),Selection.update()}}function createMover(pos){var lloc=pos;return KeyManager.watchKeys(),function(pos){Coords.moveOffset([pos[0]-lloc[0],pos[1]-lloc[1]]),lloc=pos,Selection.update()}}function oppLockCorner(ord){switch(ord){case"n":return"sw";case"s":return"nw";case"e":return"nw";case"w":return"ne";case"ne":return"sw";case"nw":return"se";case"se":return"nw";case"sw":return"ne"}}function createDragger(ord){return function(e){return options.disabled?!1:"move"!==ord||options.allowMove?(docOffset=getPos($img),btndown=!0,startDragMode(ord,mouseAbs(e)),e.stopPropagation(),e.preventDefault(),!1):!1}}function presize($obj,w,h){var nw=$obj.width(),nh=$obj.height();nw>w&&w>0&&(nw=w,nh=w/$obj.width()*$obj.height()),nh>h&&h>0&&(nh=h,nw=h/$obj.height()*$obj.width()),xscale=$obj.width()/nw,yscale=$obj.height()/nh,$obj.width(nw).height(nh)}function unscale(c){return{x:c.x*xscale,y:c.y*yscale,x2:c.x2*xscale,y2:c.y2*yscale,w:c.w*xscale,h:c.h*yscale}}function doneSelect(){var c=Coords.getFixed();c.w>options.minSelect[0]&&c.h>options.minSelect[1]?(Selection.enableHandles(),Selection.done()):Selection.release(),Tracker.setCursor(options.allowSelect?"crosshair":"default")}function newSelection(e){if(!options.disabled&&options.allowSelect){btndown=!0,docOffset=getPos($img),Selection.disableHandles(),Tracker.setCursor("crosshair");var pos=mouseAbs(e);return Coords.setPressed(pos),Selection.update(),Tracker.activateHandlers(selectDrag,doneSelect,"touch"===e.type.substring(0,5)),KeyManager.watchKeys(),e.stopPropagation(),e.preventDefault(),!1}}function selectDrag(pos){Coords.setCurrent(pos),Selection.update()}function newTracker(){var trk=$("<div></div>").addClass(cssClass("tracker"));return is_msie&&trk.css({opacity:0,backgroundColor:"white"}),trk}function setClass(cname){$div.removeClass().addClass(cssClass("holder")).addClass(cname)}function animateTo(a,callback){function queueAnimator(){window.setTimeout(animator,interv)}var x1=a[0]/xscale,y1=a[1]/yscale,x2=a[2]/xscale,y2=a[3]/yscale;if(!animating){var animto=Coords.flipCoords(x1,y1,x2,y2),c=Coords.getFixed(),initcr=[c.x,c.y,c.x2,c.y2],animat=initcr,interv=options.animationDelay,ix1=animto[0]-initcr[0],iy1=animto[1]-initcr[1],ix2=animto[2]-initcr[2],iy2=animto[3]-initcr[3],pcent=0,velocity=options.swingSpeed;x1=animat[0],y1=animat[1],x2=animat[2],y2=animat[3],Selection.animMode(!0);var animator=function(){return function(){pcent+=(100-pcent)/velocity,animat[0]=Math.round(x1+pcent/100*ix1),animat[1]=Math.round(y1+pcent/100*iy1),animat[2]=Math.round(x2+pcent/100*ix2),animat[3]=Math.round(y2+pcent/100*iy2),pcent>=99.8&&(pcent=100),100>pcent?(setSelectRaw(animat),queueAnimator()):(Selection.done(),Selection.animMode(!1),"function"==typeof callback&&callback.call(api))}}();queueAnimator()}}function setSelect(rect){setSelectRaw([rect[0]/xscale,rect[1]/yscale,rect[2]/xscale,rect[3]/yscale]),options.onSelect.call(api,unscale(Coords.getFixed())),Selection.enableHandles()}function setSelectRaw(l){Coords.setPressed([l[0],l[1]]),Coords.setCurrent([l[2],l[3]]),Selection.update()}function tellSelect(){return unscale(Coords.getFixed())}function tellScaled(){return Coords.getFixed()}function setOptionsNew(opt){setOptions(opt),interfaceUpdate()}function disableCrop(){options.disabled=!0,Selection.disableHandles(),Selection.setCursor("default"),Tracker.setCursor("default")}function enableCrop(){options.disabled=!1,interfaceUpdate()}function cancelCrop(){Selection.done(),Tracker.activateHandlers(null,null)}function destroy(){$div.remove(),$origimg.show(),$origimg.css("visibility","visible"),$(obj).removeData("Jcrop")}function setImage(src,callback){Selection.release(),disableCrop();var img=new Image;img.onload=function(){var iw=img.width,ih=img.height,bw=options.boxWidth,bh=options.boxHeight;$img.width(iw).height(ih),$img.attr("src",src),$img2.attr("src",src),presize($img,bw,bh),boundx=$img.width(),boundy=$img.height(),$img2.width(boundx).height(boundy),$trk.width(boundx+2*bound).height(boundy+2*bound),$div.width(boundx).height(boundy),Shade.resize(boundx,boundy),enableCrop(),"function"==typeof callback&&callback.call(api)},img.src=src}function colorChangeMacro($obj,color,now){var mycolor=color||options.bgColor;options.bgFade&&supportsColorFade()&&options.fadeTime&&!now?$obj.animate({backgroundColor:mycolor},{queue:!1,duration:options.fadeTime}):$obj.css("backgroundColor",mycolor)}function interfaceUpdate(alt){options.allowResize?alt?Selection.enableOnly():Selection.enableHandles():Selection.disableHandles(),Tracker.setCursor(options.allowSelect?"crosshair":"default"),Selection.setCursor(options.allowMove?"move":"default"),options.hasOwnProperty("trueSize")&&(xscale=options.trueSize[0]/boundx,yscale=options.trueSize[1]/boundy),options.hasOwnProperty("setSelect")&&(setSelect(options.setSelect),Selection.done(),delete options.setSelect),Shade.refresh(),options.bgColor!=bgcolor&&(colorChangeMacro(options.shade?Shade.getShades():$div,options.shade?options.shadeColor||options.bgColor:options.bgColor),bgcolor=options.bgColor),bgopacity!=options.bgOpacity&&(bgopacity=options.bgOpacity,options.shade?Shade.refresh():Selection.setBgOpacity(bgopacity)),xlimit=options.maxSize[0]||0,ylimit=options.maxSize[1]||0,xmin=options.minSize[0]||0,ymin=options.minSize[1]||0,options.hasOwnProperty("outerImage")&&($img.attr("src",options.outerImage),delete options.outerImage),Selection.refresh()}var docOffset,options=$.extend({},$.Jcrop.defaults),_ua=navigator.userAgent.toLowerCase(),is_msie=/msie/.test(_ua),ie6mode=/msie [1-6]\./.test(_ua);"object"!=typeof obj&&(obj=$(obj)[0]),"object"!=typeof opt&&(opt={}),setOptions(opt);var img_css={border:"none",visibility:"visible",margin:0,padding:0,position:"absolute",top:0,left:0},$origimg=$(obj),img_mode=!0;if("IMG"==obj.tagName){if(0!=$origimg[0].width&&0!=$origimg[0].height)$origimg.width($origimg[0].width),$origimg.height($origimg[0].height);else{var tempImage=new Image;tempImage.src=$origimg[0].src,$origimg.width(tempImage.width),$origimg.height(tempImage.height)}var $img=$origimg.clone().removeAttr("id").css(img_css).show();$img.width($origimg.width()),$img.height($origimg.height()),$origimg.after($img).hide()}else $img=$origimg.css(img_css).show(),img_mode=!1,null===options.shade&&(options.shade=!0);presize($img,options.boxWidth,options.boxHeight);var boundx=$img.width(),boundy=$img.height(),$div=$("<div />").width(boundx).height(boundy).addClass(cssClass("holder")).css({position:"relative",backgroundColor:options.bgColor}).insertAfter($origimg).append($img);options.addClass&&$div.addClass(options.addClass);var $img2=$("<div />"),$img_holder=$("<div />").width("100%").height("100%").css({zIndex:310,position:"absolute",overflow:"hidden"}),$hdl_holder=$("<div />").width("100%").height("100%").css("zIndex",320),$sel=$("<div />").css({position:"absolute",zIndex:600}).dblclick(function(){var c=Coords.getFixed();options.onDblClick.call(api,c)}).insertBefore($img).append($img_holder,$hdl_holder);img_mode&&($img2=$("<img />").attr("src",$img.attr("src")).css(img_css).width(boundx).height(boundy),$img_holder.append($img2)),ie6mode&&$sel.css({overflowY:"hidden"});var xlimit,ylimit,xmin,ymin,xscale,yscale,btndown,animating,shift_down,bound=options.boundary,$trk=newTracker().width(boundx+2*bound).height(boundy+2*bound).css({position:"absolute",top:px(-bound),left:px(-bound),zIndex:290}).mousedown(newSelection),bgcolor=options.bgColor,bgopacity=options.bgOpacity;docOffset=getPos($img);var Touch=function(){function hasTouchSupport(){var i,support={},events=["touchstart","touchmove","touchend"],el=document.createElement("div");try{for(i=0;i<events.length;i++){var eventName=events[i];eventName="on"+eventName;var isSupported=eventName in el;isSupported||(el.setAttribute(eventName,"return;"),isSupported="function"==typeof el[eventName]),support[events[i]]=isSupported}return support.touchstart&&support.touchend&&support.touchmove}catch(err){return!1}}function detectSupport(){return options.touchSupport===!0||options.touchSupport===!1?options.touchSupport:hasTouchSupport()}return{createDragger:function(ord){return function(e){return options.disabled?!1:"move"!==ord||options.allowMove?(docOffset=getPos($img),btndown=!0,startDragMode(ord,mouseAbs(Touch.cfilter(e)),!0),e.stopPropagation(),e.preventDefault(),!1):!1}},newSelection:function(e){return newSelection(Touch.cfilter(e))},cfilter:function(e){return e.pageX=e.originalEvent.changedTouches[0].pageX,e.pageY=e.originalEvent.changedTouches[0].pageY,e},isSupported:hasTouchSupport,support:detectSupport()}}(),Coords=function(){function setPressed(pos){pos=rebound(pos),x2=x1=pos[0],y2=y1=pos[1]}function setCurrent(pos){pos=rebound(pos),ox=pos[0]-x2,oy=pos[1]-y2,x2=pos[0],y2=pos[1]}function getOffset(){return[ox,oy]}function moveOffset(offset){var ox=offset[0],oy=offset[1];0>x1+ox&&(ox-=ox+x1),0>y1+oy&&(oy-=oy+y1),y2+oy>boundy&&(oy+=boundy-(y2+oy)),x2+ox>boundx&&(ox+=boundx-(x2+ox)),x1+=ox,x2+=ox,y1+=oy,y2+=oy}function getCorner(ord){var c=getFixed();switch(ord){case"ne":return[c.x2,c.y];case"nw":return[c.x,c.y];case"se":return[c.x2,c.y2];case"sw":return[c.x,c.y2]}}function getFixed(){if(!options.aspectRatio)return getRect();var xx,yy,w,h,aspect=options.aspectRatio,min_x=options.minSize[0]/xscale,max_x=options.maxSize[0]/xscale,max_y=options.maxSize[1]/yscale,rw=x2-x1,rh=y2-y1,rwa=Math.abs(rw),rha=Math.abs(rh),real_ratio=rwa/rha;return 0===max_x&&(max_x=10*boundx),0===max_y&&(max_y=10*boundy),aspect>real_ratio?(yy=y2,w=rha*aspect,xx=0>rw?x1-w:w+x1,0>xx?(xx=0,h=Math.abs((xx-x1)/aspect),yy=0>rh?y1-h:h+y1):xx>boundx&&(xx=boundx,h=Math.abs((xx-x1)/aspect),yy=0>rh?y1-h:h+y1)):(xx=x2,h=rwa/aspect,yy=0>rh?y1-h:y1+h,0>yy?(yy=0,w=Math.abs((yy-y1)*aspect),xx=0>rw?x1-w:w+x1):yy>boundy&&(yy=boundy,w=Math.abs(yy-y1)*aspect,xx=0>rw?x1-w:w+x1)),xx>x1?(min_x>xx-x1?xx=x1+min_x:xx-x1>max_x&&(xx=x1+max_x),yy=yy>y1?y1+(xx-x1)/aspect:y1-(xx-x1)/aspect):x1>xx&&(min_x>x1-xx?xx=x1-min_x:x1-xx>max_x&&(xx=x1-max_x),yy=yy>y1?y1+(x1-xx)/aspect:y1-(x1-xx)/aspect),0>xx?(x1-=xx,xx=0):xx>boundx&&(x1-=xx-boundx,xx=boundx),0>yy?(y1-=yy,yy=0):yy>boundy&&(y1-=yy-boundy,yy=boundy),makeObj(flipCoords(x1,y1,xx,yy))}function rebound(p){return p[0]<0&&(p[0]=0),p[1]<0&&(p[1]=0),p[0]>boundx&&(p[0]=boundx),p[1]>boundy&&(p[1]=boundy),[Math.round(p[0]),Math.round(p[1])]}function flipCoords(x1,y1,x2,y2){var xa=x1,xb=x2,ya=y1,yb=y2;return x1>x2&&(xa=x2,xb=x1),y1>y2&&(ya=y2,yb=y1),[xa,ya,xb,yb]}function getRect(){var delta,xsize=x2-x1,ysize=y2-y1;return xlimit&&Math.abs(xsize)>xlimit&&(x2=xsize>0?x1+xlimit:x1-xlimit),ylimit&&Math.abs(ysize)>ylimit&&(y2=ysize>0?y1+ylimit:y1-ylimit),ymin/yscale&&Math.abs(ysize)<ymin/yscale&&(y2=ysize>0?y1+ymin/yscale:y1-ymin/yscale),xmin/xscale&&Math.abs(xsize)<xmin/xscale&&(x2=xsize>0?x1+xmin/xscale:x1-xmin/xscale),0>x1&&(x2-=x1,x1-=x1),0>y1&&(y2-=y1,y1-=y1),0>x2&&(x1-=x2,x2-=x2),0>y2&&(y1-=y2,y2-=y2),x2>boundx&&(delta=x2-boundx,x1-=delta,x2-=delta),y2>boundy&&(delta=y2-boundy,y1-=delta,y2-=delta),x1>boundx&&(delta=x1-boundy,y2-=delta,y1-=delta),y1>boundy&&(delta=y1-boundy,y2-=delta,y1-=delta),makeObj(flipCoords(x1,y1,x2,y2))}function makeObj(a){return{x:a[0],y:a[1],x2:a[2],y2:a[3],w:a[2]-a[0],h:a[3]-a[1]}}var ox,oy,x1=0,y1=0,x2=0,y2=0;return{flipCoords:flipCoords,setPressed:setPressed,setCurrent:setCurrent,getOffset:getOffset,moveOffset:moveOffset,getCorner:getCorner,getFixed:getFixed}}(),Shade=function(){function resizeShades(w,h){shades.left.css({height:px(h)}),shades.right.css({height:px(h)})}function updateAuto(){return updateShade(Coords.getFixed())}function updateShade(c){shades.top.css({left:px(c.x),width:px(c.w),height:px(c.y)}),shades.bottom.css({top:px(c.y2),left:px(c.x),width:px(c.w),height:px(boundy-c.y2)}),shades.right.css({left:px(c.x2),width:px(boundx-c.x2)}),shades.left.css({width:px(c.x)})}function createShade(){return $("<div />").css({position:"absolute",backgroundColor:options.shadeColor||options.bgColor}).appendTo(holder)}function enableShade(){enabled||(enabled=!0,holder.insertBefore($img),updateAuto(),Selection.setBgOpacity(1,0,1),$img2.hide(),setBgColor(options.shadeColor||options.bgColor,1),Selection.isAwake()?setOpacity(options.bgOpacity,1):setOpacity(1,1))}function setBgColor(color,now){colorChangeMacro(getShades(),color,now)}function disableShade(){enabled&&(holder.remove(),$img2.show(),enabled=!1,Selection.isAwake()?Selection.setBgOpacity(options.bgOpacity,1,1):(Selection.setBgOpacity(1,1,1),Selection.disableHandles()),colorChangeMacro($div,0,1))}function setOpacity(opacity,now){enabled&&(options.bgFade&&!now?holder.animate({opacity:1-opacity},{queue:!1,duration:options.fadeTime}):holder.css({opacity:1-opacity}))}function refreshAll(){options.shade?enableShade():disableShade(),Selection.isAwake()&&setOpacity(options.bgOpacity)}function getShades(){return holder.children()}var enabled=!1,holder=$("<div />").css({position:"absolute",zIndex:240,opacity:0}),shades={top:createShade(),left:createShade().height(boundy),right:createShade().height(boundy),bottom:createShade()};return{update:updateAuto,updateRaw:updateShade,getShades:getShades,setBgColor:setBgColor,enable:enableShade,disable:disableShade,resize:resizeShades,refresh:refreshAll,opacity:setOpacity}}(),Selection=function(){function insertBorder(type){var jq=$("<div />").css({position:"absolute",opacity:options.borderOpacity}).addClass(cssClass(type));return $img_holder.append(jq),jq}function dragDiv(ord,zi){var jq=$("<div />").mousedown(createDragger(ord)).css({cursor:ord+"-resize",position:"absolute",zIndex:zi}).addClass("ord-"+ord);return Touch.support&&jq.bind("touchstart.jcrop",Touch.createDragger(ord)),$hdl_holder.append(jq),jq}function insertHandle(ord){var hs=options.handleSize,div=dragDiv(ord,hdep++).css({opacity:options.handleOpacity}).addClass(cssClass("handle"));return hs&&div.width(hs).height(hs),div}function insertDragbar(ord){return dragDiv(ord,hdep++).addClass("jcrop-dragbar")}function createDragbars(li){var i;for(i=0;i<li.length;i++)dragbar[li[i]]=insertDragbar(li[i])}function createBorders(li){var cl,i;for(i=0;i<li.length;i++){switch(li[i]){case"n":cl="hline";break;case"s":cl="hline bottom";break;case"e":cl="vline right";break;case"w":cl="vline"}borders[li[i]]=insertBorder(cl)}}function createHandles(li){var i;for(i=0;i<li.length;i++)handle[li[i]]=insertHandle(li[i])}function moveto(x,y){options.shade||$img2.css({top:px(-y),left:px(-x)}),$sel.css({top:px(y),left:px(x)})}function resize(w,h){$sel.width(Math.round(w)).height(Math.round(h))}function refresh(){var c=Coords.getFixed();Coords.setPressed([c.x,c.y]),Coords.setCurrent([c.x2,c.y2]),updateVisible()}function updateVisible(select){return awake?update(select):void 0}function update(select){var c=Coords.getFixed();resize(c.w,c.h),moveto(c.x,c.y),options.shade&&Shade.updateRaw(c),awake||show(),select?options.onSelect.call(api,unscale(c)):options.onChange.call(api,unscale(c))}function setBgOpacity(opacity,force,now){(awake||force)&&(options.bgFade&&!now?$img.animate({opacity:opacity},{queue:!1,duration:options.fadeTime}):$img.css("opacity",opacity))}function show(){$sel.show(),options.shade?Shade.opacity(bgopacity):setBgOpacity(bgopacity,!0),awake=!0}function release(){disableHandles(),$sel.hide(),options.shade?Shade.opacity(1):setBgOpacity(1),awake=!1,options.onRelease.call(api)}function showHandles(){seehandles&&$hdl_holder.show()}function enableHandles(){return seehandles=!0,options.allowResize?($hdl_holder.show(),!0):void 0}function disableHandles(){seehandles=!1,$hdl_holder.hide()}function animMode(v){v?(animating=!0,disableHandles()):(animating=!1,enableHandles())}function done(){animMode(!1),refresh()}var awake,hdep=370,borders={},handle={},dragbar={},seehandles=!1;options.dragEdges&&$.isArray(options.createDragbars)&&createDragbars(options.createDragbars),$.isArray(options.createHandles)&&createHandles(options.createHandles),options.drawBorders&&$.isArray(options.createBorders)&&createBorders(options.createBorders),$(document).bind("touchstart.jcrop-ios",function(e){$(e.currentTarget).hasClass("jcrop-tracker")&&e.stopPropagation()});var $track=newTracker().mousedown(createDragger("move")).css({cursor:"move",position:"absolute",zIndex:360});return Touch.support&&$track.bind("touchstart.jcrop",Touch.createDragger("move")),$img_holder.append($track),disableHandles(),{updateVisible:updateVisible,update:update,release:release,refresh:refresh,isAwake:function(){return awake},setCursor:function(cursor){$track.css("cursor",cursor)},enableHandles:enableHandles,enableOnly:function(){seehandles=!0},showHandles:showHandles,disableHandles:disableHandles,animMode:animMode,setBgOpacity:setBgOpacity,done:done}}(),Tracker=function(){function toFront(touch){$trk.css({zIndex:450}),touch?$(document).bind("touchmove.jcrop",trackTouchMove).bind("touchend.jcrop",trackTouchEnd):trackDoc&&$(document).bind("mousemove.jcrop",trackMove).bind("mouseup.jcrop",trackUp)}function toBack(){$trk.css({zIndex:290}),$(document).unbind(".jcrop")}function trackMove(e){return onMove(mouseAbs(e)),!1}function trackUp(e){return e.preventDefault(),e.stopPropagation(),btndown&&(btndown=!1,onDone(mouseAbs(e)),Selection.isAwake()&&options.onSelect.call(api,unscale(Coords.getFixed())),toBack(),onMove=function(){},onDone=function(){}),!1}function activateHandlers(move,done,touch){return btndown=!0,onMove=move,onDone=done,toFront(touch),!1}function trackTouchMove(e){return onMove(mouseAbs(Touch.cfilter(e))),!1}function trackTouchEnd(e){return trackUp(Touch.cfilter(e))}function setCursor(t){$trk.css("cursor",t)}var onMove=function(){},onDone=function(){},trackDoc=options.trackDocument;return trackDoc||$trk.mousemove(trackMove).mouseup(trackUp).mouseout(trackUp),$img.before($trk),{activateHandlers:activateHandlers,setCursor:setCursor}}(),KeyManager=function(){function watchKeys(){options.keySupport&&($keymgr.show(),$keymgr.focus())}function onBlur(){$keymgr.hide()}function doNudge(e,x,y){options.allowMove&&(Coords.moveOffset([x,y]),Selection.updateVisible(!0)),e.preventDefault(),e.stopPropagation()}function parseKey(e){if(e.ctrlKey||e.metaKey)return!0;shift_down=e.shiftKey?!0:!1;var nudge=shift_down?10:1;switch(e.keyCode){case 37:doNudge(e,-nudge,0);break;case 39:doNudge(e,nudge,0);break;case 38:doNudge(e,0,-nudge);break;case 40:doNudge(e,0,nudge);break;case 27:options.allowSelect&&Selection.release();break;case 9:return!0}return!1}var $keymgr=$('<input type="radio" />').css({position:"fixed",left:"-120px",width:"12px"}).addClass("jcrop-keymgr"),$keywrap=$("<div />").css({position:"absolute",overflow:"hidden"}).append($keymgr);return options.keySupport&&($keymgr.keydown(parseKey).blur(onBlur),ie6mode||!options.fixedSupport?($keymgr.css({position:"absolute",left:"-20px"}),$keywrap.append($keymgr).insertBefore($img)):$keymgr.insertBefore($img)),{watchKeys:watchKeys}}();Touch.support&&$trk.bind("touchstart.jcrop",Touch.newSelection),$hdl_holder.hide(),interfaceUpdate(!0);var api={setImage:setImage,animateTo:animateTo,setSelect:setSelect,setOptions:setOptionsNew,tellSelect:tellSelect,tellScaled:tellScaled,setClass:setClass,disable:disableCrop,enable:enableCrop,cancel:cancelCrop,release:Selection.release,destroy:destroy,focus:KeyManager.watchKeys,getBounds:function(){return[boundx*xscale,boundy*yscale]},getWidgetSize:function(){return[boundx,boundy]},getScaleFactor:function(){return[xscale,yscale]},getOptions:function(){return options},ui:{holder:$div,selection:$sel}};return is_msie&&$div.bind("selectstart",function(){return!1}),$origimg.data("Jcrop",api),api},$.fn.Jcrop=function(options,callback){var api;return this.each(function(){if($(this).data("Jcrop")){if("api"===options)return $(this).data("Jcrop");$(this).data("Jcrop").setOptions(options)}else"IMG"==this.tagName?$.Jcrop.Loader(this,function(){$(this).css({display:"block",visibility:"hidden"}),api=$.Jcrop(this,options),$.isFunction(callback)&&callback.call(api)}):($(this).css({display:"block",visibility:"hidden"}),api=$.Jcrop(this,options),$.isFunction(callback)&&callback.call(api))}),this},$.Jcrop.Loader=function(imgobj,success,error){function completeCheck(){img.complete?($img.unbind(".jcloader"),$.isFunction(success)&&success.call(img)):window.setTimeout(completeCheck,50)}var $img=$(imgobj),img=$img[0];$img.bind("load.jcloader",completeCheck).bind("error.jcloader",function(){$img.unbind(".jcloader"),$.isFunction(error)&&error.call(img)}),img.complete&&$.isFunction(success)&&($img.unbind(".jcloader"),success.call(img))},$.Jcrop.defaults={allowSelect:!0,allowMove:!0,allowResize:!0,trackDocument:!0,baseClass:"jcrop",addClass:null,bgColor:"black",bgOpacity:.6,bgFade:!1,borderOpacity:.4,handleOpacity:.5,handleSize:null,aspectRatio:0,keySupport:!0,createHandles:["n","s","e","w","nw","ne","se","sw"],createDragbars:["n","s","e","w"],createBorders:["n","s","e","w"],drawBorders:!0,dragEdges:!0,fixedSupport:!0,touchSupport:null,shade:null,boxWidth:0,boxHeight:0,boundary:2,fadeTime:400,animationDelay:20,swingSpeed:3,minSelect:[0,0],maxSize:[0,0],minSize:[0,0],onChange:function(){},onSelect:function(){},onDblClick:function(){},onRelease:function(){}}}(jQuery);
/**
 * [Tooltip 工具提示]
 * @param  {[String]} element [选择器]
 * @param  {[Object]} options [接收参数]
 */
var Tooltip = function (element, options) {
    this.init(element, options);
}
Tooltip.VERSION = '1.0.0';
/**
 * [DEFAULTS 默认配置]
 * @type {Object}
 *              animation 是否动画
 *              placement 显示方向
 *              selector  为模板添加选择器
 *              template  显示模板
 *              trigger   执行动画
 *              title     提示文字
 *              delay     延迟时间
 *              html      html过滤
 *              viewportSelector  插入选择器
 *              viewportPadding   是否有内填充
 */
Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: '',
    template: '<div class="k-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    viewportSelector: 'body',
    viewportPadding: '3px 8px'
}
/**
 * [init 初始化]
 * @param  {[String]} element [选择器]
 * @param  {[Object]} options [接收参数]
 * @return {[type]}           [description]
 */
Tooltip.prototype.init = function (element, options) {
    this.$tip = null;
    this.$element = $(element);
    this.options = this.getOptions(this.$element, options);
    this.bindEvent(this.$element, this.options);
};
/**
 * [bindEvent 绑定事件]
 * @param  {[String]} element [选择器]
 * @param  {[Object]} options [接收参数]
 */
Tooltip.prototype.bindEvent = function (element, options) {
    var _this = this;
    for (var i = 0; i < element.size(); i++) {
        var triggers = options[i].trigger.split(' ');
        if ($.inArray("click", triggers) != -1) {
            this.$element.eq(i).on('click', $.proxy(this.toggle, this, this.$element.eq(i), options[i]));
        } else {
            var eventIn = $.inArray('hover', triggers) != -1 ? 'mouseenter' : 'focusin';
            var eventOut = $.inArray('hover', triggers) != -1 ? 'mouseleave' : 'focusout';
            this.$element.eq(i).on(eventIn, $.proxy(this.enter, this, this.$element.eq(i), options[i]));
            this.$element.eq(i).on(eventOut, $.proxy(this.leave, this, this.$element.eq(i), options[i]));
        }
    }
}
/**
 * [getOptions 配置参数]
 * @param  {[String]} options   [接收参数]
 * @return {[Object]}           [配置参数]
 */
Tooltip.prototype.getOptions = function (element, option) {
    var options = [];
    for (var i = 0; i < element.size(); i++) {
        options[i] = $.extend({}, this.getDefaults(), element.eq(i).data(), option);
    }
    return options;
}
/**
 * [getOptions 默认参数]
 * @return {[Object]}           [默认参数]
 */
Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
}
/**
 * [toggle 切换状态]
 * @param  {[String]} element [选择器]
 * @param  {[Object]} options [接收参数]
 * @return {[type]}           [description]
 */
Tooltip.prototype.toggle = function (element, options) {
    if (element.hasClass('tooltip-toggle')) {
        this.leave(element, options);
        element.removeClass('tooltip-toggle');
    } else {
        this.$element.removeClass('tooltip-toggle');
        this.enter(element, options);
        element.addClass('tooltip-toggle');
    }
};
/**
 * [enter 移入状态]
 * @param  {[String]} element [选择器]
 * @param  {[Object]} options [接收参数]
 * @return {[type]}           [description]
 */
Tooltip.prototype.enter = function (element, options) {
    this.show(element, options);
};
/**
 * [leave 移出状态]
 * @param  {[String]} element [选择器]
 * @param  {[Object]} options [接收参数]
 * @return {[type]}           [description]
 */
Tooltip.prototype.leave = function (element, options) {
    this.hide(element, options);
};
/**
 * [placementTop 显示上面位置]
 * @param  {[String]} placement   [方向]
 * @return {[Function]}           [显示位置]
 */
Tooltip.prototype.placementTop = function (element, options, position) {
    var ew = element.height();
    var tw = this.$tip.width();
    var th = this.$tip.height();
    var difference = 0;
    if (tw > ew) {
        difference = (tw - ew) / 2;
    } else {
        difference = (ew - tw) / 2;
    }
    return {
        left: position.left - difference,
        top: position.top - th - 5
    }
};
/**
 * [placementTop 显示左边位置]
 * @param  {[String]} placement   [方向]
 * @return {[Function]}           [显示位置]
 */
Tooltip.prototype.placementLeft = function (element, options, position) {
    var eh = element.height();
    var tw = this.$tip.width() + 10;
    var th = this.$tip.height();
    var difference = 0;
    if (th > eh) {
        difference = (th - eh) / 2;
    } else {
        difference = (eh - th) / 2;
    }
    return {
        left: position.left - tw - 5,
        top: position.top + difference
    };
};
/**
 * [placementTop 显示下面位置]
 * @param  {[String]} placement   [方向]
 * @return {[Function]}           [显示位置]
 */
Tooltip.prototype.placementBottom = function (element, options, position) {
    var ew = element.width();
    var tw = this.$tip.width();
    var th = this.$tip.height();
    var difference = 0;
    if (tw > ew) {
        difference = (tw - ew) / 2;
    } else {
        difference = (ew - tw) / 2;
    }
    return {
        left: position.left - difference,
        top: position.top + th + 5
    };
};
/**
 * [placementTop 显示右边位置]
 * @param  {[String]} placement   [方向]
 * @return {[Function]}           [显示位置]
 */
Tooltip.prototype.placementRight = function (element, options, position) {
    var eh = element.height();
    var ew = element.width();
    var th = this.$tip.height();
    var difference = 0;
    if (th > eh) {
        difference = (th - eh) / 2;
    } else {
        difference = (eh - th) / 2;
    }
    return {
        left: position.left + ew,
        top: position.top - difference
    };
};
Tooltip.prototype.getPosition = function (element, options) {
    return element.offset();
};
Tooltip.prototype.template = function (options) {
    if (!this.$tip) {
        this.$tip = $(options.template);
        if (this.$tip.length != 1) {
            throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
        }
    }
    return this.$tip;
};
Tooltip.prototype.show = function (element, options) {
    if (this.$tip != null) {
        this.$tip.remove();
    }
    this.$tip = this.template(options);
    this.$tip.attr('class', 'k-tooltip').find('.tooltip-inner').css('padding', options.viewportPadding);
    $(options.viewportSelector).append(this.$tip);
    this.setContent(this.$tip, options);
    var target = {};
    var animate = {};
    switch (options.placement) {
        case 'top':
            this.$tip.addClass('top');
            target = {
                left: this.placementTop(element, options, this.getPosition(element, options)).left,
                top: this.placementTop(element, options, this.getPosition(element, options)).top
            };
            animate = {
                left: target.left,
                top: target.top - 20
            };
            break;
        case 'left':
            this.$tip.addClass('left');
            target = {
                left: this.placementLeft(element, options, this.getPosition(element, options)).left,
                top: this.placementLeft(element, options, this.getPosition(element, options)).top
            };
            animate = {
                left: target.left - 20,
                top: target.top
            };
            break;
        case 'bottom':
            this.$tip.addClass('bottom');
            target = {
                left: this.placementBottom(element, options, this.getPosition(element, options)).left,
                top: this.placementBottom(element, options, this.getPosition(element, options)).top
            };
            animate = {
                left: target.left,
                top: target.top + 20
            };
            break;
        case 'right':
            this.$tip.addClass('right');
            target = {
                left: this.placementRight(element, options, this.getPosition(element, options)).left,
                top: this.placementRight(element, options, this.getPosition(element, options)).top
            };
            animate = {
                left: target.left + 20,
                top: target.top
            };
            break;
    }
    this.$tip.addClass('in');
    if (options.animation) {
        this.$tip.css(animate).stop().animate(target);
    } else {
        this.$tip.css(target);
    }
};
Tooltip.prototype.setContent = function (tip, options) {
    tip.find('.tooltip-inner')[options.html ? 'html' : 'text'](options.title);
};
Tooltip.prototype.hide = function () {
    this.$element.removeClass('tooltip-toggle');
    this.$tip && this.$tip.remove();
    this.$tip = null;
};
/**
 * [destroy 销毁组件]
 */
Tooltip.prototype.destroy = function () {
};

(function(){
    var Select = function(element,options){
        this.init(element,options);
    }
    Select.VERSION = '1.0.0';
    Select.DEFAULTS = {
        type : 'defaults',
        selector : 'k-select',
        animation: true,
        query : '',
        data : [],
        trigger: 'hover focus',
        delay: 500,
        html: false,
        select : function(){}
    }
    /**
     * [init 初始化]
     * @param  {[String]} element [选择器]
     * @param  {[Object]} options [接收参数]
     * @return {[type]}           [description]
     */
    Select.prototype.init = function(element,options) {
        this.$element  = $(element);
        this.options   = this._getOptions(this.$element,options);
        this.$element.addClass(this.options.selector);
        this.query = this.options.query;
        this.oUl = null;
        this._render(this.options);
        this._bindEvent(this.options);
    };
    /**
     * [getOptions 配置参数]
     * @param  {[String]} options   [接收参数]
     * @return {[Object]}           [配置参数]
     */
    Select.prototype._getOptions = function (element,option) {
        return $.extend({}, this.getDefaults(), element.data(), option);
    }
    /**
     * [getOptions 默认参数]
     * @return {[Object]}           [默认参数]
     */
    Select.prototype.getDefaults = function () {
        return Select.DEFAULTS;
    }
    Select.prototype._render = function(option){
        this.oUl = $('<ul class="select"></ul>');
        var length = option.data.length;
        if(!!length){
            var sLi = '';
            switch(option.type){
                case 'defaults' :
                    for (var i = 0; i < length; i++) {
                        sLi += '<li class="'+(option.query == option.data[i].id ? 'active' : '')+'" data-key="'+option.data[i].id+'">'+option.data[i].name+'</li>';
                    }
                    break;
                case 'getKey' :
                    for (var i = 0; i < length; i++) {
                        sLi += '<li class="'+(option.query == option.data[i][0] ? 'active' : '')+'"  data-key="'+option.data[i][0]+'">'+option.data[i][1]+'</li>';
                    }
                    break;
                case 'getValue' :
                    for (var i = 0; i < length; i++) {
                        sLi += '<li class="'+(option.query == option.data[i] ? 'active' : '')+'" >'+option.data[i]+'</li>';
                    }
                    break;
                case 'editor' :
                    for (var i = 0; i < length; i++) {
                        sLi += '<li class="'+(option.query == option.data[i].name ? 'active' : '')+'" >'+option.data[i].name+'</li>';
                    }
                    break;
            }
            this.oUl.html(sLi);
        }
        this.$element.append(this.oUl);
        if(option.type === 'editor'){
            option = '<div class="editor"><input class="value" value="'+option.query+'"><span class="arrow"><em></em><i></i></span></div>';
        }else{
            var value = '';
            switch(option.type){
                case 'defaults' :
                    value = option.data[option.query].name;
                    break;
                case 'getKey' :
                    value = option.data[option.query][1];
                    break;
                case 'getValue' :
                    value = option.query;
                    break;
            }
            option = '<div class="option"><span class="value">'+ value +'</span><span class="arrow"><em></em><i></i></span></div>';
        }
        this.$element.append(option);
        this.value = this.$element.find('.value');
    }
    Select.prototype._bindEvent = function(option){
        var _this = this;
        var timer = null;
        this.$element.on('click',function(){
            _this._show();
        }).on('mouseleave',function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                _this._hide();
            },option.delay);
        }).on('mouseenter',function(){
            clearTimeout(timer);
        });
        switch(option.type){
            case 'defaults' : this._defaults(this.$element);
            break;
            case 'getKey' : this._getKey(this.$element);
            break;
            case 'getValue' : this._getValue(this.$element);
            break;
            case 'editor' : this._editor(this.$element);
            break;
        }
    }
    Select.prototype._show = function(){
        $('.'+this.options.selector).find('.select').hide();
        this.oUl.show();
        this.$element.css('zIndex',20);
    }
    Select.prototype._hide = function(){
        var _this = this;
        setTimeout(function(){
            _this.oUl.hide();
            _this.$element.css('zIndex',2);
        },0);
    }
    Select.prototype._defaults = function(element){
        var _this = this;
        element.on('click','li',function(){
            $(this).addClass('active').siblings().removeClass('active');
            _this.query = $(this).data('key');
            _this.value.html($(this).html());
            _this._hide();
            _this.options.select($(this));
        });
    }
    Select.prototype._getKey = function(element){
        var _this = this;
        element.on('click','li',function(){
            $(this).addClass('active').siblings().removeClass('active');
            _this.query = $(this).data('key');
            _this.value.html($(this).html());
            _this._hide();
            _this.options.select($(this));
        });
    }
    Select.prototype._getValue = function(element){
        var _this = this;
        element.on('click','li',function(){
            $(this).addClass('active').siblings().removeClass('active');
            _this.query = $(this).html();
            _this.value.html($(this).html());
            _this._hide();
            _this.options.select($(this));
        });
    }
    Select.prototype._editor = function(element){
        var _this = this;
        var oldName = '';
        var mouseenter = false;
        element.on('mouseenter ','li',function(){
            mouseenter = true;
            element.find('.value').blur();
        });
        element.on('click','li',function(){
            $(this).addClass('active').siblings().removeClass('active');
            _this.query = $(this).html();
            _this.value.val($(this).html());
            _this._hide();
            _this.options.select($(this));
        });
        element.on('focus','.value',function(){
            oldName = $(this).val();
            _this._show();
        }).on('blur','.value',function(){
            if(!$.trim($(this).val())){
                _this.query = oldName;
                $(this).val(oldName);
            }else{
                if(_this.options.html){
                    _this.query = htmlfilter($(this).val());
                }else{
                    _this.query = $.trim($(this).val());
                }
                $(this).val($.trim($(this).val()))
            }
            !mouseenter &&　_this._hide();
            _this.options.select($(this));
        })
        function htmlfilter(value,parameter){
            var setthe = {},s,p,n;
            if(parameter != undefined){
              setthe.fhtml = parameter.fhtml || true;
              setthe.fjs = parameter.fjs || false;
              setthe.fcss = parameter.fcss || false;
              setthe.fself = parameter.fself || false;
            }else{
              setthe.fhtml = true;
              setthe.fjs = false;
              setthe.fcss = false;
              setthe.fself = false;
            }
            if(typeof value === 'string'){
              s = value;
            }else if(typeof value === 'object'){
              s = value.value;
              p = value.preplace;
              n = value.nextplace;
            }
            if(!s){
              return s;
            }
            if (!setthe.fhtml && !setthe.fjs && !setthe.fcss && !setthe.fself){
              setthe.fhtml = true;
            }
            if (setthe.fjs){
              s = s.replace(/<\s*script[^>]*>(.|[\r\n])*?<\s*\/script[^>]*>/gi, '');
            }
            if (setthe.fcss){
              s = s.replace(/<\s*style[^>]*>(.|[\r\n])*?<\s*\/style[^>]*>/gi, '');
            }
            if (setthe.fhtml) {
              s = s.replace(/<\/?[^>]+>/g, '');
              s = s.replace(/\&[a-z]+;/gi, '');
              s = s.replace(/\s+/g, '\n');
            }

            if (setthe.fself && typeof value === 'object'){
              s = s.replace(new RegExp(p, 'g'), n);
            }
            return s;
        }
    }
    Select.prototype.returnValue = function(){
        return this.query;
    }
    /**
     * [destroy 销毁组件]
     */
    Select.prototype.destroy = function(){
        this.$element.html();
        delete this;
    }
    window.Select = Select;
})();
// 检测是否已经安装flash，检测flash的版本
var flashVersion = (function() {
    var version;
    try {
        version = navigator.plugins[ 'Shockwave Flash' ];
        version = version.description;
    } catch ( ex ) {
        try {
            version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                    .GetVariable('$version');
        } catch ( ex2 ) {
            version = '0.0';
        }
    }
    version = version.match( /\d+/g );
    return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
})();
// 公用指令
angular.module('directives', [])
    .directive('myRadio', ['initData', function (initData) {     //自定义复选框
        return {
            replace: true,
            scope: {
                myQuery: "="
            },
            restrict: 'A',
            template: '<div class="m-radio"></div>',
            link: function (scope, iElm, iAttrs, controller) {
                var list = initData[iAttrs.type],
                    query = scope.myQuery,
                    str = '';
                for (var i = 0, length1 = list.length; i < length1; i++) {
                    str += '<label class="' + (list[i].id === query ? "active" : "") + '" data-id="' + list[i].id + '"><span></span>' + list[i].name + '</label>';
                }
                iElm.html(str);
                iElm.on('click', 'label', function () {
                    var id = $(this).data('id') + '',
                        This = $(this);
                    This.attr('class', 'active').siblings('label').attr('class', '');
                    scope.$apply(function () {
                        scope.myQuery = id;
                    });
                })
            }
        };
    }])
    .directive('myCheckbox', ['initData', function (initData) {     //自定义复选框
        return {
            replace: true,
            scope: {
                myQuery: "="
            },
            restrict: 'A',
            template: '<div class="m-checkbox"></div>',
            link: function (scope, iElm, iAttrs, controller) {
                var list = initData[iAttrs.type],
                    query = scope.myQuery,
                    min = +iAttrs.min,
                    max = +iAttrs.max,
                    str = '';
                for (var i = 0, length1 = list.length; i < length1; i++) {
                    for (var j = 0, length2 = query.length; j < length2; j++) {
                        if (list[i].id === query[j]) {
                            list[i].cur = 'active';
                        }
                    }
                }
                ;
                for (var i = 0, len = list.length; i < len; i++) {
                    str += '<label class="' + list[i].cur + '" data-id="' + list[i].id + '"><span></span>' + list[i].name + '</label>'
                }
                iElm.html(str);
                iElm.on('click', 'label', function () {
                    var id = $(this).data('id') + '',
                        This = $(this);
                    scope.$apply(function () {
                        var len = scope.myQuery.length;
                        if (This.attr('class') === 'active') {
                            if (len <= min) {
                                alert('最少' + min + '项');
                                return;
                            }
                            This.attr('class', '');
                            var index = $.inArray(id, scope.myQuery);
                            scope.myQuery.splice(index, 1)
                        } else {
                            This.attr('class', 'active');
                            scope.myQuery.push(id);
                            scope.myQuery.sort(function (n1, n2) {
                                return n1 - n2    //小到大，否则反正
                            })
                            if (scope.myQuery.length > max) {
                                This.attr('class', '');
                                scope.myQuery.pop();
                                alert('最多' + max + '项');
                                return;
                            }
                        }
                    });
                })
            }
        };
    }])
    .directive('mySelect', ['$timeout', function ($timeout) {     //自定义下拉框
        return {
            replace: true,
            scope: {
                myList: "=",
                myQuery: "="
            },
            restrict: 'A',
            link: function ($scope, iElm, iAttrs, controller) {
                var type = iAttrs.type;
                var obj = angular.element(iElm);
                var select = new Select(obj,{
                    type : type,
                    data : $scope.myList,
                    query : $scope.myQuery,
                    select : function(obj){
                        $timeout(function(){
                            $scope.myQuery = ''+select.returnValue();
                        },0);
                    }
                });
            }
        };
    }])
    .directive('myStylepic', function () {     //装修风格
        return {
            replace: true,
            scope: {
                myList: "=",
                myQuery: "="
            },
            restrict: 'A',
            template: function () {
                return [
                    '<div class="stylePic">',
                    '<div class="pic">',
                    '<ul>',
                    '<li bindonce="myList" ng-repeat="value in myList track by $index" ng-class="{\'active\':myQuery == $index}" ng-click="select($index)">',
                    '<img bo-src-i="{{ value.url }}" bo-alt="value.txt" />',
                    '<p bo-text="value.txt"></p>',
                    '<span><i class="iconfont">&#xe608;</i></span>',
                    '</li>',
                    '</ul>',
                    '</div>',
                    '<div class="toggle">',
                    '<a href="javascript:;" class="btns prev"><i class="iconfont2">&#xe611;</i><span></span></a>',
                    '<a href="javascript:;" class="btns next"><i class="iconfont2">&#xe617;</i><span></span></a>',
                    '</div>',
                    '</div>'
                ].join('');
            },
            controller: ['$scope', function ($scope) {
                $scope.select = function (index) {
                    $scope.myQuery = index + "";
                }
            }],
            link: function ($scope, iElm) {
                var obj = angular.element(iElm),
                    oUl = obj.find('ul'),
                    oPrev = obj.find('.prev'),
                    oNext = obj.find('.next'),
                    i = $scope.myQuery,
                    len = $scope.myList.length,
                    picWidth = 156,
                    iNum = i < 3 ? 0 : i >= len - 3 ? len - 3 : i;
                if (iNum == 0) {
                    oPrev.hide();
                }
                if (iNum == len - 3) {
                    oNext.hide();
                }
                oUl.css({left: -iNum * picWidth});
                oUl.width(len * picWidth);
                obj.on('click','.prev', function () {
                    if (iNum == 0) {
                        iNum = 0;
                    } else {
                        iNum--;
                    }
                    fnMove();
                });
                obj.on('click','.next', function () {
                    if (iNum == len - 3) {
                        iNum = len - 3;
                    } else {
                        iNum++;
                    }
                    fnMove();
                });
                function fnMove() {
                    oUl.stop().animate({left: -iNum * picWidth});
                    oPrev.toggle(iNum !== 0);
                    oNext.toggle(iNum !== len - 3);
                }
            }
        };
    })
    .directive('myCities', ['$timeout', 'initData', function ($timeout, initData) {     //自定义地区选择控件
        return {
            replace: true,
            scope: {
                myProvince: "=",
                myCity: "=",
                myDistrict: "="
            },
            restrict: 'A',
            template: function () {
                return [
                    '<div>',
                    '<div class="k-cities">',
                    '<div class="list province" ng-mouseout="closeSelect()">',
                    '<div class="option" ng-click="open.province()">',
                    '<span class="value" ng-bind="myProvince"></span><span class="arrow"><em></em><i></i></span>',
                    '</div>',
                    '<ul class="select" ng-class="{\'open\':select.provinceShow}" ng-mouseover="closeTimer()">',
                    '<li data-val="{{ p.pid }}" ng-repeat="p in list.province track by p.cid" bindonce="tdist.province" ng-click="select.province($index,p.name)"><a bo-text="p.name"></a></li>',
                    '</ul>',
                    '</div>',
                    '<div class="list city" ng-mouseout="closeSelect()">',
                    '<div class="option" ng-click="open.city()">',
                    '<span class="value" ng-bind="myCity"></span><span class="arrow"><em></em><i></i></span>',
                    '</div>',
                    '<ul class="select" ng-class="{\'open\':select.cityShow && myProvince !== \'请选择省份\'}" ng-mouseover="closeTimer()">',
                    '<li data-val="0" ng-repeat="c in tdist.city[index.province] track by c.cid" bindonce="tdist.city[index.province]"  ng-click="select.city($index,c.name)"><a bo-text="c.name"></a></li>',
                    '</ul>',
                    '</div>',
                    '<div class="list district" ng-mouseout="closeSelect()">',
                    '<div class="option" ng-click="open.district()">',
                    '<span class="value" ng-bind="myDistrict"></span><span class="arrow"><em></em><i></i></span>',
                    '</div>',
                    '<ul class="select" ng-class="{\'open\':select.districtShow && myCity !== \'请选择市\'}" ng-mouseover="closeTimer()">',
                    '<li data-val="0" ng-repeat="d in tdist.district[index.province][index.city] track by d.cid" bindonce="tdist.district[index.province][index.city]"  ng-click="select.district($index,d.name)"><a bo-text="d.name"></a></li>',
                    '</ul>',
                    '</div>',
                    '</div>',
                    '</div>'
                ].join('');
            },
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var timer = null;
                $scope.myProvince = !$scope.myProvince ? '请选择省份' : $scope.myProvince;
                $scope.myCity = !$scope.myCity ? '请选择市' : $scope.myCity;
                $scope.myDistrict = !$scope.myDistrict ? '请选择县/区' : $scope.myDistrict;
                $scope.districtsArr = [];
                $scope.closeTimer = function () {
                    $timeout.cancel(timer);
                };
                $scope.closeSelect = function () {
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        $scope.select.provinceShow = false;
                        $scope.select.cityShow = false;
                        $scope.select.districtShow = false;
                    }, 1000);
                };
                $scope.tdist = initData.tdist;
                $scope.list = {
                    province: $scope.tdist.province,
                    city: [],
                    district: []
                };
                $scope.index = {
                    province: 0,
                    city: 0,
                    district: 0
                };
                if ($scope.myProvince !== '请选择省份') {
                    $scope.index.province = findIndex($scope.tdist.province, $scope.myProvince) < 0 ? 0 : findIndex($scope.tdist.province, $scope.myProvince);
                }
                if ($scope.myCity !== '请选择市') {
                    $scope.index.city = findIndex($scope.tdist.city[$scope.index.province], $scope.myCity) < 0 ? 0 : findIndex($scope.tdist.city[$scope.index.province], $scope.myCity);
                }
                if ($scope.myDistrict !== '请选择县/区') {
                    $scope.index.district = findIndex($scope.tdist.district[$scope.index.province][$scope.index.city], $scope.myDistrict) < 0 ? 0 : findIndex($scope.tdist.district[$scope.index.province][$scope.index.city], $scope.myDistrict);
                }
                function findIndex(arr, name) {
                    var len = arr.length;
                    if (!len) {
                        return 0;
                    }
                    for (var i = 0; i < len; i++) {
                        if (arr[i].name === name) {
                            return i;
                        }
                    }
                    return -1;
                }

                $scope.select = {
                    provinceShow: false,
                    province: function (index, name) {
                        $scope.list.city = [];
                        $scope.index.province = index;
                        this.provinceShow = false;
                        $scope.myProvince = name;
                        $scope.myCity = "请选择市";
                        $scope.myDistrict = "请选择县/区";
                        $scope.select.cityShow = true;
                    },
                    cityShow: false,
                    city: function (index, name) {
                        $scope.list.district = [];
                        $scope.index.city = index;
                        this.cityShow = false;
                        $scope.myCity = name;
                        $scope.myDistrict = "请选择县/区";
                        $scope.select.districtShow = true;
                    },
                    districtShow: false,
                    district: function (index, name) {
                        this.districtShow = false;
                        $scope.myDistrict = name;
                    }
                };
                $scope.open = {
                    province: function () {
                        hide();
                        $scope.select.provinceShow = true;
                    },
                    city: function () {
                        hide();
                        $scope.select.cityShow = true;
                    },
                    district: function () {
                        hide();
                        $scope.select.districtShow = true;
                    }
                };
                function hide() {
                    $timeout.cancel(timer);
                    $scope.select.districtShow = false;
                    $scope.select.provinceShow = false;
                    $scope.select.cityShow = false;
                };
            }]
        }
    }])
    .directive('myServicecities', ['$timeout', 'initData', function ($timeout, initData) {     //自定义地区选择控件
        return {
            "replace": true,
            "scope": {
                "myProvince": "=",
                "myCity": "=",
                "myDistrictarr": "="
            },
            "restrict": "A",
            template: function () {
                return [
                    '<div>',
                    '<div class="k-cities">',
                    '<div class="list province" ng-mouseout="closeSelect()">',
                    '<div class="option" ng-click="open.province()">',
                    '<span class="value" ng-bind="myProvince"></span><span class="arrow"><em></em><i></i></span>',
                    '</div>',
                    '<ul class="select" ng-class="{\'open\':select.provinceShow}" ng-mouseover="closeTimer()">',
                    '<li data-val="{{ p.pid }}" ng-repeat="p in tdist.province track by p.cid" bindonce="tdist.province" ng-click="select.province($index,p.name)"><a bo-text="p.name"></a></li>',
                    '</ul>',
                    '</div>',
                    '<div class="list city" ng-mouseout="closeSelect()">',
                    '<div class="option" ng-click="open.city()">',
                    '<span class="value" ng-bind="myCity"></span><span class="arrow"><em></em><i></i></span>',
                    '</div>',
                    '<ul class="select" ng-class="{\'open\':select.cityShow && myProvince !== \'请选择省份\'}" ng-mouseover="closeTimer()">',
                    '<li data-val="0" ng-repeat="c in tdist.city[index.province] track by c.cid" bindonce="tdist.city[index.province]"  ng-click="select.city($index,c.name)"><a bo-text="c.name"></a></li>',
                    '</ul>',
                    '</div>',
                    '<div class="list alert" ng-if="!myDistrict">',
                    '<p>目前装修城市仅支持湖北省武汉市</p>',
                    '</div>',
                    '</div>',
                    '<div class="k-cities-checkbox">',
                    '<div style="width:670px" ng-if="!!districtsArr.length">',
                    '<div class="m-checkbox">',
                    '<label ng-repeat="list in districtsArr" bindonce="districtsArr" ng-class="{\'active\':list.cur}" ng-click="dec_districtsBtn($index,list.cur,list.name)"><span></span><i bo-text="list.name"></i></label>',
                    '</div>',
                    '<p ng-if="districtsArr.length == 0">该市下面没有县或区</p>',
                    '</div>',
                    '</div>'
                ].join('');
            },
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var timer = null;
                $scope.myProvince = $scope.myProvince == undefined ? '请选择省份' : $scope.myProvince;
                $scope.myCity = $scope.myCity == undefined ? '请选择市' : $scope.myCity;
                $scope.districtsArr = [];
                $scope.closeTimer = function () {
                    $timeout.cancel(timer);
                };
                $scope.closeSelect = function () {
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        $scope.select.provinceShow = false;
                        $scope.select.cityShow = false;
                        $scope.select.districtShow = false;
                    }, 1000);
                };
                $scope.tdist = initData.tdist;
                $scope.index = {
                    province: 0,
                    city: 0,
                    district: 0
                };
                if ($scope.myProvince !== '请选择省份') {
                    $scope.index.province = findIndex($scope.tdist.province, $scope.myProvince) < 0 ? 0 : findIndex($scope.tdist.province, $scope.myProvince);
                }
                if ($scope.myCity !== '请选择市') {
                    $scope.index.city = findIndex($scope.tdist.city[$scope.index.province], $scope.myCity) < 0 ? 0 : findIndex($scope.tdist.city[$scope.index.province], $scope.myCity);
                }
                if ($scope.myDistrict !== '请选择县/区') {
                    $scope.index.district = findIndex($scope.tdist.district[$scope.index.province][$scope.index.city], $scope.myDistrict) < 0 ? 0 : findIndex($scope.tdist.district[$scope.index.province][$scope.index.city], $scope.myDistrict);
                }

                function findIndex(arr, name) {
                    var len = arr.length;
                    if (!len) {
                        return 0;
                    }
                    for (var i = 0; i < len; i++) {
                        if (arr[i].name === name) {
                            return i;
                        }
                    }
                    return -1;
                }

                if ($scope.myDistrictarr != undefined) {
                    var districts = $scope.tdist.district[$scope.index.province][$scope.index.city];
                    angular.forEach(districts, function (v) {
                        for (var i = 0, len = $scope.myDistrictarr.length; i < len; i++) {
                            if (v.name === $scope.myDistrictarr[i]) {
                                v.cur = true;
                                break;
                            }
                            v.cur = false;
                        }
                        $scope.districtsArr.push(v);
                    });
                }

                $scope.dec_districtsBtn = function (index, off, name) {
                    if (!off) {  //添加
                        $scope.myDistrictarr.push(name);
                    } else { //删除
                        if ($scope.myDistrictarr.length <= 1) {
                            alert('最少1项');
                            return;
                        }
                        $scope.myDistrictarr = _.remove($scope.myDistrictarr, function (n) {
                            return n !== name;
                        });
                    }
                    $scope.districtsArr[index].cur = !$scope.districtsArr[index].cur;
                };
                $scope.select = {
                    provinceShow: false,
                    province: function (index, name) {
                        $scope.index.province = index;
                        this.provinceShow = false;
                        $scope.myProvince = name;
                        $scope.myCity = "请选择市";
                        if (!!$scope.myDistrict) {
                            $scope.myDistrict = "请选择县/区";
                        }
                        if (!$scope.myDistrict) {
                            $scope.myDistrictarr = [];
                        }
                        $scope.select.cityShow = true;
                    },
                    cityShow: false,
                    city: function (index, name) {
                        $scope.index.city = index;
                        this.cityShow = false;
                        $scope.myCity = name;
                        if (!!$scope.myDistrict) {
                            $scope.myDistrict = "请选择县/区";
                        }
                        $scope.select.districtShow = true;
                        if (!$scope.myDistrict) {
                            $scope.myDistrictarr = [];
                            $scope.districtsArr = [];
                            angular.forEach($scope.tdist.district[$scope.index.province][$scope.index.city], function (v) {
                                v.cur = false;
                                $scope.districtsArr.push(v);
                            });
                        }
                    },
                    districtShow: false,
                    district: function (index, name) {
                        this.districtShow = false;
                        $scope.myDistrict = name;
                    }
                };
                $scope.open = {
                    province: function () {
                        hide();
                        $scope.select.provinceShow = true;
                    },
                    city: function () {
                        hide();
                        $scope.select.cityShow = true;
                    },
                    district: function () {
                        hide();
                        $scope.select.districtShow = true;
                    }
                };
                function hide() {
                    $timeout.cancel(timer);
                    $scope.select.districtShow = false;
                    $scope.select.provinceShow = false;
                    $scope.select.cityShow = false;
                };
            }]
        }
    }])
    .directive('mySimpleupload', ['$timeout',function ($timeout) { //单个图片上传
        return {
            "restrict" : 'A',
            "scope" : {
                "myId" : "@",
                "myWidth" : "@",
                "myHeight" : "@",
                "myQuery" : "=",
                "myLoading" : "="
            },
            "template": '<div class="simpleupload card-upload">\
                            <div class="queue-item" ng-if="uploader.loading >= 0 && uploader.show">\
                                <span class="loading" ng-if="!uploader.errorMsg" ng-bind="uploader.loading">0</span>\
                                <span class="uploading" ng-if="!uploader.errorMsg"><i class="ing" ng-bind="uploader.status"></i></span>\
                                <span class="error" ng-bind="uploader.errorMsg"></span>\
                                <span class="progress"  ng-if="!uploader.errorMsg"><span ng-style="{width:uploader.progress}"></span></span>\
                                <span class="cancel" ng-click="cancel(uploader.file)"><i class="iconfont">&#xe642;</i></span>\
                            </div>\
                            <div class="create">\
                                <div class="fileBtn" id="{{myId}}"></div>\
                                <img class="img" ng-src="/api/v2/web/thumbnail2/{{myWidth}}/{{myHeight}}/{{myQuery}}" ng-if="myQuery" alt=""/>\
                                <div class="tips"><span><em></em><i></i></span>\
                                    <p>请上传3M以内jpg/png格式的图片</p></div>\
                            </div>\
                            <div class="disable" ng-if="myLoading"></div>\
                        </div>',
            "link" : function (scope, iElm, iAttrs, controller) {
                var $cropMask = $('#j-cropMask'),
                    $cropBox = $('#j-cropBox'),
                    $cropCancel = $('#crop-cancel'),
                    $target = $('#target'),
                    boxW = scope.myWidth,
                    boxH = scope.myHeight,
                    minW = !!iAttrs.minwidth ? parseInt(iAttrs.minwidth,10) : boxW,
                    minH = !!iAttrs.minheight ? parseInt(iAttrs.minheight,10) : boxH,
                    $winW = 0,
                    $winH = 0,
                    obj = angular.element(iElm),
                    recordImgId = scope.myQuery;
                    scope.uploader = null;
                if(WebUploader.browser.ie && !flashVersion){
                    alert('您的浏览器没有安装flash插件，或者flash版本过低，请及时更新。');
                    return ;
                }
                var uploader = new WebUploader.Uploader({
                        "pick": {
                            "id": obj.find('.fileBtn'),
                            "label": ""
                        },
                        "paste": document.body,
                        "accept": {
                            "title": "Images",
                            "extensions": "jpg,jpeg,png",
                            "mimeTypes": "image/*"
                        },
                        "method": "post",
                        "timeout" : 240000,
                        "fileVal" : "Filedata",
                        "auto": true,
                        "swf": "/static/js/lib/Uploader.swf",
                        "disableGlobalDnd": true,
                        "chunked": true,
                        "server": "/api/v2/web/image/upload",
                        "fileNumLimit": 1,
                        "fileSingleSizeLimit": 3145728
                    });
                uploader.addButton({
                    id: obj.find('.fileBtn'),
                    label: ''
                });
                uploader.reset();
                uploader.on( 'fileQueued', function( file ) {   //当文件被加入队列以后触发。
                    $timeout(function () {
                        scope.uploader = {
                            file : file,
                            fileid : file.id,
                            filename : file.name,
                            status : '等待...',
                            errorMsg : '',
                            loading: 0,
                            progress : '0%',
                            show : true
                        };
                        scope.myLoading = true;
                    }, 0);
                });
                uploader.on( 'uploadProgress', function( file, percentage ) {  //上传过程中触发，携带上传进度。
                    $timeout(function () {
                        scope.uploader.loading = parseInt(percentage*100,10);
                        if(scope.uploader.loading > 0 && scope.uploader.loading < 100){
                            scope.uploader.status = '上传中';
                        }
                        if(scope.uploader.loading == 100){
                            scope.uploader.status = '上传完成';
                        }
                        scope.uploader.progress = scope.uploader.loading + '%';
                    }, 0);
                });
                uploader.on( 'uploadSuccess', function( file , data) {  //当文件上传成功时触发。
                    if (iAttrs.scale === undefined) {
                        callbackImg(data.data);
                    } else {
                        $winW = $(window).width();
                        $winH = $(window).height();
                        $cropMask.css({
                            'width' : $winW,
                            'height': $winH
                        }).fadeTo("slow", 0.3);
                        callbackCropImg(data.data);
                    }
                    uploader.removeFile( file.id , true);
                    $timeout(function () {
                        scope.uploader.status = '加载图片';
                    }, 0);
                });
                uploader.on( 'uploadError', function( file ) {   //当文件上传出错时触发。
                    //console.log('uploadError：',arguments)
                    $timeout(function () {
                        scope.uploader.errorMsg = '上传失败';
                    }, 0);
                });
                uploader.on( 'startUpload', function( file ) {  //当开始上传流程时触发。
                    //console.log('startUpload：',arguments)
                });
                uploader.on('error',function(error){   //当validate不通过时
                    if(error === 'F_EXCEED_SIZE'){
                        alert('图片大小超出限制。');
                    }
                    if(error === 'F_DUPLICATE'){
                        alert('图片已经上传过了，请不要重复上传。');
                    }
                });
                uploader.on( 'uploadFinished', function( file ) {   //当所有文件上传结束时触发。
                    //console.log('uploadFinished：',arguments)
                });
                uploader.on( 'uploadComplete', function( file ) {   //不管成功或者失败，文件上传完成时触发。
                    //console.log('uploadComplete：',file)
                    obj.find('.disable').remove();
                });
                scope.cancel = function(file){
                    uploader.cancelFile( file );
                    scope.uploader = null;
                    scope.myLoading = false;
                }
                function callbackImg(data) {
                    var img = new Image();
                    img.onload = function () {
                        scope.$apply(function () {
                            scope.myQuery = data;
                            scope.myLoading = false;
                            scope.uploader.show = false;
                        });
                    };
                    img.onerror = function () {
                        alert("图片加载错误");
                        $timeout(function () {
                            scope.myLoading = false;
                            scope.uploader.show = false;
                        }, 0);
                    };
                    img.src = '/api/v2/web/thumbnail2/'+scope.myWidth+'/'+scope.myHeight+'/' + data;
                }
                var jcrop_api;
                var jcrop_data;
                function callbackCropImg(data) {
                    var img = new Image();
                    img.onload = function () {
                        this.onload = this.error = null;
                        var imgW = this.width;
                        var imgH = this.height;
                        if (imgW < minW) {
                            alert('图片宽度小于'+minW+'，请重新上传');
                            return false;
                        }
                        if (imgH < minH) {
                            alert('图片高度小于'+minH+'，请重新上传');
                            return false;
                        }
                        var scale = ($winH - 286) / imgH;
                        var w = imgH > $winH - 286 ? imgW * scale : imgW;
                        var h = imgH > $winH - 286 ? imgH * scale : imgH;
                        $target.attr('src', img.src).Jcrop({
                            "boxWidth"    : w,
                            "boxHeight"   : h,
                            "keySupport"  : true,
                            "bgFade"      : true,
                            "bgOpacity"   : .2,
                            "setSelect"   : [0, 0, minW, minH],   //裁剪框初始位置和初始大小
                            "minSize"     : [minW, minH], //最小裁切框大小 注0,0表示不限
                            "maxSize"     : [0, 0], //最大裁切框大小 注0,0表示不限
                            "aspectRatio" : iAttrs.scale, //最大裁切宽高比 注0表示不限
                            onChange: function (c) {    //拖拽时候函数，返回位置和宽高
                                jcrop_data = c;
                            }
                        }, function () {
                            jcrop_api = this;   //返回对象，供销毁操作
                        });
                        $cropBox.css({
                            'width'      : w,
                            'marginLeft' : -(w / 2)
                        }).show().animate({
                            top: 100
                        });
                        $timeout(function () {
                            scope.myLoading = false;
                            scope.uploader.show = false;
                        }, 0);
                    };
                    img.onerror = function () {
                        alert("图片加载错误");
                        $timeout(function () {
                            scope.myLoading = false;
                            scope.uploader.show = false;
                        }, 0);
                        $cropMask.hide();
                    };
                    img.src = '/api/v2/web/image/' + data;
                    $cropCancel.on('click', function () {
                        clearData();
                        data = null;
                    });
                    $('#crop-submit').on('click', function () {
                        if (data != null) {
                            $.ajax({
                                url: '/api/v2/web/image/crop',
                                type: "post",
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                data: JSON.stringify({
                                    "_id": data,
                                    "x": jcrop_data.x,
                                    "y": jcrop_data.y,
                                    "width": jcrop_data.w,
                                    "height": jcrop_data.h
                                }),
                                processData: false
                            })
                            .done(function (res) {
                                scope.$apply(function () {
                                    scope.myQuery = res.data;
                                    scope.myLoading = false;
                                    scope.uploader.show = false;
                                });
                                clearData();
                                data = null;
                            })
                            .fail(function () {
                                console.log("error");
                            })
                        }
                    })
                }
                function clearData() {
                    $cropMask.hide();
                    $cropBox.hide();
                    jcrop_api.destroy();
                    $target.attr('src', '');
                }
                scope.$on('$destroy', function () {
                    uploader.destroy();
                });
            }
        };
    }])
    .directive('myInsertimage1', ['$timeout', function ($timeout) {     //多图片上传
        return {
            scope: {
                myId : '@',
                myQuery: "=",
                myComplete : "=",
                myLoading : "="
            },
            restrict: 'A',
            template: function (obj, attr) {
                var template = [
                    '<div class="k-uploadbox f-cb ' + attr.type + '">',
                    '<div class="item" ng-repeat="img in arr">',
                    '<div class="queue-item" ng-if="img.show">',
                    '<span class="loading" ng-bind="img.loading" ng-if="!img.error"></span>',
                    '<span class="uploading" ng-if="!img.error"><i class="ing" ng-bind="img.status"></i></span>',
                    '<span class="filename" ng-bind="img.filename"></span>',
                    '<span class="error" ng-if="img.error" ng-bind="img.errorMsg"></span>',
                    '<span class="progress" ng-if="!img.error"><span ng-style="{width:img.progress}"></span></span>',
                    '<span class="cancel" ng-click="cancel(img.file,img.fileid)"><i class="iconfont">&#xe642;</i></span>',
                    '</div>',
                    '<div ng-if="img.award_imageid">',
                    '<span class="view" ng-click="viewImg(img.award_imageid)"><i class="iconfont">&#xe645;</i></span>',
                    '<span class="mask"></span>',
                    '<span class="close" ng-click="removeImg($index,arr)"><i class="iconfont">&#xe642;</i></span>',
                    '<div class="img">',
                    '<img ng-src="/api/v2/web/thumbnail2/168/168/{{img.award_imageid}}" />',
                    '</div>',
                    '</div>',
                    '<textarea placeholder="在此添加描述" class="input textarea" ng-model="img.description" name="itme_con" cols="30" rows="10"></textarea>',
                    '</div>',
                    '<div class="pic" id="create">',
                    '<div class="disable" ng-if="myLoading"></div>',
                    '<div class="fileBtn" id="{{myId}}">',
                    '</div><div class="tips"><span><em></em><i></i></span>',
                    '<p>图片上传每张3M以内<br />jpg/png格式<br /><br /><strong>作品/照片/平面图上均不能放置个人电话号码或违反法律法规的信息。</strong></p>',
                    '</div></div></div></div></div>'
                ];
                return template.join('');
            },
            link: function (scope, iElm, iAttrs, controller) {
                var type = scope.myType;
                var obj = angular.element(iElm);
                scope.arr =  angular.copy(scope.myQuery);
                if(WebUploader.browser.ie && !flashVersion){
                    alert('您的浏览器没有安装flash插件，或者flash版本过低，请及时更新。');
                    return ;
                }
                var uploaderUid = 0;
                var uploader = new WebUploader.Uploader({
                    pick: {
                        id: obj.find('.fileBtn'),
                        label: '',
                        multiple : true
                    },
                    paste: document.body,
                    accept: {
                        title: 'Images',
                        extensions: 'jpg,jpeg,png',
                        mimeTypes: 'image/*'
                    },
                    'method': 'post',
                    'timeout' : 4 * 60 * 1000,    // 3分钟
                    'fileVal' : 'Filedata',
                    'auto': true, //自动上传
                    //'runtimeOrder':'flash',   //  [默认值：html5,flash] 指定运行时启动顺序 调试用
                    // swf文件路径
                    swf: '/static/js/lib/Uploader.swf',
                    disableGlobalDnd: true,
                    chunked: true,
                    server: '/api/v2/web/image/upload',
                    fileNumLimit: 100,    //允许上传100张图片
                    fileSingleSizeLimit: 3 * 1024 * 1024    // 3 M 单个文件大小
                });
                uploader.reset();
                uploader.addButton({
                    id: obj.find('.fileBtn'),
                    label: '',
                    multiple : true
                });
                uploader.on( 'fileQueued', function( file ) {   //当文件被加入队列以后触发。
                    uploaderUid ++;
                    $timeout(function () {
                        scope.arr.push({
                            file : file,
                            fileid : file.id,
                            filename : file.name,
                            status : '等待...',
                            errorMsg : '',
                            loading: 0,
                            progress : '0%',
                            show : true,
                            description : ''
                        })
                        scope.myComplete = true;
                        scope.myLoading = true;
                    }, 0);
                });
                uploader.on( 'uploadProgress', function( file, percentage ) {  //上传过程中触发，携带上传进度。
                    $timeout(function () {
                        var index = _.findIndex(scope.arr,{'fileid':file.id});
                        if (index >= 0) {
                                scope.arr[index].loading = parseInt(percentage*100,10);
                                if(scope.arr[index].loading > 0 && scope.arr[index].loading < 100){
                                    scope.arr[index].status = '上传中';
                                }
                                if(scope.arr[index].loading == 100){
                                    scope.arr[index].status = '上传完成';
                                }
                                scope.arr[index].progress = scope.arr[index].loading+'%';
                            }
                    }, 0);
                });
                uploader.on( 'uploadSuccess', function( file , data) {  //当文件上传成功时触发。
                    if(uploaderUid-- == 1){
                        callbackImg(data.data, file,'Complete');
                    }else{
                        callbackImg(data.data, file,'Loading');
                    }
                    uploader.removeFile( file.id , true);
                    $timeout(function () {
                        var index = _.findIndex(scope.arr,{'fileid':file.id});
                        if (index >= 0) {
                            scope.arr[index].status = '加载图片';
                        }
                    }, 0);
                });
                uploader.on( 'uploadError', function( file ) {   //当文件上传出错时触发。
                    //console.log('uploadError：',arguments)
                    var item = $( '#'+file.id );
                        item.find('.error').html('上传失败');
                    $timeout(function () {
                        var index = _.findIndex(scope.arr,{'fileid':file.id});
                        if (index >= 0) {
                            scope.arr[index].errorMsg = '上传失败';
                        }
                    }, 0);
                });
                uploader.on( 'startUpload', function( file ) {  //当开始上传流程时触发。
                    //console.log('startUpload：',arguments)
                });
                uploader.on('error',function(error){   //当validate不通过时
                    if(error === 'F_EXCEED_SIZE'){
                        alert('图片大小超出限制。');
                    }
                    if(error === 'F_DUPLICATE'){
                        alert('图片已经上传过了，请不要重复上传。');
                    }
                });
                uploader.on( 'uploadFinished', function( file ) {   //当所有文件上传结束时触发。
                    //console.log('uploadFinished：',arguments)
                });
                uploader.on( 'uploadComplete', function( file ) {   //不管成功或者失败，文件上传完成时触发。
                    //console.log('uploadComplete：',file)
                    obj.find('.disable').remove();
                });
                function callbackImg(data, file,status) {
                    var img = new Image();
                    img.onload = function () {
                        this.onload = this.error = null;
                        scope.$apply(function () {
                            if(_.findIndex(scope.arr,{'award_imageid':data}) == -1){
                                var old = scope.arr[_.findIndex(scope.arr,{'fileid':file.id})];
                                scope.arr[_.findIndex(scope.arr,{'fileid':file.id})] = {
                                    "award_imageid": data,
                                    "description": old.description
                                };
                                scope.myQuery = angular.copy(scope.arr);
                                old = null;
                            }else{
                                alert('已经上传过了');
                                scope.myQuery = _.remove(scope.arr, function(n) {
                                  return n.fileid != id;
                                });
                            }
                            if(status == 'Complete'){
                                scope.myComplete = false;
                                scope.myLoading = false;
                            }
                        });
                    }
                    img.onerror = function () {
                        alert("图片加载错误");
                        obj.find('.pic').find('.disable').remove();
                    };
                    img.src = '/api/v2/web/thumbnail2/168/168/' + data;
                }
                scope.cancel = function (file) {
                    uploader.cancelFile( file );
                    $timeout(function () {
                        if(uploaderUid-- == 1){
                            scope.myComplete = false;
                            scope.myLoading = false;
                        }
                        scope.myQuery = scope.arr = _.remove(scope.arr, function(n) {
                            return n.fileid != file.id;
                        });
                    }, 0);
                }
                scope.removeImg = function (i, arr) {
                    var cover = '';
                    if (confirm("您确定要删除吗？删除不能恢复")) {
                        arr.splice(i, 1);
                        $timeout(function () {
                            scope.myCover = cover;
                            scope.myQuery = arr;
                        }, 0);
                    }
                };
                scope.$on('$destroy', function () {
                    uploader.destroy();
                });
                scope.viewImg = function (id) {
                    bigImg(id);
                };
                scope.setImg = function (id) {
                    $timeout(function () {
                        scope.myCover = id;
                    }, 0);
                };
                function bigImg(id) {
                    var modat = '<div class="modal-dialog"><span class="close"><i class="iconfont">&#xe642;</i></span>';
                    modat += '<img class="img" src="" /></div>';
                    var $modal = $('<div class="k-modal viewImg" id="j-modal">' + modat + '</div>'),
                        $backdrop = $('<div class="k-modal-backdrop" id="j-modal-backdrop"></div>');
                    var doc = $('body');
                    doc.append($backdrop);
                    doc.append($modal);
                    var winW = $(window).width();
                    var winH = $(window).height();
                    var $settes = $modal.find('.settes');
                    var $img = $modal.find('.img');
                    var $close = $modal.find('.close');
                    $close.on('click', function () {
                        $modal.remove();
                        $backdrop.remove();
                        $img.attr('src', '');
                    });
                    $img.on('dblclick',function(){
                        $close.trigger('click');
                    });
                    var w = winW > 1200 ? 1200 : winW <= 1200 ? 1000 : winW;
                    var h = winH - 100;
                    var img = new Image();
                    $backdrop.fadeIn();
                    img.onload = function () {
                        this.onload = this.onerror = null;
                        var imgW,imgH;
                        if(this.width >= w){
                            if(this.width > this.height){
                                imgW = w;
                                imgH =  w/this.width*this.height;
                            }else if(this.width < this.height){
                                imgH = h;
                                imgW =  h/this.height*this.width;
                            }else{
                                imgW = imgH = h;
                            }
                        }else if(this.height >= h){
                            imgH = h;
                            imgW = h/this.height*this.width;
                        }else{
                            imgW = this.width;
                            imgH =  this.height;
                        }
                        $img.css({
                            width: imgW,
                            height: imgH
                        }).attr('src', this.src);
                        $modal.find('.modal-dialog').css({
                            'width'    : imgW,
                            'height'   : imgH,
                            'marginTop': (winH - imgH) / 2
                        });
                        $modal.fadeIn();
                    }
                    img.src = '/api/v2/web/image/' + id;
                }
            }
        };
    }])
    .directive('myInsertimage2', ['$timeout', function ($timeout) {     //多图片上传
        return {
            scope: {
                myId : '@',
                myQuery: "=",
                mySection: "=",
                myCover: "=",
                myComplete : "=",
                myLoading : "="
            },
            restrict: 'A',
            template: function (obj, attr) {
                var template = [
                    '<div class="k-uploadbox f-cb ' + attr.type + '">',
                    '<div class="item" ng-repeat="img in myQuery">',
                    '<div class="queue-item" ng-if="img.show">',
                    '<span class="loading" ng-bind="img.loading" ng-if="!img.error"></span>',
                    '<span class="uploading" ng-if="!img.error"><i class="ing" ng-bind="img.status"></i></span>',
                    '<span class="filename" ng-bind="img.filename"></span>',
                    '<span class="error" ng-if="img.error" ng-bind="img.errorMsg"></span>',
                    '<span class="progress" ng-if="!img.error"><span ng-style="{width:img.progress}"></span></span>',
                    '<span class="cancel" ng-click="cancel(img.file,img.fileid)"><i class="iconfont">&#xe642;</i></span>',
                    '</div>',
                    '<div ng-if="img.imageid">',
                    '<span class="cover" ng-if="myCover == img.imageid">封面</span>',
                    '<span class="settes" ng-if="myCover != img.imageid" ng-click="setImg(img.imageid)">设为封面</span>',
                    '<span class="view" ng-click="viewImg(img.imageid)"><i class="iconfont">&#xe645;</i></span>',
                    '<span class="mask"></span>',
                    '<span class="close" ng-click="removeImg($index,myQuery)"><i class="iconfont">&#xe642;</i></span>',
                    '<div class="img">',
                    '<img ng-src="/api/v2/web/thumbnail2/168/168/{{img.imageid}}" />',
                    '</div>',
                    '</div>',
                    '<div my-select ng-if="mySection.length" data-type="editor" my-list="mySection" my-query="img.section"></div>',
                    '<textarea placeholder="在此添加描述" class="input textarea" ng-model="img.description" name="itme_con" cols="30" rows="10"></textarea>',
                    '</div>',
                    '<div class="pic" id="create">',
                    '<div class="disable" ng-if="myLoading"></div>',
                    '<div class="fileBtn" id="{{myId}}">',
                    '</div><div class="tips"><span><em></em><i></i></span>',
                    '<p>图片上传每张3M以内<br />jpg/png格式<br /><br /><strong>作品/照片/平面图上均不能放置个人电话号码或违反法律法规的信息。</strong></p>',
                    '</div></div></div></div></div>'
                ];
                return template.join('');
            },
            link: function (scope, iElm, iAttrs, controller) {
                var type = scope.myType;
                var obj = angular.element(iElm);
                if(WebUploader.browser.ie && !flashVersion){
                    alert('您的浏览器没有安装flash插件，或者flash版本过低，请及时更新。');
                    return ;
                }
                var uploaderUid = 0;
                var uploader = new WebUploader.Uploader({
                    pick: {
                        id: obj.find('.fileBtn'),
                        label: '',
                        multiple : true
                    },
                    paste: document.body,
                    accept: {
                        title: 'Images',
                        extensions: 'jpg,jpeg,png',
                        mimeTypes: 'image/*'
                    },
                    'method': 'post',
                    'timeout' : 4 * 60 * 1000,    // 3分钟
                    'fileVal' : 'Filedata',
                    'auto': true, //自动上传
                    //'runtimeOrder':'flash',   //  [默认值：html5,flash] 指定运行时启动顺序 调试用
                    // swf文件路径
                    swf: '/static/js/lib/Uploader.swf',
                    disableGlobalDnd: true,
                    chunked: true,
                    server: '/api/v2/web/image/upload',
                    fileNumLimit: 100,    //允许上传100张图片
                    fileSingleSizeLimit: 3 * 1024 * 1024    // 3 M 单个文件大小
                });
                uploader.reset();
                uploader.addButton({
                    id: obj.find('.fileBtn'),
                    label: '',
                    multiple : true
                });
                uploader.on( 'fileQueued', function( file ) {   //当文件被加入队列以后触发。
                    uploaderUid ++;
                    $timeout(function () {
                        scope.myQuery.push({
                            file : file,
                            fileid : file.id,
                            filename : file.name,
                            status : '等待...',
                            errorMsg : '',
                            loading: 0,
                            progress : '0%',
                            show : true,
                            section :'客厅',
                            description : ''
                        })
                        scope.myComplete = true;
                        scope.myLoading = true;
                    }, 0);
                });
                uploader.on( 'uploadProgress', function( file, percentage ) {  //上传过程中触发，携带上传进度。
                    $timeout(function () {
                        var index = _.findIndex(scope.myQuery,{'fileid':file.id});
                        if (index >= 0) {
                                scope.myQuery[index].loading = parseInt(percentage*100,10);
                                if(scope.myQuery[index].loading > 0 && scope.myQuery[index].loading < 100){
                                    scope.myQuery[index].status = '上传中';
                                }
                                if(scope.myQuery[index].loading == 100){
                                    scope.myQuery[index].status = '上传完成';
                                }
                                scope.myQuery[index].progress = scope.myQuery[index].loading+'%';
                            }
                    }, 0);
                });
                uploader.on( 'uploadSuccess', function( file , data) {  //当文件上传成功时触发。
                    if(uploaderUid-- == 1){
                        callbackImg(data.data, file,'Complete');
                    }else{
                        callbackImg(data.data, file,'Loading');
                    }
                    uploader.removeFile( file.id , true);
                    $timeout(function () {
                        var index = _.findIndex(scope.myQuery,{'fileid':file.id});
                        if (index >= 0) {
                            scope.myQuery[index].status = '加载图片';
                        }
                    }, 0);
                });
                uploader.on( 'uploadError', function( file ) {   //当文件上传出错时触发。
                    //console.log('uploadError：',arguments)
                    var item = $( '#'+file.id );
                        item.find('.error').html('上传失败');
                    $timeout(function () {
                        var index = _.findIndex(scope.myQuery,{'fileid':file.id});
                        if (index >= 0) {
                            scope.myQuery[index].errorMsg = '上传失败';
                        }
                    }, 0);
                });
                uploader.on( 'startUpload', function( file ) {  //当开始上传流程时触发。
                    //console.log('startUpload：',arguments)
                });
                uploader.on('error',function(error){   //当validate不通过时
                    if(error === 'F_EXCEED_SIZE'){
                        alert('图片大小超出限制。');
                    }
                    if(error === 'F_DUPLICATE'){
                        alert('图片已经上传过了，请不要重复上传。');
                    }
                });
                uploader.on( 'uploadFinished', function( file ) {   //当所有文件上传结束时触发。
                    //console.log('uploadFinished：',arguments)
                    obj.find('.disable').remove();
                });
                uploader.on( 'uploadComplete', function( file ) {   //不管成功或者失败，文件上传完成时触发。
                    //console.log('uploadComplete：',file)
                    obj.find('.disable').remove();
                });
                function callbackImg(data, file,status) {
                    var img = new Image();
                    img.onload = function () {
                        this.onload = this.error = null;
                        scope.$apply(function () {
                            if(_.findIndex(scope.myQuery,{'imageid':data}) == -1){
                                var old = scope.myQuery[_.findIndex(scope.myQuery,{'fileid':file.id})];
                                scope.myQuery[_.findIndex(scope.myQuery,{'fileid':file.id})] = {
                                    "section": old.section,
                                    "imageid": data,
                                    "description": old.description
                                };
                                if(!scope.myCover){
                                    scope.myCover = scope.myQuery[0].imageid;
                                };
                                old = null;
                            }else{
                                alert('已经上传过了');
                                scope.myQuery = _.remove(scope.myQuery, function(n) {
                                  return n != id;
                                });
                            }
                            if(status == 'Complete'){
                                scope.myComplete = false;
                                scope.myLoading = false;
                            }
                        });
                    }
                    img.onerror = function () {
                        alert("图片加载错误");
                        obj.find('.pic').find('.disable').remove();
                    };
                    img.src = '/api/v2/web/thumbnail2/168/168/' + data;
                }
                scope.cancel = function (file) {
                    uploader.cancelFile( file );

                    $timeout(function () {
                        if(uploaderUid-- == 1){
                            scope.myComplete = false;
                            scope.myLoading = false;
                        }
                        scope.myQuery = _.remove(scope.myQuery, function(n) {
                            return n.fileid != file.id;
                        });
                    }, 0);
                }
                scope.removeImg = function (i, arr,id) {
                    var cover = '';
                    if (confirm("您确定要删除吗？删除不能恢复")) {
                        if (scope.myCover && arr[i].imageid === scope.myCover) {
                            if (arr.length > 0 && i != 0) {
                                cover = arr[0].imageid;
                            } else if (arr.length > 0 && arr.length != 1 && i == 0) {
                                cover = arr[1].imageid;
                            } else if (arr.length == 1 && i == 0) {
                                cover = "";
                            }
                        } else {
                            cover = scope.myCover;
                        }
                        arr.splice(i, 1);
                        $timeout(function () {
                            scope.myCover = cover;
                            scope.myQuery = arr;
                        }, 0);
                    }
                };
                scope.$on('$destroy', function () {
                    uploader.destroy();
                });
                scope.viewImg = function (id) {
                    bigImg(id);
                };
                scope.setImg = function (id) {
                    $timeout(function () {
                        scope.myCover = id;
                    }, 0);
                };
                function bigImg(id) {
                    var modat = '<div class="modal-dialog"><span class="close"><i class="iconfont">&#xe642;</i></span>';
                    if (id === scope.myCover) {
                        modat += '<span class="settes" style="cursor:default;">已设为封面</span>';
                    } else {
                        modat += '<span class="settes" style="color: #fff">设为封面</span>';
                    }
                    modat += '<img class="img" src="" /></div>';
                    var $modal = $('<div class="k-modal viewImg" id="j-modal">' + modat + '</div>'),
                        $backdrop = $('<div class="k-modal-backdrop" id="j-modal-backdrop"></div>');
                    var doc = $('body');
                    doc.append($backdrop);
                    doc.append($modal);
                    var winW = $(window).width();
                    var winH = $(window).height();
                    var $settes = $modal.find('.settes');
                    var $img = $modal.find('.img');
                    var $close = $modal.find('.close');
                    $close.on('click', function () {
                        $modal.remove();
                        $backdrop.remove();
                        $img.attr('src', '');
                    });
                    $img.on('dblclick',function(){
                        $close.trigger('click');
                    });
                    $settes.on('click', function () {
                        if ($(this).html() === '设为封面') {
                            $(this).html('已设为封面').css('color','#ccc');
                            $timeout(function () {
                                scope.myCover = id;
                            }, 0);
                            $close.trigger('click');
                        }
                        return ;
                    });
                    var w = winW > 1200 ? 1200 : winW <= 1200 ? 1000 : winW;
                    var h = winH - 100;
                    var img = new Image();
                    $backdrop.fadeIn();
                    img.onload = function () {
                        this.onload = this.onerror = null;
                        var imgW,imgH;
                        if(this.width >= w){
                            if(this.width > this.height){
                                imgW = w;
                                imgH =  w/this.width*this.height;
                            }else if(this.width < this.height){
                                imgH = h;
                                imgW =  h/this.height*this.width;
                            }else{
                                imgW = imgH = h;
                            }
                        }else if(this.height >= h){
                            imgH = h;
                            imgW = h/this.height*this.width;
                        }else{
                            imgW = this.width;
                            imgH =  this.height;
                        }
                        $img.css({
                            width: imgW,
                            height: imgH
                        }).attr('src', this.src);
                        $modal.find('.modal-dialog').css({
                            'width'    : imgW,
                            'height'   : imgH,
                            'marginTop': (winH - imgH) / 2
                        });
                        $modal.fadeIn();
                    }
                    img.src = '/api/v2/web/image/' + id;
                }
            }
        };
    }])
    .directive('myInsertimage4', ['$timeout', function ($timeout) {     //方案多图片上传
        return {
            scope: {
                myId : '@',
                myType : '@',
                myQuery: "=",
                myComplete : "=",
                myLoading : "="
            },
            restrict: 'A',
            template: function (obj, attr) {
                var top = attr.myId === 'productplan' ? '<div class="k-uploadbox f-cb default" style="padding-bottom: 10px;">' : '<div class="k-uploadbox f-cb default">';
                var strong = attr.myId === 'productplan' ? '<br><strong style="text-align: center;padding-top: 15px;">为了达到最佳的显示效果，请您上传宽度大于880px的图片</strong>' : '';
                var template = [
                            top,
                                '<div class="list"></div>',
                                '<div class="pic" id="create">',
                                    '<div class="fileBtn" id="{{myId}}"></div>',
                                    '<div class="tips"><span><em></em><i></i></span><p>平面图上传每张3M以内<br>jpg/png格式'+strong+'</p></div>',
                                    '<div class="disable" ng-if="myLoading"></div>',
                                '</div>',
                            '</div>'
                    ];
                return template.join('');
            },
            link: function (scope, iElm, iAttrs, controller) {
                var obj = angular.element(iElm);
                var uploadbox = obj.find('.k-uploadbox .list');
                var str = '<div class="queue-item">\
                            <span class="loading">0</span>\
                            <span class="uploading"><i class="ing">等待...</i></span>\
                            <span class="filename"></span>\
                            <span class="error"></span>\
                            <span class="progress"><span style="width:0%"></span></span>\
                            <span class="cancel"><i class="iconfont">&#xe642;</i></span>\
                        </div>\
                        <div class="queue-img hide">\
                            <span class="mask"></span>\
                            <span class="view"><i class="iconfont"></i></span>\
                            <span class="close"><i class="iconfont">&#xe642;</i></span>\
                            <div class="img">\
                                <img />\
                            </div>\
                        </div>';
                function addFile(file,status){
                    if(status){
                        var item = $('<div class="item uploader-item" id="'+file.id+'">'+str+'</div>');
                        item.find('.filename').html(file.name);
                    }else{
                        var item = $('<div class="item uploader-item" id="'+file.id+'" data-imageid="'+file+'">'+str+'</div>');
                        item.find('.queue-item').remove();
                        item.find('.queue-img').removeClass('hide');
                        item.find('.img img').attr('src','/api/v2/web/thumbnail2/168/168/'+file);
                    }
                    uploadbox.append(item);
                }
                angular.forEach(scope.myQuery,function(value, key){
                    if(angular.isString(value)){
                        addFile(value,false);
                    }else if(angular.isObject(value)){
                        addFile(value.imageid,false);
                    }
                });
                if(WebUploader.browser.ie && !flashVersion){
                    alert('您的浏览器没有安装flash插件，或者flash版本过低，请及时更新。');
                    return ;
                }
                var uploaderUid = 0;
                var uploader = new WebUploader.Uploader({
                    pick: {
                        id: obj.find('.fileBtn'),
                        label: '',
                        multiple : true
                    },
                    paste: document.body,
                    accept: {
                        title: 'Images',
                        extensions: 'jpg,jpeg,png',
                        mimeTypes: 'image/*'
                    },
                    'method': 'post',
                    'timeout' : 4 * 60 * 1000,    // 3分钟
                    'fileVal' : 'Filedata',
                    'auto': true, //自动上传
                    //'runtimeOrder':'flash',   //  [默认值：html5,flash] 指定运行时启动顺序 调试用
                    // swf文件路径
                    swf: '/static/js/lib/Uploader.swf',
                    disableGlobalDnd: true,
                    chunked: true,
                    server: '/api/v2/web/image/upload',
                    fileNumLimit: 100,    //允许上传100张图片
                    fileSingleSizeLimit: 3 * 1024 * 1024    // 3 M 单个文件大小
                });
                uploader.reset();
                uploader.addButton({
                    id: obj.find('.fileBtn'),
                    label: '',
                    multiple : true
                });
                uploader.on( 'fileQueued', function( file ) {   //当文件被加入队列以后触发。
                    uploaderUid ++;
                    addFile(file,true);
                    $timeout(function () {
                        scope.myComplete = true;
                        scope.myLoading = true;
                    }, 0);
                });
                uploader.on( 'uploadProgress', function( file, percentage ) {  //上传过程中触发，携带上传进度。
                    var item = $( '#'+file.id );
                    var loading = parseInt(percentage * 100,10);
                    item.find('.loading').html(loading);
                    if(loading > 0){
                        item.find('.ing').html('正在上传');
                    }
                    if(loading === 100){
                        item.find('.ing').html('上传完成');
                    }
                    item.find('.progress span').css('width',loading + '%');
                });
                uploader.on( 'uploadSuccess', function( file , data) {  //当文件上传成功时触发。
                    var item = $( '#'+file.id );
                    item.find('.ing').html('加载图片');
                    if(uploaderUid-- == 1){
                        callbackImg(data.data, file,'Complete');
                    }else{
                        callbackImg(data.data, file,'Loading');
                    }
                    uploader.removeFile( file.id , true);
                });
                uploader.on( 'uploadError', function( file ) {   //当文件上传出错时触发。
                    //console.log('uploadError：',arguments)
                    var item = $( '#'+file.id );
                        item.find('.error').html('上传失败');
                });
                uploader.on( 'startUpload', function( file ) {  //当开始上传流程时触发。
                    //console.log('startUpload：',arguments)
                });
                uploader.on('error',function(error){   //当validate不通过时
                    if(error === 'F_EXCEED_SIZE'){
                        alert('图片大小超出限制。');
                    }
                    if(error === 'F_DUPLICATE'){
                        alert('图片已经上传过了，请不要重复上传。');
                    }
                });
                uploader.on( 'uploadFinished', function( file ) {   //当所有文件上传结束时触发。
                    //console.log('uploadFinished：',arguments)
                });
                uploader.on( 'uploadComplete', function( file ) {   //不管成功或者失败，文件上传完成时触发。
                    //console.log('uploadComplete：',file)
                    var item = $( '#'+file.id );
                    item.find('.progress').remove();
                    item.find('.cancel').remove();
                    item.find('.uploading').remove();
                    obj.find('.disable').remove();
                });
                function callbackImg(data, file,status) {
                    var item = $( '#'+file.id );
                    var img = new Image();
                    img.onload = function () {
                        var _this = this;
                        this.onload = this.error = null;
                        scope.$apply(function () {
                            if(_.findIndex(scope.myQuery,data) == -1){
                                if(scope.myId === 'productplan'){
                                    scope.myQuery.push({'imageid':data});
                                }else{
                                    scope.myQuery.push(data);
                                }
                                item.find('.queue-item').remove();
                                item.find('.queue-img').removeClass('hide');
                                item.find('.img img').attr('src',_this.src);
                                item.attr('data-imageid', data);
                            }else{
                                alert('已经上传过了');
                                scope.myQuery = _.remove(scope.myQuery, function(n) {
                                  return n != data;
                                });
                            }
                            if(status == 'Complete'){
                                scope.myComplete = false;
                                scope.myLoading = false;
                            }
                        });
                    }
                    img.onerror = function () {
                        alert("图片加载错误");
                        obj.find('.pic').find('.disable').remove();
                    };
                    img.src = '/api/v2/web/thumbnail2/168/168/' + data;
                }
                uploadbox.on('click', '.close', function(event) {
                    event.preventDefault();
                    if (confirm("您确定要删除吗？删除不能恢复")) {
                        var item = $(this).parents('.uploader-item'),
                            imageid = item.data('imageid');
                        $timeout(function () {
                            if(scope.myId === 'productplan'){
                                scope.myQuery = _.remove(scope.myQuery, function(n) {
                                    return n.imageid != imageid;
                                });
                            }else{
                                scope.myQuery = _.remove(scope.myQuery, function(n) {
                                    return n != imageid;
                                });
                            }
                        }, 0);
                        item.remove();
                    }
                });
                uploadbox.on('click', '.cancel', function(event) {
                    event.preventDefault();
                    var item = $(this).parents('.uploader-item'),
                        id = item[0].id;
                        uploader.cancelFile( id );
                        item.remove();
                    $timeout(function () {
                        if(uploaderUid-- == 1){
                            scope.myComplete = false;
                            scope.myLoading = false;
                        }
                        scope.myQuery = _.remove(scope.myQuery, function(n) {
                            return n.fileid != id;
                        });
                    }, 0);
                });
                scope.$on('$destroy', function () {
                    uploader.destroy();
                });
                uploadbox.on('click', '.view', function(event) {
                    event.preventDefault();
                    var item = $(this).parents('.uploader-item');
                    bigImg(item.data('imageid'));
                });
                function bigImg(id) {
                    var modat = '<div class="modal-dialog"><span class="close"><i class="iconfont">&#xe642;</i></span>';
                    modat += '<img class="img" src="" /></div>';
                    var $modal = $('<div class="k-modal viewImg" id="j-modal">' + modat + '</div>'),
                        $backdrop = $('<div class="k-modal-backdrop" id="j-modal-backdrop"></div>');
                    var doc = $('body');
                    doc.append($backdrop);
                    doc.append($modal);
                    var winW = $(window).width();
                    var winH = $(window).height();
                    var $settes = $modal.find('.settes');
                    var $img = $modal.find('.img');
                    var $close = $modal.find('.close');
                    $close.on('click', function () {
                        $modal.remove();
                        $backdrop.remove();
                        $img.attr('src', '');
                    });
                    $img.on('dblclick',function(){
                        $close.trigger('click');
                    });
                    var w = winW > 1200 ? 1200 : winW <= 1200 ? 1000 : winW;
                    var h = winH - 100;
                    var img = new Image();
                    $backdrop.fadeIn();
                    img.onload = function () {
                        this.onload = this.onerror = null;
                        var imgW,imgH;
                        if(this.width >= w){
                            if(this.width > this.height){
                                imgW = w;
                                imgH =  w/this.width*this.height;
                            }else if(this.width < this.height){
                                imgH = h;
                                imgW =  h/this.height*this.width;
                            }else{
                                imgW = imgH = h;
                            }
                        }else if(this.height >= h){
                            imgH = h;
                            imgW = h/this.height*this.width;
                        }else{
                            imgW = this.width;
                            imgH =  this.height;
                        }
                        $img.css({
                            width: imgW,
                            height: imgH
                        }).attr('src', this.src);
                        $modal.find('.modal-dialog').css({
                            'width'    : imgW,
                            'height'   : imgH,
                            'marginTop': (winH - imgH) / 2
                        });
                        $modal.fadeIn();
                    }
                    img.src = '/api/v2/web/image/' + id;
                }
            }
        };
    }])
    .directive('myDate', ['$timeout', function ($timeout) {     //选择时间
        return {
            replace: true,
            scope: {
                myQuery: "="
            },
            restrict: 'A',
            template: '<div class="m-date"></div>',
            link: function ($scope, iElm, iAttrs, controller) {
                var query = $scope.myQuery,
                    select = iAttrs.myDateSet.split('-'),
                    oBox = angular.element(iElm),
                    yearData = [],
                    monthData = [],
                    daysData = [],
                    hourData = [],
                    minuteData = [],
                    secondData = [],
                    newDate = new Date(),
                    iYear = newDate.getFullYear(),
                    iMonth = newDate.getMonth() + 1,
                    iDays = newDate.getDate(),
                    iHour = newDate.getHours(),
                    iMinute = newDate.getMinutes(),
                    iSecond = newDate.getSeconds(),
                    sYear = '',
                    sMonth = '',
                    sDays = '',
                    sHour = '',
                    sMinute = '',
                    sSecond = '';
                var selectData = '';
                for (var i = 0; i < select.length; i++) {
                    selectData += '<div class="list ' + select[i] + '"><div class="option"><span class="value"></span><span class="arrow"><em></em><i></i></span></div></div>';
                }
                oBox.html(selectData);
                for (var i = 0; i < 12; i++) {
                    monthData[i] = i + 1 + '月'
                }
                function fnDays() {
                    for (var i = 0; i < 12; i++) {
                        if (i == 1) {
                            if ((sYear % 4 == 0 && sYear % 100 != 0) || (sYear % 400 == 0)) {
                                daysData[i] = 29
                            } else {
                                daysData[i] = 28
                            }
                        } else if (i == 3 || i == 5 || i == 8 || i == 10) {
                            daysData[i] = 30
                        } else {
                            daysData[i] = 31
                        }
                    }
                }
                fnDays();
                for (var i = 0; i < 20; i++) {
                    yearData[i] = iYear + i + '年'
                }
                for (var i = 0; i < 24; i++) {
                    hourData[i] = i + '时'
                }
                for (var i = 0; i < 6; i++) {
                    minuteData[i] = i * 10 + '分'
                }
                var oYear = oBox.find('.year'),
                    oMonth = oBox.find('.month'),
                    oDays = oBox.find('.days'),
                    oHour = oBox.find('.hour'),
                    oMinute = oBox.find('.minute'),
                    oSecond = oBox.find('.second'),
                    body = angular.element(document);
                for (var i = 0; i < select.length; i++) {
                    switch (select[i]) {
                        case 'year' :
                            createList(yearData, oYear);
                            sYear = setDate(oYear, iYear);
                            optionEvevt(oYear);
                            break;
                        case 'month' :
                            createList(monthData, oMonth);
                            sMonth = setDate(oMonth, newDate.getMonth());
                            optionEvevt(oMonth);
                            break;
                        case 'days' :
                            createList(daysData, oDays);
                            sDays = setDate(oDays, newDate.getDate());
                            optionEvevt(oDays);
                            break;
                        case 'hour' :
                            createList(hourData, oHour);
                            sHour = setDate(oHour, newDate.getHours());
                            optionEvevt(oHour);
                            break;
                        case 'minute' :
                            createList(minuteData, oMinute);
                            sMinute = setDate(oMinute, newDate.getMinutes());
                            optionEvevt(oMinute);
                            break;
                        case 'second' :
                            sSecond = setDate(oSecond, newDate.getSeconds());
                            optionEvevt(oSecond);
                            break;
                        default :
                            alert('您书写有错！');
                            break;
                    }
                }
                // 渲染城市数据
                function createList(arr, obj) {
                    obj.find('select').remove();
                    var sHtml = '<ul class="select">',
                        len = obj == oDays ? arr[sMonth * 1 - 1] : arr.length;
                    for (var i = 0; i < len; i++) {
                        if (obj == oDays) {
                            sHtml += '<li data-val="' + (i + 1) + '"><a>' + (i + 1) + '日</a></li>';
                        } else {
                            sHtml += '<li data-val="' + parseInt(arr[i]) + '"><a>' + arr[i] + '</a></li>';
                        }

                    }
                    sHtml += '</ul>';
                    obj.append(sHtml)
                }
                function setDate(obj, str) {
                    var y = newDate.getFullYear(),
                        m = newDate.getMonth() + 1,
                        d = newDate.getDate(),
                        h = newDate.getHours(),
                        i = newDate.getMinutes(),
                        s = newDate.getSeconds();
                    i = s > 59 ? i + 1 : i;
                    if(i < 10){
                        i = 10;
                    }else if(i > 10 && i < 20){
                        i = 20;
                    }else if(i > 20 && i < 30){
                        i = 30;
                    }else if(i > 40 && i < 50){
                        i = 50;
                    }else if(i > 50){
                        i = 0;
                        h += 1;
                    }
                    if(select.length == 3){
                        d += 1;
                    }else{
                        if(h > 23){
                            h = 0;
                            d += 1;
                        }
                    }
                    if(d > daysData[m-1]){
                        d = 1;
                        m += 1;
                    }

                    if(m > 11){
                        d = 1;
                        m = 1;
                        y += 1;
                    }
                    oYear.find('.value').html(y + '年');
                    oMonth.find('.value').html(m + '月');
                    oDays.find('.value').html(d + '日');
                    oHour.find('.value').html(h + '时');
                    oMinute.find('.value').html(i + '分');
                    oSecond.find('.value').html(s + '秒');
                    if(obj === oYear){
                        return y;
                    }
                    if(obj === oMonth){
                        return m;
                    }
                    if(obj === oDays){
                        return d;
                    }
                    if(obj === oHour){
                        return h;
                    }
                    if(obj === oMinute){
                        return i;
                    }
                    if(obj === oSecond){
                        return s;
                    }
                }
                function optionEvevt(obj) {
                    var self = this;
                    var option = obj.find('.option');
                    var value = option.find('.value').html();
                    option.on('click', function (ev) {
                        body.click();
                        selectShow(obj);
                        return false;
                    });
                    selectEvent(obj)
                }
                function selectEvent(obj) {
                    var oOption = obj.find('.option').find('.value');
                    body.click();
                    obj.delegate('li', 'click', function (ev) {
                        ev.stopPropagation();
                        var dataVal = $(this).data('val'),
                            value = $(this).find('a').text();
                        oOption.html(value);
                        if (obj == oYear) {
                            sYear = dataVal;
                            fnDays();
                        }
                        if (obj == oMonth) {
                            sMonth = dataVal;
                            createList(daysData, oDays);
                        }
                        if (obj == oDays) {
                            createList(daysData, oDays);
                            sDays = dataVal;
                        }
                        if (obj == oHour) {
                            createList(daysData, oDays);
                            sHour = dataVal;
                        }
                        if (obj == oMinute) {
                            createList(daysData, oDays);
                            sMinute = dataVal;
                        }
                        selectHide(obj);
                        getDate();
                    });
                }

                body.on('click', function (ev) {
                    selectHide();
                });
                function selectHide(obj) {
                    oBox.each(function (index, el) {
                        if (obj) {
                            $(el).find(obj).find('.select').hide();
                        } else {
                            $(el).css('zIndex', 5).find('.select').hide();
                        }
                    });
                }

                function selectShow(obj) {
                    obj.find('.select').show();
                    oBox.css('zIndex', 20)
                }

                function getDate() {
                    var s;
                    $scope.$apply(function () {
                        var date = new Date();
                        if (_.indexOf(select, 'hour') == -1) {
                            sHour = 0;
                            sHour = 0;
                            sSecond = 0;
                        } else if (_.indexOf(select, 'minute') == -1) {
                            sHour = 0;
                            sSecond = 0;
                        } else if (_.indexOf(select, 'second') == -1) {
                            sSecond = 0;
                        }
                        date.setFullYear(sYear);
                        date.setMonth(sMonth * 1 - 1);
                        date.setDate(sDays);
                        date.setHours(sHour);
                        date.setMinutes(sMinute);
                        date.setSeconds(sSecond);
                        $scope.myQuery = Date.parse(date);
                    });
                }
                $timeout(function () {
                    getDate();
                }, 0)
            }
        };
    }])
    .directive('checkNumber', ['$timeout', function ($timeout) {     //检测是不是数字
        return {
            replace: true,
            require: 'ngModel',
            restrict: 'A',
            link: function ($scope, iElm, iAttrs, controller) {
                var res;
                var type = iAttrs.checkNumberType == undefined ? 'int' : iAttrs.checkNumberType;
                if (type === 'int') {
                    res = /[^0-9]/;
                } else if (type === 'float') {
                    res = /[^0-9.]/;
                }
                $scope.$watch(iAttrs.ngModel, function (newValue, oldValue, scope) {
                    if (!!newValue) {
                        if (!res.test(newValue)) {
                            controller.$setValidity('number', true)
                        } else {
                            controller.$setValidity('number', false)
                        }
                    }
                });
            }
        };
    }])
    .directive('checkImages', ['$timeout', function ($timeout) {     //检测多张图片
        return {
            replace: true,
            require: 'ngModel',
            restrict: 'A',
            link: function ($scope, iElm, iAttrs, controller) {
                $scope.$watch(iAttrs.ngModel, function (newValue, oldValue, scope) {
                    controller.$setValidity('images', newValue > 0 ? true : false)
                });
            }
        };
    }])
    .directive('checkImage', ['$timeout', function ($timeout) {     //检测单张图片
        return {
            replace: true,
            require: 'ngModel',
            restrict: 'A',
            link: function ($scope, iElm, iAttrs, controller) {
                $scope.$watch(iAttrs.ngModel, function (newValue, oldValue, scope) {
                    controller.$setValidity('image', !newValue ? true : false)
                });
            }
        };
    }])
    .directive('checkProvince', ['$timeout', function ($timeout) {     //检测省份
        return {
            replace: true,
            require: 'ngModel',
            restrict: 'A',
            link: function ($scope, iElm, iAttrs, controller) {
                $scope.$watch(iAttrs.ngModel, function (newValue, oldValue, scope) {
                    controller.$setValidity('province', newValue != '请选择省份' ? true : false)
                });
            }
        };
    }])
    .directive('checkCity', ['$timeout', function ($timeout) {     //检测城市
        return {
            replace: true,
            require: 'ngModel',
            restrict: 'A',
            link: function ($scope, iElm, iAttrs, controller) {
                $scope.$watch(iAttrs.ngModel, function (newValue, oldValue, scope) {
                    controller.$setValidity('city', newValue != '请选择市' ? true : false)
                });
            }
        };
    }])
    .directive('myPageing', ['$timeout', function ($timeout) {     //分页
        return {
            replace: true,
            scope: {
                pageObject: '=pageObject'
            },
            restrict: 'A',
            template: '<div class="k-pageing"><ul class="pagination"></ul></div>',
            link: function ($scope, iElm, iAttrs, controller) {
                var obj = angular.element(iElm),
                    pageObj = $scope.pageObject,
                    allNumPage = (!pageObj.allNumPage || pageObj.allNumPage < 0) ? 1 : pageObj.allNumPage,
                    itemPage = (!pageObj.itemPage || pageObj.itemPage < 0) ? 1 : pageObj.itemPage;
                //生成分页显示
                //createLinks();
                //回调函数
                pageObj.callback(pageObj.currentPage, obj);
                $scope.page = {
                    createLinks: function () {
                        obj.html('');
                        var self = this,
                            interval = this.getInterval(),
                            np = this.numPages();
                        // 这个辅助函数返回一个处理函数调用有着正确pageId的pageSelected。
                        this.getClickHandler()
                        if (pageObj.pageInfo) {
                            angular.element("<span>共<em>" + pageObj.allNumPage + "</em>条项目</span>").addClass('text').appendTo(obj);
                        }
                        // 产生首页按钮
                        if (pageObj.showUbwz && pageObj.currentPage > 0) {
                            this.appendItem(0, {text: '首页', classes: "first"}, np)
                        }
                        // 产生上一个按钮
                        if (pageObj.prevText && (pageObj.currentPage > 0)) {
                            this.appendItem(pageObj.currentPage - 1, {text: pageObj.prevText, classes: "prev"}, np)
                        }
                        // 产生起始点
                        if (interval[0] > 0 && pageObj.ellipseText > 0) {
                            var end = Math.min(pageObj.endPageNum, interval[0]);
                            for (var i = 0; i < end; i++) {
                                this.appendItem(i, {}, np);
                            }
                            if (pageObj.endPageNum < interval[0] && pageObj.ellipseText) {
                                angular.element("<span>" + pageObj.ellipseText + "</span>").addClass('btns').appendTo(obj);
                            }
                        }
                        // 产生内部的些链接
                        for (var i = interval[0]; i < interval[1]; i++) {
                            this.appendItem(i, {}, np);
                        }
                        // 产生结束点
                        if (interval[1] < np && pageObj.endPageNum > 0) {
                            if (np - pageObj.endPageNum > interval[1] && pageObj.ellipseText) {
                                angular.element("<span>" + pageObj.ellipseText + "</span>").addClass('btns').appendTo(obj);
                            }
                            var begin = Math.max(np - pageObj.endPageNum, interval[1]);
                            for (var i = begin; i < np; i++) {
                                this.appendItem(i, {}, np);
                            }
                        }
                        //  产生下一页按钮
                        if (pageObj.nextText && (pageObj.currentPage < np - 1)) {
                            this.appendItem(pageObj.currentPage + 1, {text: pageObj.nextText, classes: "next"}, np);
                        }
                        // 产生尾页按钮
                        if (pageObj.showUbwz && pageObj.currentPage < np - 1) {
                            this.appendItem(np, {text: '尾页', classes: "last"}, np)
                        }
                        if (pageObj.pageInfo) {
                            angular.element("<span>当前第<em>" + (pageObj.currentPage + 1) + "</em>页/共<em>" + this.numPages() + "</em>页</span>").addClass('text').appendTo(obj);
                        }
                    },
                    getClickHandler: function (pageId) {
                        var self = this;
                        return function (ev) {
                            return self.pageSelected(pageId, ev);
                        }
                    },
                    appendItem: function (pageId, appendopts, np) {  //生成按钮
                        pageId = pageId < 0 ? 0 : (pageId < np ? pageId : np - 1); // 规范page id值
                        appendopts = angular.extend({text: pageId + 1, classes: ""}, appendopts || {});
                        if (pageId == pageObj.currentPage) {
                            var lnk = angular.element("<span class='current'>" + (appendopts.text) + "</span>").addClass('btns');
                        } else {
                            var lnk = angular.element("<a>" + (appendopts.text) + "</a>")
                                .on("click", this.getClickHandler(pageId))
                                .addClass('btns')
                                .attr('href', pageObj.linkTo.replace(/__id__/, pageId + 1));
                        }
                        if (appendopts.classes) {
                            lnk.addClass(appendopts.classes);
                        }
                        obj.append(lnk);
                    },
                    numPages: function () {   //计算最大分页显示数目
                        var self = this;
                        return Math.ceil(pageObj.allNumPage / pageObj.itemPage);
                    },
                    getInterval: function () { //极端分页的起始和结束点，这取决于currentPage 和 showPgaeNum返回数组
                        var self = this,
                            ne_half = Math.ceil(pageObj.showPageNum / 2),
                            np = this.numPages(),
                            upper_limit = np - pageObj.showPageNum,
                            start = pageObj.currentPage > ne_half ? Math.max(Math.min(pageObj.currentPage - ne_half, upper_limit), 0) : 0,
                            end = pageObj.currentPage > ne_half ? Math.min(pageObj.currentPage + ne_half, np) : Math.min(pageObj.showPageNum, np);
                        return [start, end]
                    },
                    pageSelected: function (pageId, ev) {  //分页链接事件处理函数  pageId 为新页码
                        var self = this;
                        pageObj.currentPage = pageId;
                        this.createLinks();
                        var continuePropagation = pageObj.callback(pageObj.currentPage, obj);
                        if (!continuePropagation) {
                            if (ev.stopPropagation) {
                                ev.stopPropagation();
                            }
                            else {
                                ev.cancelBubble = true;
                            }
                        }
                        return continuePropagation;
                    },
                    selectPage: function (pageId) { // 获得附加功能的元素
                        this.pageSelected(pageId);
                    },
                    prevPage: function () {  // 上一个按钮
                        var self = this;
                        if (pageObj.currentPage > 0) {
                            this.pageSelected(pageObj.currentPage - 1);
                            return true;
                        } else {
                            return false;
                        }
                    },
                    nextPage: function () {  // 下一个按钮
                        var self = this;
                        if (pageObj.currentPage < this.numPages() - 1) {
                            this.pageSelected(pageObj.currentPage + 1);
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
                $scope.page.createLinks();
            }
        };
    }])
    .directive('myBlur', ['$timeout', function ($timeout) {     //检测是不是数字
        function strToJson(str) {
            var json = {}, len = 0;
            str = str.replace(/^{(.*)}$/, "$1");
            if (str == "") {
                return {
                    json: json,
                    len: len
                }
            }
            str.split(",")
            if (angular.isArray(str)) {
                angular.forEach(str, function (v) {
                    var str2 = v.split(":");
                    json[str2[0]] = str2[1];
                })
                len = str.length;
            } else {
                var str2 = str.split(":");
                json[str2[0]] = str2[1];
                len = 1;
            }
            return {
                json: json,
                len: len
            }
        }

        function verifyFrom(value, rules, length) {
            var i = 0;
            for (var attr in rules) {
                rules[attr] = eval(rules[attr]);
                if (attr == 'pattern' && rules[attr].test(value)) { //正则验证
                    i++
                }
                if (attr == 'minlength' && rules[attr] == value.length) {  //最小长度
                    i++
                }
                if (attr == 'maxlength' && rules[attr] == value.length) {   //最大长度
                    i++
                }
            }
            ;
            return length == i ? true : false
        }

        return {
            replace: true,
            require: 'ngModel',
            restrict: 'A',
            scope: true,
            link: function (scope, iElm, iAttrs, controller) {
                var verify = strToJson(iAttrs.myBlur).json,
                    length = strToJson(iAttrs.myBlur).len;
                iElm.on('focus', function () {
                    controller.$setValidity('myVerify', false);
                }).on('blur', function () {
                    if (!!iElm.context.value) {
                        controller.$setValidity('myVerify', true);
                    }
                });
            }
        };
    }])
    .directive('myPlaceholder', ['$compile', function ($compile) {    //让ie8，9支持input Placeholder属性
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, ele, attr) {
                console.log()
                var input = document.createElement('input'),
                    textarea = document.createElement('textarea'),
                    isSupportPlaceholder = 'placeholder' in input || 'placeholder' in textarea;
                if (!isSupportPlaceholder) {
                    var fakePlaceholder = angular.element(
                        '<span class="placeholder">' + attr['placeholder'] + '</span>');
                    fakePlaceholder.on('click', function (e) {
                        e.stopPropagation();
                        ele.focus();
                    });
                    ele.before(fakePlaceholder);
                    $compile(fakePlaceholder)(scope);
                    ele.on('focus', function () {
                        fakePlaceholder.hide();
                    }).on('blur', function () {
                        if (ele.val() === '') {
                            fakePlaceholder.show();
                        }
                    });
                    scope.getElementPosition = function () {
                        return ele.position();
                    };
                    if(ele[0].type === 'textarea'){
                        scope.$watch(scope.getElementPosition, function () {
                            fakePlaceholder.css({
                                'top': ele.position().top + 'px',
                                'left': '0px'
                            });
                        }, true);
                    }else{
                        scope.$watch(scope.getElementPosition, function () {
                            fakePlaceholder.css({
                                'top': ele.position().top + 'px',
                                'left': ele.position().left + 'px'
                            });
                        }, true);
                    }
                    scope.getElementHeight = function () {
                        return ele.outerHeight();
                    };
                    if(ele[0].type === 'textarea'){
                        scope.$watch(scope.getElementHeight, function () {
                            fakePlaceholder.css('line-height', '44px');
                        });
                    }else{
                        scope.$watch(scope.getElementHeight, function () {
                            fakePlaceholder.css('line-height', ele.outerHeight() + 'px');
                        });
                    }
                    if (ele.css('font-size')) {
                        fakePlaceholder.css('font-size', ele.css('font-size'));
                    }
                    if (ele.css('text-indent')) {
                        fakePlaceholder.css('text-indent',
                            parseInt(ele.css('text-indent')) +
                            parseInt(ele.css('border-left-width'))
                        );
                    }
                    if (ele.css('padding-left')) {
                        fakePlaceholder.css('padding-left', ele.css('padding-left'));
                    }
                    if (ele.css('margin-top')) {
                        fakePlaceholder.css('margin-top', ele.css('margin-top'));
                    }
                    scope.isElementVisible = function () {
                        return ele.is(':visible');
                    };
                    scope.$watch(scope.isElementVisible, function () {
                        var displayVal = ele.is(':visible') ? 'block' : 'none';
                        fakePlaceholder.css('display', displayVal);
                        if (displayVal === 'blcok' && ele.val()) {
                            fakePlaceholder.hide();
                        }
                    });
                    scope.hasValue = function () {
                        return ele.val();
                    };
                    scope.$watch(scope.hasValue, function () {
                        if (ele.val()) {
                            fakePlaceholder.hide();
                        }
                    });
                }
            }
        };
    }])
    .directive('myTooltip', function () {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, ele, attr) {
                var obj = {
                    animation: true,
                    placement: 'top',
                    selector: '',
                    template: '<div class="k-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                    trigger: 'hover focus',
                    title: '',
                    delay: 0,
                    html: false,
                    viewportSelector: 'body',
                    viewportPadding: '3px 8px'
                }
                obj.title = attr.title;
                obj.delay = attr.delay;
                var tips = new Tooltip(ele, obj);
                scope.$on('$destroy', function () {
                    tips.hide();   //销毁上传的插件，避免ie报错
                });
            }
        };
    })
    .directive('myAuthshow', function () {
        return {
            restrict: 'A',
            scope: {
                myType : '='
            },
            link: function (scope, ele, attr) {
                var type = scope.myType;
                var data = [
                    {},
                    {
                        sClass : 's-auth-waiting',
                        sIcon : '&#xe60b;',
                        sText : '您的'+attr.msg+'已经提交，请耐心等待审核'
                    },
                    {
                        sClass : 's-auth-done',
                        sIcon : '&#xe608;',
                        sText : '您的'+attr.msg+'已通过审核'
                    },
                    {
                        sClass : 's-auth-fail',
                        sIcon : '&#xe607;',
                        sText : '您的'+attr.msg+'失败，请重新提交'
                    },
                    {
                        sClass : 's-auth-offline',
                        sIcon : '&#xe612;',
                        sText : '您的'+attr.msg+'内容违规，请重新提交'
                    }
                ];
                ele.addClass(data[type].sClass).html('<i class="iconfont">'+data[type].sIcon+'</i>&nbsp;&nbsp;&nbsp;'+data[type].sText);
            }
        };
    })
    .directive('myLoadimg', function () {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, ele, attrs) {
                var imgUrl = attrs.imgapi;
                var imgId = attrs.imgid;
                var imgDefault = attrs.imgdefault;
                if(!imgId){
                    ele[0].src = imgDefault;
                }else{
                   var img = new Image();
                    img.onload = function(){
                        this.onload = this.onerror = null;
                        ele[0].src = this.src;
                    }
                    img.onerror = function(){
                        this.onload = this.onerror = null;
                       ele[0].src = imgDefault;
                    }
                    img.src = imgUrl+imgId;
                }
            }
        };
    })
    .directive('myViewlarger', function () {
        return {
            restrict: 'A',
            scope: {
                myList : '='
            },
            replace : true,
            template: '',
            link: function (scope, ele, attrs) {
                var doc = $(document);
                var $body = $('body');
                var timer = null;
                var images = scope.myList;
                var title = attrs.title || '';
                var length = images.length;
                var iNum = 0;
                ele.on('click',function(){
                    iNum = $(this).index();
                    lightBox(title,$(this).index(),length);
                });
                function lightBox(title,index,length){
                    var winW = $(window).width();
                    var winH = $(window).height();
                    var w = winW < 1000 ? winW : 1000;
                    var h = winH - 200;
                    var str =   '<div class="lightBox-header f-cb">\
                                    <h3 class="f-fl title">'+title+'</h3>\
                                    <span class="pagenum f-fl"></span>\
                                    <span class="close f-fr"><i class="iconfont">&#xe642;</i></span>\
                                </div>\
                                <div class="lightBox-body">\
                                    <div class="img">\
                                        <img alt="" />\
                                        <div class="toggle">\
                                          <span class="prev '+(index === 0 ? "hide" : '')+'"><i class="iconfont">&#xe611;</i></span>\
                                          <span class="next '+(index === length-1 ? "hide" : '')+'"><i class="iconfont">&#xe617;</i></span>\
                                        </div>\
                                    </div>\
                                </div>';
                    var lightBox = $('<div class="k-lightBox"><div class="lightBox-content">'+str+'</div></div>');
                    var mask = $('<div class="k-lightBox-mask"></div>');
                    $body.append(mask);
                    mask.fadeIn();
                    $body.append(lightBox);
                    var content = lightBox.find('.lightBox-content');
                    var body = content.find('.lightBox-body');
                    var img = body.find('img');
                    var pagenum = lightBox.find('.pagenum');
                    lightBox.fadeIn();

                    lightBox.on('click','.close',function(){
                        mask.remove();
                        lightBox.remove();
                        doc.off('.moveTo');
                    });
                    var prev = content.find('.prev');
                    var next = content.find('.next');
                    lightBox.on('click','.prev',function(){
                        moveTo('prev');
                    });
                    lightBox.on('click','.next',function(){
                        moveTo('next');
                    });
                    function moveTo(me){
                        if(me === 'prev'){
                            if(iNum == 0){
                                iNum = 0;
                            }else{
                                iNum--;
                            }
                        }else if(me === 'next'){
                            if(iNum == length - 1){
                                iNum = length - 1;
                            }else{
                                iNum++;
                            }
                        }
                        prev.toggleClass('hide',iNum < 1);
                        next.toggleClass('hide',iNum > length - 2);
                        setImgSize(iNum);
                    }
                    doc.on('keydown.moveTo',function(event){
                        switch (event.keyCode) {
                            case 37:    //左
                                moveTo('prev');
                                break;
                            case 38:    //上
                                moveTo('prev');
                                break;
                            case 39:    //右
                                moveTo('next');
                                break;
                            case 40:    //下
                                moveTo('next');
                                break;
                        }
                    });
                    doc.one('mousewheel.moveTo',mousewheelFn);
                    doc.on('mousewheel.moveTo',function(ev){
                        ev.preventDefault();
                    });
                    function mousewheelFn(ev,direction){
                        if( direction < 1 ){  //向下滚动
                            moveTo('next');
                        }else{  //向上滚动
                            moveTo('prev');
                        }
                        clearTimeout(timer);
                        timer = setTimeout(function(){
                            doc.one("mousewheel.moveTo",mousewheelFn);
                        },1200);
                    }
                    body.css({
                        'width': w,
                        'height': h - 85,
                        'left' : 0,
                        'text-align':'center'
                    });
                    content.animate({
                        'height'   : h,
                        'top': 100
                    });
                    var $img = body.find('.img');
                    setImgSize(index);
                    function setImgSize(index){
                        var imgW,imgH;
                        var iW = images[index].width;
                        var iH = images[index].height;
                        var tuH = h - 85;
                        var iWs,iHs,is;
                        if(iW > w){
                            iWs = w/iW;
                        }else{
                            iWs = 1;
                        }
                        if(iH > tuH){
                            iHs = tuH/iH;
                        }else{
                            iHs = 1;
                        }
                        if(iWs > iHs){
                            is = iHs
                        }else{
                            is = iWs
                        }
                        if(is*iW > w){
                            imgW = w;
                            imgH = is*iH*(w/(is*iW));
                        }else{
                            imgW = is*iW;
                        }
                        if(is*iH > tuH){
                            imgW = is*iW*(tuH/(is*iH));
                            imgH = tuH;
                        }else{
                            imgH = is*iH
                        }
                        pagenum.html('<strong>'+(index+1)+'</strong>/'+length);
                        $img.css({
                            'position':'relative',
                            'width': imgW,
                            'height': imgH,
                            'margin-top':(tuH-imgH)/2,
                            'margin-left':(w-imgW)/2
                        })
                        img.css({
                            'width': imgW,
                            'height': imgH
                        }).attr('src', '/api/v2/web/image/'+images[index].imageid);
                    }
                }
            }
        };
    })
    .directive('myInsertimage3', ['$timeout', function ($timeout) {     //日记多图片上传
        return {
            scope: {
                myQuery: "=",
                myComplete : "=",
                myLoading : "="
            },
            restrict: 'A',
            template: function (obj, attr) {
                var template = [
                        '<div class="k-uploadbox f-cb">',
                            '<div class="list">',
                                '<div class="items" ng-repeat="img in myQuery" id="{{img.fileid}}">',
                                    '<div class="queue-items" ng-if="img.loading >= 0 && !img.imageid">',
                                        '<span class="loading" ng-bind="img.loading" ng-if="!img.errorMsg"></span>',
                                        '<span class="uploading" ng-if="!img.errorMsg"><i class="ing" ng-bind="img.status"></i></span>',
                                        '<span class="filename" ng-bind="img.filename"></span>',
                                        '<span class="error" ng-bind="img.errorMsg" ng-if="img.errorMsg"></span>',
                                        '<span class="progress"><span ng-style="{width:img.progress}"></span></span>',
                                        '<span class="cancel" ng-click="cancel(img.file)"><i class="iconfont">&#xe642;</i></span>',
                                    '</div>',
                                    '<div class="queue-img" ng-if="img.imageid">',
                                        '<span class="close" ng-click="removeImg($index,myQuery,img.fileid)"><i class="iconfont">&#xe642;</i></span>',
                                        '<div class="img">',
                                            '<img ng-if="img.imageid" ng-src="/api/v2/web/thumbnail2/85/85/{{img.imageid}}">',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                                '<div class="pic" id="create">',
                                    '<div class="tips" id="uploadify"></div>',
                                    '<div class="disable" ng-if="myLoading"></div>',
                                '</div>',
                            '</div>',
                        '</div>'
                    ];
                return template.join('');
            },
            link: function (scope, iElm, iAttrs, controller) {
                var id = iAttrs.id;
                var obj = angular.element(iElm);
                if(WebUploader.browser.ie && !flashVersion){
                    alert('您的浏览器没有安装flash插件，或者flash版本过低，请及时更新。');
                    return ;
                }
                var uploaderUid = 0;
                var uploader = new WebUploader.Uploader({
                    pick: {
                        id: '#'+id,
                        label: '',
                        multiple : true
                    },
                    paste: document.body,
                    accept: {
                        title: 'Images',
                        extensions: 'jpg,jpeg,png',
                        mimeTypes: 'image/*'
                    },
                    'method': 'post',
                    'timeout' : 4 * 60 * 1000,    // 3分钟
                    'fileVal' : 'Filedata',
                    'auto': true, //自动上传
                    //'runtimeOrder':'flash',   //  [默认值：html5,flash] 指定运行时启动顺序 调试用
                    // swf文件路径
                    swf: '/static/js/lib/Uploader.swf',
                    disableGlobalDnd: true,
                    chunked: true,
                    server: '/api/v2/web/image/upload',
                    fileNumLimit: 9,    //允许上传9张图片
                    fileSingleSizeLimit: 3 * 1024 * 1024    // 3 M 单个文件大小
                });
                uploader.addButton({
                        id: '#'+id,
                        label: '',
                        multiple : true
                    });
                uploader.reset();
                uploader.on( 'fileQueued', function( file ) {   //当文件被加入队列以后触发。
                    $timeout(function () {
                        if(scope.myQuery.length < 9){
                            uploaderUid ++;
                            scope.myQuery.push({
                                file : file,
                                fileid : file.id,
                                //filename : file.name,
                                errorMsg : '',
                                status : '等待...',
                                loading: 0,
                                progress : '0%',
                                loadDate : +new Date()
                            });
                        }
                        scope.myComplete = true;
                        scope.myLoading = true;
                    }, 0);
                });
                uploader.on( 'uploadProgress', function( file, percentage ) {  //上传过程中触发，携带上传进度。
                     $timeout(function () {
                        var index = _.findIndex(scope.myQuery,{'fileid':file.id});
                        if (index >= 0) {
                            scope.myQuery[index].loading = parseInt(percentage * 100, 10);
                            if(scope.myQuery[index].loading > 0){
                                scope.myQuery[index].status = '正在上传';
                            }
                            if(scope.myQuery[index].loading == 100){
                                scope.myQuery[index].status = '上传完成';
                            }
                            scope.myQuery[index].progress = scope.myQuery[index].loading+'%';
                        }
                    }, 0);
                });
                uploader.on( 'uploadSuccess', function( file , data) {  //当文件上传成功时触发。
                    if(uploaderUid-- == 1){
                        callbackImg(data.data, file,'Complete');
                    }else{
                        callbackImg(data.data, file,'Loading');
                    }
                });
                uploader.on( 'uploadError', function( file ) {   //当文件上传出错时触发。
                    //console.log('uploadError：',arguments)
                    $timeout(function () {
                        var index = _.findIndex(scope.myQuery,{'fileid':file.id});
                        if (index >= 0) {
                            scope.myQuery[index].errorMsg = '上传失败';
                        }
                    }, 0);
                });
                uploader.on( 'startUpload', function( file ) {  //当开始上传流程时触发。
                    //console.log('startUpload：',arguments)
                });
                uploader.on('error',function(error){   //当validate不通过时
                    if(error === 'F_EXCEED_SIZE'){
                        alert('图片大小超出限制。');
                    }
                    if(error === 'F_DUPLICATE'){
                        alert('图片已经上传过了，请不要重复上传。');
                    }
                });
                uploader.on( 'uploadFinished', function( file ) {   //当所有文件上传结束时触发。
                    //console.log('uploadFinished：',arguments)
                });
                uploader.on( 'uploadComplete', function( file ) {   //不管成功或者失败，文件上传完成时触发。
                    //console.log('uploadComplete：',file)
                    $( '#'+file.id ).find('.progress').remove();
                    obj.find('.disable').remove();
                });
                function callbackImg(data, file,status) {
                    var img = new Image();
                    img.onload = function () {
                        var _this = this;
                        this.onload = this.error = null;
                        scope.$apply(function () {
                            if(_.findIndex(scope.myQuery,{'imageid' : data}) == -1){
                                var index = _.findIndex(scope.myQuery,{'fileid':file.id});
                                var old = scope.myQuery[index];
                                scope.myQuery[index] = {
                                    "width": _this.width,
                                    "imageid": data,
                                    "height": _this.height,
                                    "fileid": file.id
                                };
                                old = null;
                            }else{
                                alert('已经上传过了');
                                scope.myQuery = _.remove(scope.myQuery, function(n) {
                                  return n != id;
                                });
                            }
                            if(status == 'Complete'){
                                scope.myComplete = false;
                                scope.myLoading = false;
                            }
                        });
                    }
                    img.onerror = function () {
                        alert("图片加载错误");
                        obj.find('.pic').find('.disable').remove();
                    };
                    img.src = '/api/v2/web/image/' + data;
                }
                scope.removeImg = function (i, arr,fileid) {
                    if (confirm("您确定要删除吗？删除不能恢复")) {
                        arr.splice(i, 1);
                        uploader.removeFile( fileid , true);
                        $timeout(function () {
                            scope.myQuery = arr;
                        }, 0);
                    }
                };
                scope.cancel = function (file) {
                    uploader.cancelFile( file );
                    if(uploaderUid-- == 1){
                        scope.myComplete = false;
                        scope.myLoading = false;
                    }
                    $timeout(function () {
                        scope.myQuery = _.remove(scope.myQuery, function(n) {
                            return n.fileid != file.id;
                        });
                    }, 0);
                }
                scope.$on('$destroy', function () {
                    uploader.destroy();
                });
            }
        };
    }]);
