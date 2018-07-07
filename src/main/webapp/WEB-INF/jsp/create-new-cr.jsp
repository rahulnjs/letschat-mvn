<%@include file="common_h.jspf" %>
<body  style="overflow-x: hidden;">
	<div id="header">
		<%@include file="header.jspf"%>
	</div>
	<div id="wrapper">
		<div id="content">
			<div id="cont">
				<span class="label">Chat Room is created. Chat Room ID is: <span
					id="chat-room-id"></span></span> <br>
				<br> <a class="butt link" href="#" id="cont-butt">Continue</a>
			</div>
			<div id="all">
			<div id="page-text">
				<span class="label">Create a new chat room and chat with your
					cool groups.</span>

			</div>
			<div id="strt-frm" style="margin-top: 5%;">
				<form onsubmit="return false;" id="create-chat-frm">
					<table cellpadding="5" class="frm-tab">
						<tr>
							<td style="text-align: center;">
								<span class="error" id="err-txt"></span>
							</td>
						</tr>
						<tr>
							<td><span class="label">Your Nick Name</span></td>
						</tr>
						<tr>
							<td><input type="text" name="u-name" class="ip-field" id="user">
							</td>
						</tr>
						<tr>
							<td><span class="label">Chat Room Name</span></td>
						</tr>
						<tr>
							<td><input type="text" name="chat-room-name"
								class="ip-field" id="c-r-name"></td>
						</tr>

						<tr>
							<td style="text-align: center;"><br>
								<button class="butt" id="create-chat-button">Let's Chat</button>
							</td>
						</tr>
					</table>
				</form>
			</div>
			</div>
		</div>
		<div id="footer" style="color: #3c3c3c; text-shadow: 1px .3px 1px black; margin-top: 2%; text-align: center;">
			Copyright &copy; 2016, All Rights Reserved.
		</div>
	</div>
	<script
		src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
	
	<script
		src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
	<script src="/resources/js/script.js"></script>
	<script type="text/javascript">
		$('#user-butt').remove();
	</script>
</body>
</html>