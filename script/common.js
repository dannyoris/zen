$(function(){
	//fix outline
	$('a').focus(function(){this.blur();}); 
	
	var $MainMenu = $('#J_mainMenu'),$MainMenuItem = $MainMenu.children('.main-menu-item'),$MenuSet = $('.menu-list li'),$MainBanner = $('.main-banner');
	var _contentWidth = 0,_mianMenuLength = $MainMenuItem.length,_mainMenuPadding=30,_resizeResetItems = true;
	var _global_ItemShow = -1;
	var _animateStyle = "easeInQuad";
	var _pageIsInAnimate = false;
	var _global_show = 0;

	var _isautoreturn = false, _bannerAuto,_moveToNext,_autoFunction;

	function setResize(){
		_contentWidth= $(window).width()-280;
		if(_contentWidth<720){ _contentWidth=720; }
		$('.container').width(_contentWidth); 
		if(_global_show==1){
			$MainBanner.css({top:-$(window).height()});
		}	
		$('#map_img').height(function(){
			if($(window).height()-470>364){
				return 364;
			}
			return $(window).height()-470;
		});
	}

	//重置item宽度
	//after 非初始   und初始设置
	function setMove(after,und,callback){
		//非初始化重置
		$MenuSet.removeClass('on');
		var _left = _contentWidth/_mianMenuLength;
		if(!_resizeResetItems){ 
			showMainContent(_global_ItemShow,true); 
		}else{
			if(after){
				$MainMenuItem.find('.main-decription').fadeOut(500);
				for(var i=0;i<_mianMenuLength;i++){
					$MainMenuItem.eq(i).animate({left:_left*i},500);
				}
			}else{
				for(var i=0;i<_mianMenuLength;i++){
					$MainMenuItem.eq(i).css({left:_left*i});
				}
			}
			$MainMenuItem.find('.icon-mainshow').css({left:_left*.5-77}).fadeIn(500);

		}
		if(und){
			$MainMenuItem.css({width:_left});
		}else{
			$MainMenuItem.css({width:_contentWidth-(_mainMenuPadding*(_mianMenuLength-1))});
		}
		if(callback){callback.call(this);}
	}


	//展开
	function showMainContent(_index,reset){
		_global_ItemShow = _index;
		$MenuSet.eq(_index).siblings().removeClass('on').find('.onshow').fadeOut(500);
		$MenuSet.eq(_index).addClass('on').find('.onshow').fadeIn(500);
		for(var i=0;i<=_index;i++){
			var $this = $MainMenuItem.eq(i),_left = i*_mainMenuPadding;
			if(!reset){
				$this.find('.icon-mainshow').fadeOut(500);
			}			
			if(i==_index){ 
				$this.find('.main-decription').width(_returnWidth($this));
				if(!reset){
					$this.find('.main-decription').fadeIn(700);
				}					
			}
			_animate($this,_left,reset);
		}

		for(var i=_mianMenuLength,j=0;i>_index;i--,j++){
			if(!reset){
				$this.find('.icon-mainshow').fadeOut(500);
			}
			var $this = $MainMenuItem.eq(i),_left = _contentWidth-j*_mainMenuPadding;
			_animate($this,_left,reset);
		}

		//返回box应该有的宽度
		function _returnWidth($obj){
			var _boxwidth = _contentWidth-(_mianMenuLength-1)*_mainMenuPadding;
			var _nowShow = $obj.find('.item-list img:eq(0)').width();
			if(_boxwidth-_nowShow<460){
				return 460;
			}
			return _boxwidth-_nowShow;
		}

		//本项通用动画
		function _animate($obj,left,reset){
			if(reset){
				$obj.css({left: left});
			}else{
				$obj.animate({left: left},500, function() {});
			}		
		}
	}

	function stopBubble(e){
        //一般用在鼠标或键盘事件上
        if(e && e.stopPropagation){
            //W3C取消冒泡事件
            e.stopPropagation();
        }else{
            //IE取消冒泡事件
            window.event.cancelBubble = true;
        }
    }


    //onload
    function mainItemAnimation(callback,up){
    	if(_global_show==1){ return false; }
    	_pageIsInAnimate = true;
    	if(up){
			$MainMenuItem.css({top:0});
		}else{
			$MainMenuItem.css({top:$(window).height()});
		}
		setMove(false,true,function(){
			if(up){
				for(var i=_mianMenuLength;i>-1;i--){
					(function(_i){
						setTimeout(function(){
							$MainMenuItem.eq(_i).animate({top:$(window).height()},500,_animateStyle); 
						},_i*200);
					})(i)
					
				}
			}else{
				for(var i=0;i<_mianMenuLength;i++){
					(function(_i){
						setTimeout(function(){
							$MainMenuItem.eq(_i).animate({top:0},500,_animateStyle); 
						},_i*200);
					})(i)
					
				}
			}
			var _outtime = (_mianMenuLength-1)*200+500;
			if(up){ _outtime = (_mianMenuLength-1)*200; }
			setTimeout(function(){
				_pageIsInAnimate = false;
				setMove(true,false,function(){
					if(callback){ callback.call(null); }
				});				
			},_outtime);
		});		 	
    }



	//init
	$(window).resize(function(event) {
		setResize();
		setMove();
		afterResetUL();
	});
	
	$(window).load(function(event) {
		setResize();
		$MainMenuItem.each(function(i){ $(this).css({'z-index':i}); });

		//初始化banner
		bannerAnimation($('.main-banner ul'),$('.main-banner .prev'),$('.main-banner .next'),function(){ 	
			//if(_isautoreturn){ return false; }
			clearInterval(_bannerAuto);
			$MainBanner.animate({top:-$(window).height()},500,_animateStyle);
			mainItemAnimation(); 
			_global_show = 1;	
		});
		_autoFunction = function(){ 			
			if(parseInt($('.main-banner ul').attr('_data_now'))>=$('.main-banner ul li').length-1){
				_isautoreturn = true;
				clearInterval(_bannerAuto);	
			}			
			$('.main-banner .next').trigger('click');
		}
		_bannerAuto = setInterval(function(){ 
			_autoFunction();
		},3000);
		$('.main-banner').hover(function(){
			clearInterval(_bannerAuto);
		},function(){
			if(_isautoreturn){ return false; }
			_bannerAuto = setInterval(function(){ 
				_autoFunction();
			},3000);
		});

		//内页banner
		$('.item-list').each(function(){
			var $this = $(this);
			bannerAnimation($this,$this.next().find('.prev'),$this.next().find('.next'));
		});

	});

	//内容点击
	$MainMenuItem.click(function(){
		var $this = $(this),_i = $this.index();
		$MenuSet.eq(_i).trigger('click');
	});

	//菜单点击
	$MenuSet.click(function(){
		//跳过自动播放
		clearInterval(_bannerAuto);
		_isautoreturn = true;

		var $this = $(this),_i = $this.index();
		if(_global_show==0){
			$MainBanner.animate({top:-$(window).height()},500,_animateStyle);
			mainItemAnimation(function(){ setTimeout(function(){ $MenuSet.eq(_i).trigger('click'); },200); });
			_global_show = 1;
		}
		if(_pageIsInAnimate){ return false; }
		_resizeResetItems = false;
		if(_global_ItemShow==_i){ return false; }
		$MainMenuItem.find('.main-decription').fadeOut(400);
		showMainContent(_i);
	}).hover(function(){
		if($(this).hasClass('on')){return false;}
		$(this).find('.onshow').fadeIn(500);
	},function(){
		if($(this).hasClass('on')){return false;}
		$(this).find('.onshow').fadeOut(500);
	});


	$MainMenuItem.find('.btn-close').click(function(e){
		_global_ItemShow = -1;
		_resizeResetItems = true;
		stopBubble(e);
		setMove(true);

		//关闭后初始化
		$('.item-list').each(function(){
			$(this).css({top:0}).attr('_data_now',0);
		});
	});

	//返回首页
	$('.logo').click(function(){
		_global_show = 0;
		_global_ItemShow = -1;
		_resizeResetItems = true;
		$MenuSet.removeClass('on').find('.onshow').fadeOut(500);
		setMove(true,false,function(){
			setTimeout(function(){
				mainItemAnimation(function(){
					$MainBanner.animate({top:0},500,_animateStyle);
				},true);
			},500);
		});
	});

});


//重置li
function afterResetUL(){
	$('.item-list,.main-banner ul').each(function(){
		var $this = $(this),i = $this.attr('_data_now') || 0;;
		$this.css({top:-(i*$this.find('li').eq(0).height())});
	});
}

//banner
function bannerAnimation($obj,$prev,$next,onend){
	if($obj.is(':animated')){ return false; }
	var $item = $obj.find('li'),_len = $item.length;

	function _show(st){
		var i = $obj.attr('_data_now') || 0;
		if(st==1){
			i++;
		}else{
			i--;
		}

		if(i<0){ i=0; return false; }
		if(i>_len-1){ i=_len-1; onend.call(null); return false; }
		$obj.attr('_data_now',i);
		$obj.animate({top:-(i*$obj.find('li').eq(0).height())},400);
	}

	$prev.bind('click',function(){ _show(-1); });
	$next.bind('click',function(){ _show(1); });
}



function imgload(_url,fn){
	var img = new Image();
	if(/*@cc_on 1 || @*/ 0){
	   img.onreadystatechange = function(){
			if(img.readyState=="complete"||img.readyState=="loaded"){
				fn.call(this,_url);
			}
		}
	}else{
		img.onload = function(){
			fn.call(this,_url);
		}
	}

	img.onerror = function(){
		fn.call(this,_url);
	}

	img.src = _url;
}

function imageLoad(arr,bar,callback){
	var success = 0,len=arr.length;
	function loadimg(){
	   imgload(arr[success],function(){
		   success++;
		   if(success<len){
			  if(bar){
				//alert(((success+1)/len));
				_domBar.innerHTML = '加载中...'+(parseInt(((success+1)/len)*10000))/100+"%";
				//_domBar.innerHTML = '';
			  }                  
			  loadimg();  
		   }else{
				//alert(success);
				_domBar.style.display = 'none';
				callback.call(null);
		   }
	   });  
	}
	loadimg();
}