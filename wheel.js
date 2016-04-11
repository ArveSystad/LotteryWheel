"use strict";

var Lottery = Lottery || {};

Lottery.Wheel = (function() {
	var colors = ['#E80114','#FFC800','#0662D9','#007308','#E204A6'];
	var tickets = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10];

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		center = { x: canvas.width/2, y: canvas.height/2 },
		strokeWidth = 3,
		radius = (canvas.width/2) - strokeWidth,
		spinning = false,
		stopInitiated = false,
		slowdownSpeed = 0.0007,
		defaultSpinAngle = 0,
		defaultAngleModifier = 0.2;

	var requestAnimationFrame = window.requestAnimationFrame || 
	                            window.mozRequestAnimationFrame || 
	                            window.webkitRequestAnimationFrame || 
	                            window.msRequestAnimationFrame;

	var _getTicketCount = function() {
		var ticketCount = 0;

		for (var i = 0, len = tickets.length; i < len; i++)
		{
			ticketCount += tickets[i];
		}
		return ticketCount;
	}

	var currentColorIndex = 0;
	var _getColor = function(ticketIndex) {
		if(ticketIndex % colors.length == 0)
			currentColorIndex = 0;
		else
			currentColorIndex++;

		return colors[currentColorIndex];
	}

	var _init = function() {
		_drawWheel();
	}

	var spinAngle = defaultSpinAngle;
	var angleModifier = defaultAngleModifier;

	var _drawWheel = function() {
		var currentangle = 0 + spinAngle;
		var ticketCount = _getTicketCount();
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < tickets.length; i++) {
			ctx.beginPath();
			ctx.moveTo(center.x,center.y);
			ctx.strokeStyle = '#000000';
			ctx.lineWidth = strokeWidth;
			var thisSectionAngle = (Math.PI * 2 * (tickets[i]/ticketCount));
			ctx.arc(center.x, center.y, radius, currentangle, currentangle + thisSectionAngle, false);
			ctx.stroke();
			ctx.lineTo(center.x, center.y);
			ctx.stroke();
			
			ctx.fillStyle = _getColor(i);;
			ctx.fill();

			currentangle += thisSectionAngle;
			ctx.closePath();
		}
		
		ctx.beginPath();
		ctx.moveTo(center.x, center.y);
		ctx.arc(center.x, center.y, 40, 0, Math.PI * 2, false);
		ctx.fillStyle = '#000000';
		ctx.fill();
		ctx.closePath();

		if(spinning) {
			requestAnimationFrame(_drawWheel);
			spinAngle+= angleModifier;
			if(stopInitiated && angleModifier > 0) {
				angleModifier-= slowdownSpeed;
				if(angleModifier < 0)
					spinning = false;
			}
		}
	}

	var _resetValues = function() {
		spinAngle = defaultSpinAngle;
		angleModifier = defaultAngleModifier;
	}

	var _spin = function() {
		_resetValues();
		console.log("spinning...");
		spinning = !spinning;
		if(spinning)
			requestAnimationFrame(_drawWheel);

		setTimeout(function() { stopInitiated = true; console.log("stopping slowly...") }, 2000);
	}

	return {
		init: _init,
		spin: _spin

		/*TODO: addTickets() */
	}
})();