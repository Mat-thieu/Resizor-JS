var makeResizable = function(id, settings){
	var ele = document.getElementById(id);
	var rect = ele.getBoundingClientRect();
	var triggers;
	var thisHoverState;

	ele.addEventListener('mouseover', function(){
		triggers = {
			top : settings.triggerMargin + rect.top,
			left: settings.triggerMargin + rect.left,
			right : ((rect.left + rect.width) - settings.triggerMargin),
			bottom : ((rect.top + rect.height) - settings.triggerMargin)
		}
	})

	var mouseVertical = function(state){
		thisHoverState = state;
		document.body.style.cursor = "ns-resize";
	};
	var mouseHorizontal = function(state){
		thisHoverState = state;
		document.body.style.cursor = "ew-resize";
	};
	var moveThrottle = 0;
	var checkState = function(e){
		moveThrottle++;
		if(!(moveThrottle % 5) || moveThrottle == 1){
			if(e.pageY <= triggers.top) mouseVertical('top');
			else if(e.pageY >= triggers.bottom) mouseVertical('bottom');
			else if(e.pageX >= triggers.right) mouseHorizontal('right');
			else if(e.pageX <= triggers.left) mouseHorizontal('left');
			else document.body.style.cursor = "default";
		}
	}

	ele.addEventListener('mousemove', checkState, false);

	// Dragstart
	ele.addEventListener('mousedown', function(evtDown){
		moveThrottle = 0;
		var startPos = {top : evtDown.pageY, left : evtDown.pageX};
		ele.removeEventListener('mousemove', checkState, false);

		var dragMoveThrottle = 0;
		function _funcMouseMoveHook(evtMove){
			dragMoveThrottle++;
			if(!(dragMoveThrottle % 2) || dragMoveThrottle == 1){
				switch(thisHoverState){
					case 'right':
						var thisWidth = rect.width + (evtMove.pageX - startPos.left);
						// if(thisWidth <= settings.max.width && thisWidth >= settings.min.width)
						ele.style.width = thisWidth+"px";
						// else ele.style.width = ele.width-1+"px";
					break;

					case 'bottom':
						var thisHeight = rect.height + (evtMove.pageY - startPos.top);
						// if(thisHeight <= settings.max.height && thisHeight >= settings.min.height)
						ele.style.height = thisHeight+"px";
						// else ele.style.height = ele.height-1+"px";
					break;

					case 'top':
						// var thisHeight = rect.height + (evtMove.pageY - startPos.top);
						// if(thisHeight <= settings.max.height && thisHeight >= settings.min.height){
						ele.style.top = rect.top - (startPos.top - evtMove.pageY)+"px";
						ele.style.height = rect.height + (startPos.top - evtMove.pageY)+"px";
						// }
						// else ele.style.height = ele.height-1+"px";
					break;

					case 'left':
						// var thisWidth = rect.width + (evtMove.pageX - startPos.left);
						// if(thisWidth <= settings.max.width && thisWidth >= settings.min.width){
						ele.style.left = rect.left - (startPos.left - evtMove.pageX)+"px";
						ele.style.width = rect.width + (startPos.left - evtMove.pageX)+"px";
						// }
						// else ele.style.width = ele.width-1+"px";
					break;
				}
			}
		}
		window.addEventListener('mousemove', _funcMouseMoveHook, false);

		window.addEventListener('mouseup', function _funcMouseUpHook(){
			window.removeEventListener('mousemove', _funcMouseMoveHook, false);
			window.removeEventListener('mouseup', _funcMouseUpHook, false);
			ele.addEventListener('mousemove', checkState, false);

			// Store the new div dimensions
			rect = ele.getBoundingClientRect();
			triggers = {
				top : settings.triggerMargin+rect.top,
				left: settings.triggerMargin+rect.left,
				right : ((rect.left + rect.width) - settings.triggerMargin),
				bottom : ((rect.top + rect.height) - settings.triggerMargin)
			}
		})
	}, false)
}