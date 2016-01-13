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
	var mouseDiagonalLeft = function(state){
		thisHoverState = state;
		document.body.style.cursor = "nwse-resize";
	}
	var mouseDiagonalRight = function(state){
		thisHoverState = state;
		document.body.style.cursor = "nesw-resize";
	}
	var moveThrottle = 0;
	var checkState = function(e){
		moveThrottle++;
		if(!(moveThrottle % 4) || moveThrottle == 1){
			if((e.pageX >= triggers.right) && (e.pageY >= triggers.bottom)) mouseDiagonalLeft('right-bottom');
			else if((e.pageX >= triggers.right) && (e.pageY <= triggers.top)) mouseDiagonalRight('right-top');
			else if((e.pageX <= triggers.left) && (e.pageY <= triggers.top)) mouseDiagonalLeft('left-top');
			else if((e.pageX <= triggers.left) && (e.pageY >= triggers.bottom)) mouseDiagonalRight('left-bottom');
			else if(e.pageY <= triggers.top) mouseVertical('top');
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
						ele.style.width = thisWidth+"px";
					break;

					case 'bottom':
						var thisHeight = rect.height + (evtMove.pageY - startPos.top);
						ele.style.height = thisHeight+"px";
					break;

					case 'top':
						ele.style.top = rect.top - (startPos.top - evtMove.pageY)+"px";
						ele.style.height = rect.height + (startPos.top - evtMove.pageY)+"px";
					break;

					case 'left':
						ele.style.left = rect.left - (startPos.left - evtMove.pageX)+"px";
						ele.style.width = rect.width + (startPos.left - evtMove.pageX)+"px";
					break;

					case 'right-bottom':
						var thisWidth = rect.width + (evtMove.pageX - startPos.left);
						ele.style.width = thisWidth+"px";
						var thisHeight = rect.height + (evtMove.pageY - startPos.top);
						ele.style.height = thisHeight+"px";
					break;

					case 'right-top':
						var thisWidth = rect.width + (evtMove.pageX - startPos.left);
						ele.style.width = thisWidth+"px";
						ele.style.top = rect.top - (startPos.top - evtMove.pageY)+"px";
						ele.style.height = rect.height + (startPos.top - evtMove.pageY)+"px";
					break;

					case 'left-top':
						ele.style.left = rect.left - (startPos.left - evtMove.pageX)+"px";
						ele.style.width = rect.width + (startPos.left - evtMove.pageX)+"px";
						ele.style.top = rect.top - (startPos.top - evtMove.pageY)+"px";
						ele.style.height = rect.height + (startPos.top - evtMove.pageY)+"px";
					break;

					case 'left-bottom':
						ele.style.left = rect.left - (startPos.left - evtMove.pageX)+"px";
						ele.style.width = rect.width + (startPos.left - evtMove.pageX)+"px";
						var thisHeight = rect.height + (evtMove.pageY - startPos.top);
						ele.style.height = thisHeight+"px";
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