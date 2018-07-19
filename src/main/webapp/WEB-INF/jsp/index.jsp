<%@include file="common_h.jspf" %>
<body  style="overflow-x: hidden;">
	<%@include file="header.jspf" %>
	<div id="wrapper">
		<div id="content">
			<div id="strt-frm">
				<form onsubmit="return false;" id="login-form">
					<div class="form w3-row">
						<div class="w3-col m7 s12">
							<div style="padding-top: 26%; height: 2px;" class="w3-hide-small">
							</div>
							<div class="banner-txt">
								Talk to anyone without 
								sharing any of your personal details!
							</div>
						</div>
						<div class="w3-col m5 s12">
							<div class="frm-element" style="text-align: center; height: 30px;">
								<span class="error" id="err-txt"></span>
							</div>

							<div class="frm-element">
								<span class="label">Username</span>	
							</div>

							<div class="frm-element  w3-cols12">
								<input type="text" name="un" class="ip-field" id="user" autocomplete="off">
							</div>

							<div class="frm-element">
								<span class="label">Password</span>	
							</div>

							<div class="frm-element">
								<input type="password" name="pass" class="ip-field" id="cid" autocomplete="off">
							</div>

							<div class="frm-element">
								<br>
								<button class="butt" id="login-btn" data-form="login-form">Login</button>
							</div>

							<div class="frm-element c" style="margin-top: 17px;">
								<br>
								<a href="/signup" class="log-sin-btn">Sign Up</a>	
							</div>
						</div>
						
					</div>
				</form>
			</div>
		</div>
		<%@include file="footer.jspf" %>
	</div>
</body>
</html>