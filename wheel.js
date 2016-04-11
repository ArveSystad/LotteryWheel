"use strict";

var Lottery = Lottery || {};

Lottery.Wheel = (function() {
	var baseColors = ['#E80114','#FFC800','#0662D9','#007308','#E204A6'];
	var colors = [];
	var tickets = [];

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		center = { x: canvas.width/2, y: canvas.height/2 },
		strokeWidth = 3,
		spinning = false,
		stopInitiated = false,
		slowdownSpeed = 0.0007,
		defaultSpinAngle = 0,
		defaultAngleModifier = 0.2,
		stopArrowWidth = 5,
		stopArrowLength = 30,
		radius = (canvas.width/2) - strokeWidth - (stopArrowLength/3),
		winningPoint = { x: center.x, y: stopArrowLength },
		spinTimeMin = 3000,
		spinTimeMax = 10000;

	var requestAnimationFrame = window.requestAnimationFrame || 
	                            window.mozRequestAnimationFrame || 
	                            window.webkitRequestAnimationFrame || 
	                            window.msRequestAnimationFrame;

	var _getTicketCount = function() {
		var ticketCount = 0;

		for (var i = 0, len = tickets.length; i < len; i++)
		{
			ticketCount += parseInt(tickets[i].value);
		}
		return ticketCount;
	}

	var currentBaseColorIndex = 0;
	var _assignPlayerColor = function() {
		if(tickets.length % baseColors.length == 0)
			currentBaseColorIndex = 0;
		else
			currentBaseColorIndex++;

		colors.push(baseColors[currentBaseColorIndex]);
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
		ctx.font = '20px sans-serif';

		for (var i = 0; i < tickets.length; i++) {
			ctx.beginPath();
			ctx.moveTo(center.x,center.y);
			ctx.strokeStyle = '#000000';
			ctx.lineWidth = strokeWidth;
			var thisSectionAngle = (Math.PI * 2 * (tickets[i].value/ticketCount));
			ctx.arc(center.x, center.y, radius, currentangle, currentangle + thisSectionAngle, false);
			ctx.stroke();
			ctx.lineTo(center.x, center.y);
			ctx.stroke();
			
			ctx.fillStyle = colors[i];
			ctx.fill();

			currentangle += thisSectionAngle;
			ctx.closePath();

			if(!spinning && stopInitiated) {
				if(ctx.isPointInPath(winningPoint.x, winningPoint.y)) {
					_fillPlayerList(i);
				}
					
			}
		}
		
		_drawCenterHub();
		_drawStopArrow();

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

	var _drawCenterHub = function() {
		ctx.beginPath();
		ctx.moveTo(center.x, center.y);
		ctx.arc(center.x, center.y, 40, 0, Math.PI * 2, false);
		ctx.fillStyle = '#000000';
		ctx.fill();
		ctx.closePath();
	}

	var _drawStopArrow = function() {
		var width = stopArrowWidth;
		var length = stopArrowLength;
		ctx.beginPath();
		ctx.moveTo(center.x-width, 0);
		ctx.fillStyle = '#000000';
		ctx.lineTo(center.x-stopArrowWidth, length - (2*width));
		ctx.lineTo(center.x, length );
		ctx.lineTo(center.x+width, length - (2*width));
		ctx.lineTo(center.x+width, 0);
		ctx.fill();
		ctx.closePath();
	}

	var _resetValues = function() {
		spinAngle = defaultSpinAngle;
		angleModifier = defaultAngleModifier;
	}

	var _spin = function() {
		_resetValues();
		spinning = !spinning;
		if(spinning)
			requestAnimationFrame(_drawWheel);

		var spinTime = _getRandomSpinTime();
		setTimeout(function() { stopInitiated = true; console.log("stopping slowly...") }, spinTime);
	}

	var _getRandomSpinTime = function () {
  		return Math.floor(Math.random() * (spinTimeMax - spinTimeMin)) + spinTimeMin;
	}

	var _fillPlayerList = function(winnerIndex) {
		var markup = '';

		$('#playerList').empty();
		for(var i = 0, len = tickets.length; i < len; i++) {
			var color = colors[i];

			if(winnerIndex === i)
				markup += '<li style="background-color: ' + color + '" class="winner">' + tickets[i].name + '</li>';
			else
				markup += '<li style="background-color: ' + color + '">' + tickets[i].name + '</li>';
		}

		$('#playerList').append(markup);
	}

	var _addTickets = function(name, ticketCount) {
		tickets.push({name: name, value: ticketCount });
		_assignPlayerColor();
		_fillPlayerList();
		_drawWheel();
	}

	return {
		init: _init,
		spin: _spin,
		addTickets: _addTickets
	}
})();