<%@include file="common_h.jspf" %>
<body onload="geoFindMe()" style="overflow-x: hidden;">
	<div id="header">
		<%@include file="header.jspf" %>
	</div>
	<div id="cc"></div>
	<div id="wrapper">
		<span id="chat-data" style="display:none;">${cr}</span>
		<span id="pid">crp</span>
		<div id="content">
			<div id="container">
				<div id="chat-box-header"
					style="text-align: center; font-family: 'Chewy', cursive; min-height: 35px; padding: 3px 0px 1px 5px; font-size: x-large; font-weight: 600px; text-shadow: 1px 1px 1px gray; color: black; display: inline-grid;">
					
				</div>
				<div id="mem-list" class="mem-list-class">
				</div>
				<div id="chat-box-wrapper">

					<div id="chat-box"
						style="overflow-y: auto; background-image: url('/resources/image/chat-bg.jpg'); width: 100%; height: 70%; /*background-color: red;*/ min-height: 370px; max-height: 370px; box-shadow: inset 0px 1px 10px 0px #ccc;">
						<%--
						<chat:msg-viewer>
							<c:if test="${dbNeeded}">
								<div class="msg-wrapper day">
									<div class="msg day day1">${date}</div>
								</div>
							</c:if>
							<div class="msg-wrapper ${align}">
								<div class="msg ${color}">
									<c:if test="${show}">
										<div class="msg-by-wrapper">
											<span class="msg-by"> ${msgBy} </span>
										</div>
									</c:if>
									<div class="main-msg">${msg}</div>
									<div class="time-bar ${align}">
										<span class="time"> ${at} <c:if test="${!show}">
											&nbsp; &nbsp; &#10004;
										</c:if>

										</span>
									</div>
								</div>
							</div>
						</chat:msg-viewer>
						 --%>
					</div>
					<div id="sender"
						style="box-sizing: border-box; background-color: yellow; position:relative; width: 100%; height: 30%; border-left: 1px solid #ccc;">
						<div id="status-bar" >
							<div>
								<i class="fas fa-comment-alt"></i>&nbsp; 
								<span id="type-stat"></span>
							</div>
						</div>
						<div
							style="width: 85%; padding: 4px 0px 0px 3px; box-sizing: border-box; min-height: 78px; max-height: 78px; float: left;">
							<textarea onblur="notTyping()"
								placeholder="Type your message here..." spellcheck="false"
								id="text-ip" onkeyup="doPostMsg(event)"
								style="color: black; font-family: 'Open Sans', sans-serif; border-radius: 5px; box-shadow: inset 0px 0px 10px 0px #ccc; font-size: small; font-weight: 600; min-height: 66px; max-height: 66px; min-width: 98%; max-width: 98%; border: 1px solid #ccc;"></textarea>
						</div>
						<div id="send-butt-wrapper" onclick="postThisMessage()">
							<div id="send-butt">
								<i class="fa fa-paper-plane"></i>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
		<div id="console">
		
		</div>
		<%@include file="footer.jspf" %>
	</div>
</body>
</html>