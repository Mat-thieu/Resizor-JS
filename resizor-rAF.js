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

	var setMouse = function(state, cursor){
		thisHoverState = state;
		document.body.style.cursor = cursor;
	}

	var moveThrottle = 0;
	var setMouseState = function(e){
		moveThrottle++;
		if(!(moveThrottle % 4) || moveThrottle == 1){
			if((e.pageX >= triggers.right) && (e.pageY >= triggers.bottom)) setMouse('right-bottom', 'nwse-resize');
			else if((e.pageX >= triggers.right) && (e.pageY <= triggers.top)) setMouse('right-top', 'nesw-resize');
			else if((e.pageX <= triggers.left) && (e.pageY <= triggers.top)) setMouse('left-top', 'nwse-resize');
			else if((e.pageX <= triggers.left) && (e.pageY >= triggers.bottom)) setMouse('left-bottom', 'nesw-resize');
			else if(e.pageY <= triggers.top) setMouse('top', 'ns-resize');
			else if(e.pageY >= triggers.bottom) setMouse('bottom', 'ns-resize');
			else if(e.pageX >= triggers.right) setMouse('right', 'ew-resize');
			else if(e.pageX <= triggers.left) setMouse('left', 'ew-resize');
			else setMouse(false, 'default');
		}
	}

	ele.addEventListener('mousemove', setMouseState, false);

	// Dragstart
	ele.addEventListener('mousedown', function(evtDown){
		moveThrottle = 0;
		var startPos = {top : evtDown.pageY, left : evtDown.pageX};
		var mouse = {y :startPos.top, x : startPos.left};
		ele.removeEventListener('mousemove', setMouseState, false);

		var _funcMouseMoveHook = function(evtMove){
			mouse.x = evtMove.pageX;
			mouse.y = evtMove.pageY;
		}

		var setDimensions = function(){
			switch(thisHoverState){
				case 'right':
					var thisWidth = rect.width + (mouse.x - startPos.left);
					ele.style.width = thisWidth+"px";
				break;

				case 'bottom':
					var thisHeight = rect.height + (mouse.y - startPos.top);
					ele.style.height = thisHeight+"px";
				break;

				case 'top':
					ele.style.top = rect.top - (startPos.top - mouse.y)+"px";
					ele.style.height = rect.height + (startPos.top - mouse.y)+"px";
				break;

				case 'left':
					ele.style.left = rect.left - (startPos.left - mouse.x)+"px";
					ele.style.width = rect.width + (startPos.left - mouse.x)+"px";
				break;

				case 'right-bottom':
					// right
					var thisWidth = rect.width + (mouse.x - startPos.left);
					ele.style.width = thisWidth+"px";
					// bottom
					var thisHeight = rect.height + (mouse.y - startPos.top);
					ele.style.height = thisHeight+"px";
				break;

				case 'right-top':
					// right
					var thisWidth = rect.width + (mouse.x - startPos.left);
					ele.style.width = thisWidth+"px";
					// top
					ele.style.top = rect.top - (startPos.top - mouse.y)+"px";
					ele.style.height = rect.height + (startPos.top - mouse.y)+"px";
				break;

				case 'left-top':
					// left
					ele.style.left = rect.left - (startPos.left - mouse.x)+"px";
					ele.style.width = rect.width + (startPos.left - mouse.x)+"px";
					// top
					ele.style.top = rect.top - (startPos.top - mouse.y)+"px";
					ele.style.height = rect.height + (startPos.top - mouse.y)+"px";
				break;

				case 'left-bottom':
					// left
					ele.style.left = rect.left - (startPos.left - mouse.x)+"px";
					ele.style.width = rect.width + (startPos.left - mouse.x)+"px";
					// bottom
					var thisHeight = rect.height + (mouse.y - startPos.top);
					ele.style.height = thisHeight+"px";
				break;
			}

			animationLoop = requestAnimationFrame(setDimensions);
		}

		if(thisHoverState){
			window.addEventListener('mousemove', _funcMouseMoveHook, false);
			setDimensions();
		}

		window.addEventListener('mouseup', function _funcMouseUpHook(){
			window.cancelAnimationFrame(animationLoop);
			window.removeEventListener('mousemove', _funcMouseMoveHook, false);
			window.removeEventListener('mouseup', _funcMouseUpHook, false);
			ele.addEventListener('mousemove', setMouseState, false);

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