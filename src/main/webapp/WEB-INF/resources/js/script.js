var lastMsgTime = 0;
var secondLast;
var startDate = '';
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
	$typeS.animate({
		opacity: 0
	});
}

function showTypeS(msg) {
	if ($typeS.css('opacity') == '0') {
		$('#type-stat').text(msg);
		$typeS.animate({
			opacity: 1
		});
	}
}


function log(msg) {
	/*
	$console.append('<div class="log-info">' + msg + '</div>');
	scrollToBootomOfLog();
	*/
	function scrollToBootomOfLog() {
		var height = 0;
		$('#console .log-info').each(function (i, value) {
			height += parseInt($(this).height());
		});
		height += '';
		$('#console').css({
			scrollTop: height
		});
	}
}

function hasSpace() {
	var expr = /\s/;
	return expr.test($('#user').val())
}

function notTyping() {
	isTyping = false;
}

function doPostMsg(e) {
	isTyping = $('#text-ip').val().length > 0;
	if (e.which === 13) {
		postThisMessage();
	}
}

$('#send-btn').click(postThisMessage);

function postThisMessage() {
	if($('.cht-img').length > 0) {
		sendImages();
	} else if ($('.text-area').html().length > 0) {
		postMessage();
		$CHAT_OPTS.addClass('h');
	}
}



function checkForNewDate(cM) {
	var fullCm = toStr(cM, DATE_OPTS.long);
	var div = null;
	if(lastMsgTime == 0) {
		div = getDateMarker(fullCm);
	} else {
		if(parseInt(toStr(cM, DATE_OPTS.date)) !=
			parseInt(toStr(lastMsgTime, DATE_OPTS.date))) {
			div = getDateMarker(fullCm);
		}
	}

	if(div) {
		$('#chat-box').append(div);
	}

	function getDateMarker(fullCm) {
		var parts = fullCm.split(',');
		return getMarkerForText(parts[1] + ',' + parts[2]);
	}

	function toStr(dt, opt) {
		return (new Date(parseInt(dt)))
					.toLocaleDateString('en-US', opt);
	}
}

function getMarkerForText(text) {
	return '<div class="msg-wrapper day"><div class="msg day day1">' + text + '</div></div>';
}

function getDatePart(date) {
	return parseInt(date.split(" ")[0].split("-")[2]);
}


function scrollToChatBoxBottom() {
	var height = 0;
	$('#chat-box div').each(function (i, value) {
		height += parseInt($(this).height());
	});
	height += 30;
	$('#chat-box').animate({
		scrollTop: '' + height
	}, 100);
}

function getFormattedTime(time) {
	time = time.split(" ")[1];
	var parts = time.split(":");
	var hr = parts[0] % 12;
	if (parseInt(parts[0]) % 12 == 0) {
		hr = 12;
	}
	var min = parts[1];
	hr = parseInt(hr) < 10 ? '0' + hr : hr;
	var a_p = parseInt(parts[0]) >= 12 ? 'pm' : 'am';
	return hr + ':' + min + ' ' + a_p;
}


function updateStatus(jsonObj) {
	//console.dir(jsonObj);
	hideTypeS();
	var i = 0;
	var oneName = '';
	var userCount = 0;
	var me = $('.user-details')[$('.user-details').length - 1];
	while (i < jsonObj.length) {
		var name = jsonObj[i].user;
		if ($('#usr-' + name).length === 1) {
			if (name != cuser()) {
				determineStatus(jsonObj[i]);
				$('#st-' + name).text(jsonObj[i].status);
				if (jsonObj[i].status.charAt(0) == 'T') {
					if (oneName == '') {
						oneName = jsonObj[i].fname.split(' ')[0];
					} else {
						userCount++;
					}
				}
			}
		} else {
			$(me).before(getUserTemplate(jsonObj[i]));
			$('#chat-box').append(getMarkerForText(name + ' joined'));
			scrollToChatBoxBottom();
		}
		i++;
	}
	if (oneName != '') {
		var msg = oneName;
		if (userCount > 0) {
			msg += ' and ' + userCount + ' other are ';
		} else {
			msg += ' is ';
		}
		showTypeS(msg + ' typing...');
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
	if (/^\d\d\d\d/.test(status)) {
		var st = new Date(status);
		var diff = (now.getTime() - st.getTime()) / 1000;
		var time = st.toLocaleString().split(',')[1].trim().replace(':00', '');
		if (diff < 60) {
			status = 'Online';
		} else {

			var dateDiff = now.getDate() - st.getDate();
			if (dateDiff == 0) {
				status = 'Last seen today at ' + time;
			} else if (dateDiff == 1) {
				status = 'Last seen yesterday at ' + time;
			} else {
				status = 'Last seen ' + st.toLocaleString().split(',')[0] + ', ' + time;
			}
		}
	}
	u.status = status ? status : 'Presense unknown';
}


function getMsgs() {
	$.ajax({
		method: 'get',
		url: window.location.pathname + '/gms',
		data: postStatus()
	}).done(function (data) {
		data = $.parseJSON(data);
		renderMsgs(data.msg);
		console.dir(data.status);
		updateStatus(data.status);
	});
}

function renderMsgs(msgs) {
	var i = 0;
	while (i <= msgs.length - 1) {
		if ($('#msg-' + msgs[i].time.$numberLong).length == 0) {
			checkForNewDate(msgs[i].time.$numberLong);
			$('#chat-box').append(getBubble(msgs[i]));
			lastMsgTime = msgs[i].time.$numberLong;
			scrollToChatBoxBottom();
		}
		i++;
	}
}


function getBubble(msg) {
	formatAtProp(msg);
	if (msg.by == cuser()) {
		return getOutgoingBubble(msg);
	} else {
		return getIncomingBubble(msg);
	}
}

const DATE_OPTS = {
	long: {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	},
	short: {
		hour: 'numeric',
		minute: 'numeric'
	},
	date: {
		day: 'numeric'
	}
}

function formatAtProp(msg) {
	var d = new Date(parseInt(msg.time.$numberLong));
	msg.fat = d.toLocaleDateString("en-US", DATE_OPTS.long);
	msg.at = d.toLocaleDateString("en-US", DATE_OPTS.short).split(', ')[1];
}

function getIncomingBubble(msg) {
	return getIText(msg);
}


function getIText(msg) {
	return '<div class="msg-wrapper incoming" id="msg-' + msg.time.$numberLong + '">' +
		'<div class="msg in">' +
		'<div class="msg-by-wrapper">' +
		'<span class="msg-by">' + msg.by + '</span></div>' +
		'<div class="main-msg">' + processMsg(msg) + '</div>' +
		'<div class="time-bar incoming">' +
		'<span class="time" title="' + msg.fat + '">' + msg.at + '</span>' +
		'</div></div></div>';
}


function getOutgoingBubble(msg) {
	return getOText(msg);
}


function getOText(msg) {
	return '<div class="msg-wrapper outgoing" id="msg-' + msg.time.$numberLong + '">' +
		'<div class="msg out">' +
		'<div class="main-msg">' + processMsg(msg) + '</div>' +
		'<div class="time-bar outgoing">' +
		'<span class="time"> ' + msg.at + '&nbsp;&nbsp;<span class="tick"><i class="fas fa-check"></i><span></span>' +
		'</div></div></div>';
}


function processMsg(msg) {
	var link = /(https?:\/\/[_%a-z0-9:&=\/?\.-]+)/ig;
	if (msg.type == 'text' && link.test(msg.msg)) {
		var matches = msg.msg.match(link);
		for(var i = 0; i < matches.length; i++) {
			var m = matches[i];
			if(!/(emojipedia-us.s3.amazonaws)|(i.imgur)|(i.giphy)/.test(m)) {
				msg.msg = msg.msg.replace(link,
					 `<a href="${m}" class="msg-link" target="_blank">${m}</a>`);
			}
		}
		//msg.msg = msg.msg.replace(link, '<a href="$1" class="msg-link">$1</a>');
	}
	return msg.msg;
}



function postStatus() {
	return {
		status: false,
		time: cT,
		user: cuser(),
		lmt: lastMsgTime
	};
}

function crn() {
	return window.location.pathname.replace('/chat/', '');
}

const DELIM = '-_-_-_-';

function postMessage() {
	sendMsg($('.text-area').html());
}

function sendMsg(msg) {
	var data = {
		msg: msg,
		by: cuser(),
		type: 'text',
		at: cT
	};
	var xyz = 'm' + crn() + DELIM + JSON.stringify(data);
	$('.text-area').html('');
	sendWSMsg(xyz);
}

function getTime() {
	//https://ipapi.co/json/
	$.ajax({
		method: 'get',
		url: 'https://api.ipgeolocation.io/ipgeo?apiKey=9c19f884bafd4dd281381936964a6982',
	}).done(function (msg) {
		cT = msg.time_zone.current_time.substr(0, 16);
		if (stD == 0) {
			startDate = cT;
			stD++;
			setInterval(clock, 60 * 1000);
		}
		getMsgs();
		doConnectViaWS();

	});
}

function clock() {
	var parts = cT.split(" ")[1].split(":");
	var hr = parts[0];
	var min = parts[1];
	var needed = true;
	min++;
	hr = parseInt(hr);
	if (min == 60) {
		min = 0;
		hr++;
		if (hr == 24) {
			hr = 0;
			getTime();
			needed = false;
		}
	}
	if (needed) {
		cT = cT.split(" ")[0] + ' ' + (hr > 9 ? hr : '0' + hr) + ':' + (min > 9 ? min : '0' + min);
	}
}


$('#user-butt').click(function () {
	//$('#mem-list').toggleClass('mem-list-class-phn');
	if ($('#cc').html().length === 0) {
		$('#cc').html($('#mem-list').html());
		$('#cc').show('slide', 600);
		$('#user-butt').css('color', '#3c3c3c');
		$('#user-butt').css('background-color', 'rgba(248, 205, 85, 1)');
		$('#user-butt').css('border', '1px solid rgba(248, 205, 85, 1)');
		$('body').css('overflow', 'hidden');
		//$('#cc').css('position', 'fixed');

	} else {
		$('#cc').html('');
		$('#cc').hide('drop', 600);
		$('#user-butt').css('background-color', '#3c3c3c');
		$('#user-butt').css('color', 'rgba(248, 205, 85, 1)');
		$('#user-butt').css('border', '1px solid gray');
		//$('#cc').css('position', 'absolute');
		$('body').css('overflow-y', 'auto');
	}
});








$('#login-btn').on('click', function () {
	var $btn = $(this);
	$btn.addClass(DISABLED);
	toast('Loging in...');
	$.ajax({
		method: "post",
		url: "login",
		data: $('form').serialize(),
		success: function (data) {
			if (data != 'null') {
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
	$(arr).each(function (i, obj) {
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


$('#signup-btn').on('click', function () {
	var $butt = $(this);
	var u = formToJSON($butt.attr('data-form'));
	if (valid(u)) {
		$butt.addClass(DISABLED);
		toast('Signing up...');
		$.ajax({
			url: 'me-signup',
			method: 'post',
			data: {
				name: u.fullname,
				user: u.username,
				pass: u.pass
			},
			success: function (data) {
				if (data == 'null') {
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
			error: function () {

			}
		});
	}

	function valid(json) {
		var v = true;
		var msg;
		Object.keys(json).forEach(function (key) {
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
	$toast.css({
		'display': 'inline-block'
	});
	setToastText(msg);
}

function setToastText(msg) {
	$toast.html(msg);
}

function hideToast() {
	$toast.hide();
}

$('.close').on('click', function () {
	$modal.hide();
});

$('#new-cr-btn').on('click', function () {
	$('.modal-form').hide();
	$('#new-cr-form').show();
	$modal.show();

});

$('#join-cr-btn').on('click', function () {
	$('.modal-form').hide();
	$('#join-cr-form').show();
	$modal.show();
});


$('#new-cr-from-btn').on('click', function () {
	var $btn = $(this);
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

	if (cr.name.length > 0) {
		$('#new-cr-err').text('');
		$btn.addClass(DISABLED);
		$.ajax({
			url: cuser() + '/create-cr',
			method: 'post',
			data: {
				cr: JSON.stringify(cr)
			},
			success: function (data) {
				if (data != 'un-auth') {
					if (data == 'e') {
						$('#new-cr-err').text('Chat Room name is already taken.');
						$btn.removeClass(DISABLED);
					} else {
						window.location.assign('/chat/' + cr.slug);
					}
				}
			},
			error: function () {

			}
		});
	}

});


$('#join-cr-form-btn').on('click', function () {
	var $btn = $(this);
	
	var cr = toSlug($('#jcr-name').val());
	var obj = {
		user: cuser(),
		status: '',
		fname: fname()
	};
	if(cr.length == 0) {return;}
	$btn.addClass(DISABLED);
	$('#join-cr-err').text('');
	$.ajax({
		url: cuser() + '/join-cr',
		method: 'post',
		data: {
			cr: cr,
			u: JSON.stringify(obj)
		},
		success: function (data) {
			if (data == 'true') {
				window.location.assign('/chat/' + cr);
			} else {
				$btn.removeClass(DISABLED);
				$('#join-cr-err').text('Chat Room doesn\'t exist.');
			}
		},
		error: function () {

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
		url: cuser() + '/all-chat',
		method: 'get',
		success: function (data) {
			hideToast();
			var json = $.parseJSON(data);
			var total = renderChats(json, '0') + renderChats(json, '1')
			if(total == 0) {
				$('#no-cr-found').show();
			}
			$('.cr').on('click', function () {
				window.location.assign('/chat/' + $(this).attr('data-slug'));
			});
		},
		error: function () {

		}
	});

}


function renderChats(json, no) {
	var $list = $('#cr-list-' + no);
	json[no].forEach(function (cr) {
		$list.append(renderChat(cr));
	});
	if (json[no].length == 0) {
		$('#cr-list-' + no + '-p').hide();
	}

	return json[no].length;

	function renderChat(cr) {
		cr.cd = toDate(cr._cd);
		cr.mem = toMemStatus(cr.users);
		var templ = `
			<div class="cr w3-col s12 m6 l4" data-slug="${cr.slug}">
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
	if (users.length < 3) {
		if (users.length === 1) {
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
	return date.toDateString();
	F
}


function initChatRoom() {
	$.get(window.location.pathname + '/init', function (res) {
		var data = $.parseJSON(res);
		$('#chat-box-header').text(data.name);
		showUsers(data.users, data.creator);
		getTime();
	});

}

function showUsers(users, creator) {
	var me = addMe(creator);
	users.forEach(function (u) {
		if (u.user != window.localStorage.getItem('user')) {
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


var $CHAT_OPTS = $('#chat-options');
const EMO_URL = 'https://emojipedia-us.s3.amazonaws.com/thumbs/72/whatsapp/116/';

$('#emo-btn').on('click', function () {
	addEmos();
	showHideCO();
	selectThisTab($('#emoji-tab-btn'));
});

function showHideCO() {
	$CHAT_OPTS.toggleClass('h');
	$('#co-footer').show();
}

$('#image-btn').on('click', function () {
	$('#img').click();
});


$('#img').on('change', function() {
	var files = document.getElementById('img').files;
	if(files) {
		var $body = $('#co-body').html('');
		$CHAT_OPTS.removeClass('h');
		$('#co-footer').hide();
		$('#co-hdr-txt').text('Share Image');
		for(var i = 0; i < files.length; i++) {
			var rdr = new FileReader();
			rdr.onload = (function(imgAt) {
				return function(e) {
					$body.append(`
						<div class="cht-img">
							<div class="img-del-btn" id="idel-${imgAt}">
								<i class="fas fa-trash"></i>
							</div>
							<div class="ldr" id="ildr-${imgAt}"><i class="fas fa-spinner"></i></div>
							<img src="${e.target.result}" id="i-${imgAt}" class="c-i-i">
						</div>
					`);

					var fd = new FormData();
					fd.append('image', files[imgAt]);
					
					(function(imgAt) {
						IMGUR.post('https://api.imgur.com/3/image', fd, function (res) {
							if (res.success) {
								$('#i-' + imgAt).attr('src', res.data.link);
								$('#ildr-' + imgAt).remove();
								$('#idel-' + imgAt).show();
							}
						});
					})(imgAt);
					
				};
			})(i);
			
			rdr.readAsDataURL(files[i]);
			
		}
		
	}
});

function sendImages() {
	$('.c-i-i').each(function(i, img) {
		var msg = '<div class="msg-img"><img src="' + $(img).attr('src') + '">' + 
					'</div><div>' + $('.text-area').html() + '</div>';
		sendMsg(msg);
	});
	showHideCO();
	document.getElementById('img').value = '';
	$('.cht-img').remove();
}

$('#co-body').on('click', '.img-del-btn', function() {
	$(this).parent().remove();
	if($('.cht-img').length == 0) {
		showHideCO();
		document.getElementById('img').value = ''
	}
});


function addEmos() {
	var $body = $('#co-body').html('');
	emoList.forEach(function (e) {
		$body.append(`
			<div class="emo" data-emo="${e}">
				<img src="${EMO_URL}${e}">
			</div>
		`);
	});
}

var IMGUR = new Imgur({
	clientid: 'ccee0475bded108'
});


$('#emoji-tab-btn').on('click', function() {
	addEmos();
	selectThisTab($(this));
});

$('#gif-tab-btn').on('click', function() {
	addGif();
	selectThisTab($(this));
});


$('#sticker-tab-btn').on('click', function() {
	addSticker();
	selectThisTab($(this));
});

function selectThisTab(tab) {
	var cls = 'cf-o-sel';
	$('.cf-o').removeClass(cls);
	tab.addClass(cls);
	$('#co-hdr-txt').text(tab.text());
}

//

var GES_DATA = {
	gif: null,
	sticker: null
}


function addGif() {
	if(!GES_DATA.gif) {
		var urls = [];
		$('#co-body').html('working...');
		$.get('https://api.giphy.com/v1/gifs/trending?' + 
				'api_key=EBWLu12HNKXszbvnjYV0tUqVnapD2jrh&limit=25&rating=G', function(gifs) {
			gifs.data.forEach(function(d) {
				urls.push(d.images.fixed_width.url.replace(/media\d/, 'i'));
			});
			GES_DATA.gif = urls;
			showImgInCoBody(GES_DATA.gif, 'gif');
		});
	} else {
		showImgInCoBody(GES_DATA.gif, 'gif');
	}
	
	
	
}

function showImgInCoBody(arr, what) {
	var $body = $('#co-body').html('');
	arr.forEach(function (e) {
		$body.append(`
			<div class="co-body-img ${what}">
				<img src="${e}">
			</div>
		`);
	});
}

function addSticker() {
	if(!GES_DATA.sticker) {
		var urls = [];
		$('#co-body').html('working...');
		$.get('https://api.giphy.com/v1/stickers/trending?api_key=' + 
					'EBWLu12HNKXszbvnjYV0tUqVnapD2jrh&limit=25&rating=G', function(gifs) {
			gifs.data.forEach(function(d) {
				urls.push(d.images.fixed_width.url.replace(/media\d/, 'i'));
			});
			GES_DATA.sticker = urls;
			showImgInCoBody(GES_DATA.sticker, 'sticker');
		});
	} else {
		showImgInCoBody(GES_DATA.sticker, 'sticker');
	}
	
}


$('#co-body').on('click', '.emo', function() {
	var url = $(this).attr('data-emo');
	$('.text-area').html($('.text-area').html() + 
		`&nbsp; <div class="text-emo">
					<img src="${EMO_URL}${url}" class="emo-text">
			    </div>&nbsp;`);
});


$('#co-body').on('click', '.gif', function() {
	sendPhotoMsg(this);
});

$('#co-body').on('click', '.sticker', function() {
	sendPhotoMsg(this);
});

function sendPhotoMsg(img) {
	var msg = '<div class="msg-img">' + $(img).html() + 
			 '</div><div>' + $('.text-area').html() + '</div>';
	sendMsg(msg)
	showHideCO();

}

$('#chat-box').on('click', '.msg-img', function() {
	var src = $(this).find('img').attr('src');
	$('#img-viewer').html('<img class="" src="' + src + '">').show();
	$modal.show();

});

var charCounter = 0;
var lastCharTyped;
var keyStrokeTimer;
var intervalsPassed;

$('.text-area').on('keyup', function () {
	if (keyStrokeTimer) {
		clearInterval(keyStrokeTimer);
	}
	charCounter++;
	lastCharTyped = (new Date()).getTime();
	intervalsPassed = 0;
	keyStrokeTimer = setInterval(keyStrokeListner, 1000);
	if (charCounter == 7) {
		sendWSMsg('s' + crn() + DELIM + 'Typing...' + DELIM + cuser());
		charCounter = 0;
	}

	function keyStrokeListner() {
		intervalsPassed++;
		if (intervalsPassed > 4) {
			postStatusAsNotTyping();
			clearInterval(keyStrokeTimer);
		}
	}
});



$('.text-area').on('blur', function () {
	postStatusAsNotTyping();
});

function postStatusAsNotTyping() {
	sendWSMsg('s' + crn() + DELIM + cT + DELIM + cuser());
}



$('#co-cls-btn').on('click', showHideCO);

var emojis = {
	emo: [
		'grin', 'dizzy', 'flushed', 'frown', 'frown-open',
		'grimace', 'angry', 'grin-alt', 'grin-beam', 'grin-beam-sweat',
		'grin-hearts', 'grin-squint', 'grin-squint-tears',
		'grin-stars', 'grin-tears', 'grin-tongue', 'grin-tongue-squint',
		'grin-tongue-wink', 'grin-wink', 'kiss', 'kiss-beam',
		'kiss-wink-heart', 'laugh', 'laugh-beam', 'laugh-squint',
		'laugh-wink', 'meh', 'meh-blank', 'meh-rolling-eyes',
		'sad-cry', 'sad-tear', 'smile', 'smile-beam', 'smile-wink',
		'surprise', 'tired'
	]
};


// https://api.giphy.com/v1/gifs/trending?api_key=EBWLu12HNKXszbvnjYV0tUqVnapD2jrh&limit=25&rating=G
// https://api.giphy.com/v1/stickers/trending?api_key=EBWLu12HNKXszbvnjYV0tUqVnapD2jrh&limit=25&rating=G


/********
 * Web Socket Code
 * 
 */

var ws;

function doConnectViaWS() {
	var wsUrl = window.location.origin.replace('http', 'ws');

	ws = new WebSocket(wsUrl + '/chat');

	ws.onopen = function () {
		ws.send('i' + crn() + '=' + window.localStorage.user);
	};

	ws.onmessage = function (event) {
		var data = event.data;
		var what = data.charAt(0);
		data = data.substr(1);
		switch (what) {
			case 'm':
				if (data != 'NULL') {
					renderMsgs($.parseJSON('[' + data + ']'));
				}
				break;
			case 's':
				updateStatus($.parseJSON(data));
				break;
		}
	};

	ws.onclose = function () {
		console.log('connection closed');
		doConnectViaWS();
	};

	ws.onerror = function () {

	};
}

function sendWSMsg(msg) {
	try {
		ws.send(msg);
	} catch (error) {
		alert(error);
	}
}




/**
 * EMO
 * 
 */

var emoList = [
	"grinning-face_1f600.png",
	"grinning-face-with-smiling-eyes_1f601.png",
	"face-with-tears-of-joy_1f602.png",
	"rolling-on-the-floor-laughing_1f923.png",
	"smiling-face-with-open-mouth_1f603.png",
	"smiling-face-with-open-mouth-and-smiling-eyes_1f604.png",
	"smiling-face-with-open-mouth-and-cold-sweat_1f605.png",
	"smiling-face-with-open-mouth-and-tightly-closed-eyes_1f606.png",
	"winking-face_1f609.png",
	"smiling-face-with-smiling-eyes_1f60a.png",
	"face-savouring-delicious-food_1f60b.png",
	"smiling-face-with-sunglasses_1f60e.png",
	"smiling-face-with-heart-shaped-eyes_1f60d.png",
	"face-throwing-a-kiss_1f618.png",
	"kissing-face_1f617.png",
	"kissing-face-with-smiling-eyes_1f619.png",
	"kissing-face-with-closed-eyes_1f61a.png",
	"white-smiling-face_263a.png",
	"slightly-smiling-face_1f642.png",
	"hugging-face_1f917.png",
	"grinning-face-with-star-eyes_1f929.png",
	"thinking-face_1f914.png",
	"face-with-one-eyebrow-raised_1f928.png",
	"neutral-face_1f610.png",
	"expressionless-face_1f611.png",
	"face-without-mouth_1f636.png",
	"face-with-rolling-eyes_1f644.png",
	"smirking-face_1f60f.png",
	"persevering-face_1f623.png",
	"disappointed-but-relieved-face_1f625.png",
	"face-with-open-mouth_1f62e.png",
	"zipper-mouth-face_1f910.png",
	"hushed-face_1f62f.png",
	"sleepy-face_1f62a.png",
	"tired-face_1f62b.png",
	"sleeping-face_1f634.png",
	"relieved-face_1f60c.png",
	"face-with-stuck-out-tongue_1f61b.png",
	"face-with-stuck-out-tongue-and-winking-eye_1f61c.png",
	"face-with-stuck-out-tongue-and-tightly-closed-eyes_1f61d.png",
	"drooling-face_1f924.png",
	"unamused-face_1f612.png",
	"face-with-cold-sweat_1f613.png",
	"pensive-face_1f614.png",
	"confused-face_1f615.png",
	"upside-down-face_1f643.png",
	"money-mouth-face_1f911.png",
	"astonished-face_1f632.png",
	"white-frowning-face_2639.png",
	"slightly-frowning-face_1f641.png",
	"confounded-face_1f616.png",
	"disappointed-face_1f61e.png",
	"worried-face_1f61f.png",
	"face-with-look-of-triumph_1f624.png",
	"crying-face_1f622.png",
	"loudly-crying-face_1f62d.png",
	"frowning-face-with-open-mouth_1f626.png",
	"anguished-face_1f627.png",
	"fearful-face_1f628.png",
	"weary-face_1f629.png",
	"shocked-face-with-exploding-head_1f92f.png",
	"grimacing-face_1f62c.png",
	"face-with-open-mouth-and-cold-sweat_1f630.png",
	"face-screaming-in-fear_1f631.png",
	"flushed-face_1f633.png",
	"grinning-face-with-one-large-and-one-small-eye_1f92a.png",
	"dizzy-face_1f635.png",
	"pouting-face_1f621.png",
	"angry-face_1f620.png",
	"serious-face-with-symbols-covering-mouth_1f92c.png",
	"face-with-medical-mask_1f637.png",
	"face-with-thermometer_1f912.png",
	"face-with-head-bandage_1f915.png",
	"nauseated-face_1f922.png",
	"face-with-open-mouth-vomiting_1f92e.png",
	"sneezing-face_1f927.png",
	"smiling-face-with-halo_1f607.png",
	"face-with-cowboy-hat_1f920.png",
	"clown-face_1f921.png",
	"lying-face_1f925.png",
	"face-with-finger-covering-closed-lips_1f92b.png",
	"smiling-face-with-smiling-eyes-and-hand-covering-mouth_1f92d.png",
	"face-with-monocle_1f9d0.png",
	"nerd-face_1f913.png",
	"smiling-face-with-horns_1f608.png",
	"imp_1f47f.png",
	"japanese-ogre_1f479.png",
	"japanese-goblin_1f47a.png",
	"skull_1f480.png",
	"skull-and-crossbones_2620.png",
	"ghost_1f47b.png",
	"extraterrestrial-alien_1f47d.png",
	"alien-monster_1f47e.png",
	"robot-face_1f916.png",
	"pile-of-poo_1f4a9.png",
	"smiling-cat-face-with-open-mouth_1f63a.png",
	"grinning-cat-face-with-smiling-eyes_1f638.png",
	"cat-face-with-tears-of-joy_1f639.png",
	"smiling-cat-face-with-heart-shaped-eyes_1f63b.png",
	"cat-face-with-wry-smile_1f63c.png",
	"kissing-cat-face-with-closed-eyes_1f63d.png",
	"weary-cat-face_1f640.png",
	"crying-cat-face_1f63f.png",
	"pouting-cat-face_1f63e.png",
	"see-no-evil-monkey_1f648.png",
	"hear-no-evil-monkey_1f649.png",
	"emoji-modifier-fitzpatrick-type-1-2_1f3fb.png",
	"baby_emoji-modifier-fitzpatrick-type-1-2_1f476-1f3fb_1f3fb.png",
	"child_emoji-modifier-fitzpatrick-type-1-2_1f9d2-1f3fb_1f3fb.png",
	"boy_emoji-modifier-fitzpatrick-type-1-2_1f466-1f3fb_1f3fb.png",
	"girl_emoji-modifier-fitzpatrick-type-1-2_1f467-1f3fb_1f3fb.png",
	"adult_emoji-modifier-fitzpatrick-type-1-2_1f9d1-1f3fb_1f3fb.png",
	"man_emoji-modifier-fitzpatrick-type-1-2_1f468-1f3fb_1f3fb.png",
	"woman_emoji-modifier-fitzpatrick-type-1-2_1f469-1f3fb_1f3fb.png",
	"older-adult_emoji-modifier-fitzpatrick-type-1-2_1f9d3-1f3fb_1f3fb.png",
	"older-man_emoji-modifier-fitzpatrick-type-1-2_1f474-1f3fb_1f3fb.png",
	"older-woman_emoji-modifier-fitzpatrick-type-1-2_1f475-1f3fb_1f3fb.png",
	"male-health-worker-type-1-2_1f468-1f3fb-200d-2695-fe0f.png",
	"female-health-worker-type-1-2_1f469-1f3fb-200d-2695-fe0f.png",
	"male-student-type-1-2_1f468-1f3fb-200d-1f393.png",
	"female-student-type-1-2_1f469-1f3fb-200d-1f393.png",
	"male-teacher-type-1-2_1f468-1f3fb-200d-1f3eb.png",
	"female-teacher-type-1-2_1f469-1f3fb-200d-1f3eb.png",
	"male-judge-type-1-2_1f468-1f3fb-200d-2696-fe0f.png",
	"female-judge-type-1-2_1f469-1f3fb-200d-2696-fe0f.png",
	"male-farmer-type-1-2_1f468-1f3fb-200d-1f33e.png",
	"female-farmer-type-1-2_1f469-1f3fb-200d-1f33e.png",
	"male-cook-type-1-2_1f468-1f3fb-200d-1f373.png",
	"female-cook-type-1-2_1f469-1f3fb-200d-1f373.png",
	"male-mechanic-type-1-2_1f468-1f3fb-200d-1f527.png",
	"female-mechanic-type-1-2_1f469-1f3fb-200d-1f527.png",
	"male-factory-worker-type-1-2_1f468-1f3fb-200d-1f3ed.png",
	"female-factory-worker-type-1-2_1f469-1f3fb-200d-1f3ed.png",
	"male-office-worker-type-1-2_1f468-1f3fb-200d-1f4bc.png",
	"female-office-worker-type-1-2_1f469-1f3fb-200d-1f4bc.png",
	"male-scientist-type-1-2_1f468-1f3fb-200d-1f52c.png",
	"female-scientist-type-1-2_1f469-1f3fb-200d-1f52c.png",
	"male-technologist-type-1-2_1f468-1f3fb-200d-1f4bb.png"
];