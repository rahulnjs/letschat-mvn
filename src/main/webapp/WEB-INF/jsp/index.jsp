<%@include file="common_h.jspf" %>
<body  style="overflow-x: hidden;">
	<%@include file="header.jspf" %>
	<div id="wrapper">
		<div id="content">
			<div id="strt-frm">
				
				<!--<form action="" id="img-upl">
					<input type="file" name="image" id="img">
					<span id="upload-btn">upload</span>
				</form>-->
				<form onsubmit="return false;" id="login-form">
					<table cellpadding="5" class="frm-tab">
						<tr>
							<td style="text-align: center; height: 30px;">
								<span class="error" id="err-txt"></span>
							</td>
						</tr>
						<tr>
							<td>
								<span class="label">Username</span>
							</td>
						</tr>
						<tr>
							<td>
								<input type="text" name="un" class="ip-field" id="user" autocomplete="off">
							</td>
						</tr>
						<tr>
							<td>
								<span class="label">Password</span>
							</td>
						</tr>
						<tr>
							<td>
								<input type="password" name="pass" class="ip-field" id="cid" autocomplete="off">
							</td>
						</tr>
						<tr>
							<td style="text-align: center;">
								<br>
								<button class="butt" id="login-btn" data-form="login-form">Login</button>
							</td>
						</tr>
						<tr>
							<td style="text-align: center;">
								<br>
								<a href="/signup" class="log-sin-btn">Sign Up</a>
							</td>
						</tr>
					</table>
					</form>
			</div>
		</div>
		<%@include file="footer.jspf" %>
	</div>
</body>
</html>