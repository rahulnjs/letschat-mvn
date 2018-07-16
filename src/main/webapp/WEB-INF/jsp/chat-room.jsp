<%@include file="common_h.jspf" %>
<body style="overflow-x: hidden;">
	<%@include file="header.jspf" %>
	<div id="cc"></div>
	<div id="wrapper">
		<span id="pid">crp</span>
		<div id="content">
			<div id="container">
				<div id="msg-opts">
				</div>
				<div id="chat-box-header"
					style="text-align: center; font-family: 'Chewy', cursive; min-height: 35px; padding: 3px 0px 1px 5px; font-size: x-large; font-weight: 600px; text-shadow: 1px 1px 1px gray; color: black; display: inline-grid;">
					
				</div>
				<div id="mem-list" class="mem-list-class">
				</div>
				<div id="chat-box-wrapper">

					<div id="chat-box"></div>
					<div id="sender">
						<div id="chat-options">
							<div id="co-hdr">
								<div id="co-hdr-txt">
									Chat Options	
								</div>
								<div id="co-cls-btn">
									&times;
								</div>
							</div>
							<div id="co-body">
							</div>
							<div id="co-footer">
								<div class="row">
									<div class="c3">
										emoji
									</div>
									<div class="c3" id="sticker-tab-btn">
										sticker
									</div>
									<div class="c3" id="gif-tab-btn">
										gif
									</div>
								</div>
							</div>
						</div>
						<div id="status-bar" >
							<div>
								<i class="fas fa-comment-alt"></i>&nbsp; 
								<span id="type-stat"></span>
							</div>
						</div>
						<div class="sndr-body">
							<div class="emo-btn" id="emo-btn">
								<i class="far fa-smile"></i>
							</div>
							<div class="text-area" contenteditable="true" placeholder="Start typing..."></div>
							<div class="image-btn" id="image-btn">
								<i class="fas fa-image"></i>
							</div>
							<div class="send-btn" id="send-btn">
								<i class="fas fa-location-arrow"></i>
							</div>
							<div class="more-opt-btn">
								<i class="fas fa-ellipsis-h"></i>
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