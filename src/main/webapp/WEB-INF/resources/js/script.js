
var lastMsgTime = 0;
var secondLast;
var startDate='';
var stD = 0;
var cT = '';
var isTyping = false;
var rC = true;

var monthNames = [
	  "January", "February", "March",
	  "April", "May", "June", "July",
	  "August", "September", "October",
	  "November", "December"
	];

const DISABLED = 'disabled';

var $toast = $('#toast'); 
var $modalContent = $('.modal-content');
var $modal = $('.modal');
var $console = $('#console');
var $typeS = $('#status-bar div');


function hideTypeS() {
	$typeS.animate({opacity: 0});
}

function showTypeS(msg) {
	if($typeS.css('opacity') == '0') {
		$('#type-stat').text(msg);
		$typeS.animate({opacity: 1});
	}
}


function log(msg) {
	/*
	$console.append('<div class="log-info">' + msg + '</div>');
	scrollToBootomOfLog();
	*/
	function scrollToBootomOfLog() {
		var height = 0;
		$('#console .log-info').each(function(i, value){
		    height += parseInt($(this).height());
		});
		height += '';
		$('#console').css({scrollTop: height});
	}
}

function hasSpace() {
	var expr = /\s/;
	return expr.test($('#user').val())
}

function notTyping() {
	isTyping = false;
}

function doPostMsg(e){
	isTyping = $('#text-ip').val().length > 0;
	if(e.which === 13 ){
		postThisMessage();
	}
}

$('#send-butt').click(postThisMessage);

function postThisMessage() {
	if($('#text-ip').val().trim().length > 0) {
		postMessage();
	}
}

function checkForNewDate() {
	if((getDatePart(startDate) < getDatePart(cT))  ||  $('.msg-wrapper').length === 0) {
		var parts = cT.split(" ")[0].split("-");
		var div = getMarkerForText(monthNames[parseInt(parts[1]) - 1] + ' ' + parts[2] + ', ' + parts[0]);
		$('#chat-box').append(div);
	}
}

function getMarkerForText(text) {
	return '<div class="msg-wrapper day"><div class="msg day day1">' + text  + '</div></div>';
}

function getDatePart(date) {
	return parseInt(date.split(" ")[0].split("-")[2]);
}


function scrollToChatBoxBottom() {
	var height = 0;
	$('#chat-box div').each(function(i, value){
	    height += parseInt($(this).height());
	});
	height += 30;
	$('#chat-box').animate({scrollTop: '' + height});
}

function getFormattedTime(time) {
	time = time.split(" ")[1];
	var parts = time.split(":");
	var hr = parts[0] % 12;
	if(parseInt(parts[0]) % 12 == 0) {
		hr = 12;
	}
	var min = parts[1];
	hr = parseInt(hr) < 10 ? '0' + hr : hr;
	var a_p = parseInt(parts[0]) >= 12 ? 'pm' : 'am';  
	return hr + ':' + min + ' ' + a_p;
}


function updateStatus(jsonObj) {
	var i = 0;
	var oneName = '';
	var userCount = 0;
	var me = $('.user-details')[$('.user-details').length - 1];
	while(i < jsonObj.length) {
		var name = jsonObj[i].user;
		if($('#usr-' + name).length === 1) {
			if(name != cuser()) {
				determineStatus(jsonObj[i]);
				$('#st-' + name).text(jsonObj[i].status);
				if(jsonObj[i].status.charAt(0) == 'T') {
					if(oneName == '') {
						oneName = jsonObj[i].fname.split(' ')[0];
					} else {
						userCount++;
					}
				}
			}
		}else {
			$(me).before(getUserTemplate(jsonObj[i]));
			checkForNewDate();
			$('#chat-box').append(getMarkerForText(name + ' joined'));
			scrollToChatBoxBottom();
		}
		i++;
	}
	if(oneName != '') {
		var msg = oneName;
		if(userCount > 0) {
			msg += ' and ' + userCount + ' other are ';
		} else {
			msg += ' is ';
		}
		showTypeS(msg + ' typing...');
	} else {
		hideTypeS();
	}

}


function getUserTemplate(u) {
	determineStatus(u);
	return `<div class="user-details" id="ud-${u.user}" title="${u.user}">
				<div>
					<span class="user-name" id="usr-${u.user}">${u.fname}</span>
					<span id="creator" style="display: ${u.cr}"> Creator </span>
				</div>
				<div>
					<span class="user-status" id="st-${u.user}">${u.status}</span>
				</div>
			</div>`;
}


//2018-06-20 02:33
function determineStatus(u) {
	var status = u.status;
	var now = new Date(cT);
	if(/^\d\d\d\d/.test(status)) {
		var st = new Date(status);
		var diff = (now.getTime() - st.getTime()) / 1000;
		var time = st.toLocaleString().split(',')[1].trim().replace(':00', '');
		if(diff < 60) {
			status = 'Online';
		} else {
			
			var dateDiff = now.getDate() - st.getDate(); 
			if(dateDiff == 0) {
				status = 'Last seen today at ' + time;
			} else if(dateDiff == 1) {
				status = 'Last seen yesterday at ' + time;
			} else {
				status = 'Last seen ' + st.toLocaleString().split(',')[0] + ', ' + time;
			}
		}
	}
	u.status = status;
}


function getMsgs() {
	if(rC) {
		log('getMsgs():130, getting msgs');
		rC = false;
		$.ajax({
			method: 'get',
			url: window.location.pathname + '/gms',
			data: postStatus()
		}).done(function(data) {
			data = $.parseJSON(data);
			//log('getMsgs(' + lastMsgTime + '):138, ' + data.msg.length + ' msgs fetched');
			renderMsgs(data.msg);
			updateStatus(data.status);
			rC = true;
		});
	} else {
		log('getMsgs():144, not getting msgs as last call is not completed yet');
	}
}
function renderMsgs(msgs) {
	var i = 0;
	while(i <= msgs.length - 1) {
		if($('#msg-' + msgs[i].time.$numberLong).length == 0) {
			checkForNewDate();
			$('#chat-box').append(getBubble(msgs[i]));
			lastMsgTime = msgs[i].time.$numberLong;
			scrollToChatBoxBottom();
		} else {
			log('renderMsgs():156, Not rendering msg.');
		}
		i++;
	}
}


function getBubble(msg) {
	formatAtProp(msg);
	if(msg.by == cuser()) {
		return getOutgoingBubble(msg);
	} else {
		return getIncomingBubble(msg);
	}
}

function formatAtProp(msg) {
	var options = { 
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
	};
	
	var options2 = { 
			hour: 'numeric',
			minute: 'numeric'
	};
	var d = new Date(parseInt(msg.time.$numberLong));
	msg.fat = d.toLocaleDateString("en-US", options);
	msg.at = d.toLocaleDateString("en-US", options2).split(', ')[1];
}

function getIncomingBubble(msg) {
	if(msg.type == 'text') {
		return getIText(msg);
	}
} 


function getIText(msg) {
	return '<div class="msg-wrapper incoming" id="msg-' + msg.time.$numberLong + '">' +
				'<div class="msg in">' +
					'<div class="msg-by-wrapper">' + 
						'<span class="msg-by">' + msg.by + '</span></div>' +
				'<div class="main-msg">' + msg.msg + '</div>' + 
				'<div class="time-bar incoming">' +
					'<span class="time">' + msg.at + '</span>' +
			  '</div></div></div>';
}


function getOutgoingBubble(msg) {
	if(msg.type == 'text') {
		return getOText(msg);
	}
} 


function getOText(msg) {
	return '<div class="msg-wrapper outgoing" id="msg-' + msg.time.$numberLong + '">' + 
				'<div class="msg out">' +
				'<div class="main-msg">' + msg.msg + '</div>' +
				'<div class="time-bar outgoing">' +
				'<span class="time"> ' + msg.at + '&nbsp;&nbsp;<span class="tick"><i class="fas fa-check"></i><span></span>' +
			'</div></div></div>';
}



function postStatus() {
	if ($("#text-ip").is(':focus') && $('#text-ip').val().length === 0) {
		notTyping();
	}
	return {status: isTyping, time: cT, user: cuser(), lmt: lastMsgTime};
}

function postMessage() {
	var msg = $('#text-ip').val().trim();
	$('#text-ip').val('');
	var data = {msg : msg, by: cuser(), type: 'text', at: cT};
	//addNewBubble(data);
	log('postMsg():240 Posting msg...');
	$.ajax({
		method: 'post',
		url: window.location.pathname + '/post-msg',
		data: {
			msg: JSON.stringify(data)
		}
	}).done(function(res) {
		log('postMsg():248 ' + res);
		/*if(res == 'true') {
			$('#bubble-' + data.time).css({'opacity': '1'});
		}*/
	});
}


function addNewBubble(msg) {
	lastMsgTime = msg.time;
	var msg2 = Object.assign({}, msg);
	msg2.time = {
			'$numberLong': msg2.time
	};
	formatAtProp(msg2);
	var bubble = '<div class="msg-wrapper outgoing" id="msg-' + msg.time + '">' + 
					'<div class="msg out">' +
					'<div class="main-msg">' + msg2.msg + '</div>' +
					'<div class="time-bar outgoing">' +
					'<span class="time"> ' + msg2.at + '&nbsp;&nbsp;<span id="bubble-' +
						msg2.time.$numberLong + '" style="opacity: 0;" class="tick"><i class="fas fa-check"></i><span></span>' +
					'</div></div></div>';
	checkForNewDate();
	$('#chat-box').append(bubble);
	scrollToChatBoxBottom();
}

function startServices() {
	var msgFetcher = setInterval(getMsgs, 1000);
}

function getTime() {
	$.ajax({
		method: 'get',
		url: 'https://api.ipgeolocation.io/ipgeo?apiKey=9c19f884bafd4dd281381936964a6982',		
	}).done(function(msg) {
		startServices();
		cT = msg.time_zone.current_time.substr(0, 16);
		if(stD == 0) {
			startDate = cT;
			stD++;
			setInterval(clock, 60 * 1000);
		}
		
	});
}

function clock() {
	var parts = cT.split(" ")[1].split(":");
	var hr = parts[0];
	var min = parts[1];
	var needed = true;
	min++;
	hr = parseInt(hr);
	if(min == 60) {
		min = 0;
		hr++;
		if(hr == 24) {
			hr = 0;
			getTime();
			needed = false;
		}
	}
	if(needed) {
		cT = cT.split(" ")[0] + ' ' + (hr > 9 ? hr : '0' + hr) + ':' + (min > 9 ? min : '0' + min);
	}
}


$('#user-butt').click(function() {
	//$('#mem-list').toggleClass('mem-list-class-phn');
	if($('#cc').html().length === 0){
		$('#cc').html($('#mem-list').html());
		$('#cc').show('slide', 600);
		$('#user-butt').css('color', '#3c3c3c');
		$('#user-butt').css('background-color', 'rgba(248, 205, 85, 1)');
		$('#user-butt').css('border', '1px solid rgba(248, 205, 85, 1)');
		$('body').css('overflow', 'hidden');
		//$('#cc').css('position', 'fixed');

	}else {
		$('#cc').html('');
		$('#cc').hide('drop', 600);
		$('#user-butt').css('background-color', '#3c3c3c');
		$('#user-butt').css('color', 'rgba(248, 205, 85, 1)');
		$('#user-butt').css('border', '1px solid gray');
		//$('#cc').css('position', 'absolute');
		$('body').css('overflow', 'auto');
	}
}); 








$('#login-btn').on('click', function() {
	var $btn = $(this);
	$btn.addClass(DISABLED);
	toast('Loging in...');
	$.ajax({
		method: "post",
		url: "login",
		data: $('form').serialize(),
		success: function(data) {
			if(data != 'null') {
				window.localStorage.setItem('fname', data);
				window.localStorage.setItem('user', $('#user').val());
				setToastText('Redirecting...');
				window.location.assign('user/' + $('#user').val());
			} else {
				showError('Invalid username or password');
				$btn.removeClass(DISABLED);
				hideToast();
			}
		}
	});
});

function formToJSON(form) {
	var json = {};
    var arr = $(form).serializeArray();
    $(arr).each(function(i, obj) {
      var $n = obj.name,
        $v = obj.value;
      if (!json[$n]) {
        json[$n] = $v;
      } else {
        var what = json[$n];
        if (typeof what === 'string') {
          json[$n] = [what];
        }
        json[$n].push($v);
      }
    });
    return json;
}


$('#signup-btn').on('click', function() {
	var $butt = $(this);
	var u = formToJSON($butt.attr('data-form'));
	if (valid(u)) {
		$butt.addClass(DISABLED);
		toast('Signing up...');
		$.ajax({
			url : 'me-signup',
			method : 'post',
			data : {
				name : u.fullname,
				user : u.username,
				pass : u.pass
			},
			success : function(data) {
				if (data != 'null') {
					$butt.removeClass(DISABLED);
					hideToast();
					showError('Username is not available.');
				} else {
					window.localStorage.setItem('fname', data);
					window.localStorage.setItem('user', u.username);
					setToastText('Redirecting...');
					window.location.assign('user/' + u.username);
				}
			},
			error : function() {

			}
		});
	}

	function valid(json) {
		var v = true;
		var msg;
		Object.keys(json).forEach(function(key) {
			if (json[key].trim().length == 0) {
				msg = 'Fields can\'t be empty!';
				v = false;
			}
		});

		if (json.pass != json.cpass) {
			v = false;
			msg = 'Passwords do not match!';
		}

		if (!v) {
			showError(msg);
		}

		return v;
	}

}); 

function showError(msg) {
	$('#err-txt').show();
	$('#err-txt').text(msg).fadeOut(5000);
}


function toast(msg) {
	$toast.css({'display': 'inline-block'});
	setToastText(msg);
}

function setToastText(msg) {
	$toast.html(msg);
}

function hideToast() {
	$toast.hide();
}

$('.close').on('click', function() {
	$modal.hide();
});

$('#new-cr-btn').on('click', function() {
	$('.modal-form').hide();
	$('#new-cr-form').show();
	$modal.show();
	
});

$('#join-cr-btn').on('click', function() {
	$('.modal-form').hide();
	$('#join-cr-form').show();
	$modal.show();
});


$('#new-cr-from-btn').on('click', function() {
	var btn = $(this);
	var cr = {
		name: $('#cr-name').val().trim(),
		slug: toSlug($('#cr-name').val()),
		creator: cuser(),
		_cd: new Date(),
		msgs: [],
		users: [{
			user: cuser(),
			status: '',
			fname: fname()
		}]
	};
	
	if(cr.name.trim().length > 0) {
		$.ajax({
			url : cuser() + '/create-cr',
			method : 'post',
			data : {
				cr: JSON.stringify(cr)
			},
			success : function(data) {
				if(data != 'un-auth') {
					if (data == 'e') {
						//handle this.
						$butt.removeClass(DISABLED);
					} else {
						window.location.assign('/chat/' + cr.slug);
					}
				}
			},
			error : function() {

			}
		});
	}
	
});


$('#join-cr-form-btn').on('click', function() {
	var btn = $(this);
	var cr = toSlug($('#jcr-name').val());
	var obj = {
		user: cuser(),
		status: '',
		fname: fname()
	};
	$.ajax({
		url : cuser() + '/join-cr',
		method : 'post',
		data : {
			cr: cr,
			u: JSON.stringify(obj)
		},
		success : function(data) {
			if(data == 'true') {
				window.location.assign('/chat/' + cr);
			} else {
				//handle
			}
		},
		error : function() {

		}
	});
});


function cuser() {
	return window.localStorage.getItem('user');
}

function toSlug(t) {
	return t.trim().toLowerCase().replace(/\s+/g, '-');
}

function fname() {
	return window.localStorage.getItem('fname');
}


function fetchAllChatRooms() {
	toast('Fetching chat rooms...');
	$.ajax({
		url : cuser() + '/all-chat',
		method : 'get',
		success : function(data) {
			hideToast();
			var json = $.parseJSON(data);
			renderChats(json, '0');
			renderChats(json, '1');
			$('.cr').on('click', function() {
				window.location.assign('/chat/' + $(this).attr('data-slug'));
			});
		},
		error : function() {

		}
	});
	
}


function renderChats(json, no) {
	var $list = $('#cr-list-' + no);
	json[no].forEach(function(cr) {
		$list.append(renderChat(cr));
	});
	if(json[no].length == 0) {
		$('#cr-list-' + no + '-p').hide();
	}
	
	function renderChat(cr) {
		cr.cd = toDate(cr._cd);
		cr.mem = toMemStatus(cr.users);
		var templ = `
			<div class="cr" data-slug="${cr.slug}">
				<div class="title">
					${cr.name}
				</div>
				<div class="mem-count">
					${cr.mem}
				</div>
				<div>
					<span class="creator">@${cr.creator}</span>
					<span class="cd">${cr.cd}</span>
				</div>
			</div>
		`;
		return templ;
	}
	
	
}

function toMemStatus(users) {
	if(users.length < 3) {
		if(users.length === 1) {
			return 'Only you.';
		} else {
			return 'You and 1 other.';
		}
	} else {
		var othr = users.length - 2;
		return 'You, ' + users[users.length - 1].fname.split(/\s+/)[0] + ' and ' +
					othr + ' other.';
	}
}

function toDate(d) {
	var date = new Date(d);
	return date.toDateString();F
}


function initChatRoom() {
	$.get(window.location.pathname + '/init', function(res) {
		var data = $.parseJSON(res);
		$('#chat-box-header').text(data.name);
		showUsers(data.users, data.creator);
		getTime();
	});
	
}

function showUsers(users, creator) {
	var me = addMe(creator);
	users.forEach(function(u) {
		if(u.user != window.localStorage.getItem('user')) {
			u.cr = u.user == creator ? 'block' : 'none';
			u.status = 'Online';
			$(me).before(getUserTemplate(u));
		}
	});
	
}

function addMe(creator) {
	var u = {
		fname: 'You',
		user: window.localStorage.getItem('user'),
		status: 'as ' + window.localStorage.getItem('user')
	}
	u.cr = u.user == creator ? 'block' : 'none';
	$('#mem-list').append(getUserTemplate(u));
	return `#ud-${u.user}`;
}




$('#upload-btn').on('click', function() {
	var file= document.getElementById('img');
	for(var i = 0 ; i < file.files.length; i++) {
		var fd = new FormData();
		fd.append('image', file.files[i]);
		var imgur = new Imgur({clientid: 'ccee0475bded108'});
		imgur.post('https://api.imgur.com/3/image', fd, function(res) {
			if(res.success) {
				console.dir(res.link);
			}
		});
	}
});




!function(t,e){"use strict";"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():t.Imgur=e()}(this,function(){"use strict";var e=function(t){if(!(this&&this instanceof e))return new e(t);if(t||(t={}),!t.clientid)throw"Provide a valid Client Id here: https://apidocs.imgur.com/";this.clientid=t.clientid,this.endpoint="https://api.imgur.com/3/image",this.callback=t.callback||void 0,this.dropzone=document.querySelectorAll(".dropzone"),this.run()};return e.prototype={createEls:function(t,e,i){var n,a=document.createElement(t);for(n in e)e.hasOwnProperty(n)&&(a[n]=e[n]);return i&&a.appendChild(document.createTextNode(i)),a},insertAfter:function(t,e){t.parentNode.insertBefore(e,t.nextSibling)},post:function(t,e,i){var n=new XMLHttpRequest;n.open("POST",t,!0),n.setRequestHeader("Authorization","Client-ID "+this.clientid),n.onreadystatechange=function(){if(4===this.readyState){if(!(200<=this.status&&this.status<300))throw new Error(this.status+" - "+this.statusText);var e="";try{e=JSON.parse(this.responseText)}catch(t){e=this.responseText}i.call(window,e)}},n.send(e),n=null},createDragZone:function(){var e,i;e=this.createEls("p",{},"Drag your files here or click in this area."),i=this.createEls("input",{type:"file",multiple:"multiple",accept:"image/*"}),Array.prototype.forEach.call(this.dropzone,function(t){t.appendChild(e),t.appendChild(i),this.status(t),this.upload(t)}.bind(this))},loading:function(){var t,e;t=this.createEls("div",{className:"loading-modal"}),e=this.createEls("img",{className:"loading-image",src:"./svg/loading-spin.svg"}),t.appendChild(e),document.body.appendChild(t)},status:function(t){var e=this.createEls("div",{className:"status"});this.insertAfter(t,e)},matchFiles:function(t,e){var i=e.nextSibling;if(t.type.match(/image/)&&"image/svg+xml"!==t.type){document.body.classList.add("busy"),i.classList.remove("bg-success","bg-danger"),i.innerHTML="";var n=new FormData;n.append("image",t),this.post(this.endpoint,n,function(t){document.body.classList.remove("busy"),"function"==typeof this.callback&&this.callback.call(this,t)}.bind(this))}else i.classList.remove("bg-success"),i.classList.add("bg-danger"),i.innerHTML="Invalid archive"},upload:function(i){var e,n,a,s;i.addEventListener("change",function(t){if(t.target&&"INPUT"===t.target.nodeName&&"file"===t.target.type)for(n=t.target.files,a=0,s=n.length;a<s;a+=1)e=n[a],this.matchFiles(e,i)}.bind(this),!1),["dragenter","dragleave","dragover","drop"].map(function(e){i.addEventListener(e,function(t){t.target&&"INPUT"===t.target.nodeName&&"file"===t.target.type&&("dragleave"===e||"drop"===e?t.target.parentNode.classList.remove("dropzone-dragging"):t.target.parentNode.classList.add("dropzone-dragging"))},!1)})},run:function(){document.querySelector(".loading-modal")||this.loading(),this.createDragZone()}},e});



