<%@include file="common_h.jspf" %>
<body  style="overflow-x: hidden;">
	<div id="header">
		<%@include file="header.jspf" %>
	</div>
	<div id="wrapper">
		<div id="content">
			<div id="strt-frm">
				<div class="label abt-page">Sign up to get started</div>
				
				<form onsubmit="return false;" id="signup-form">
					<table cellpadding="5" class="frm-tab">
						<tr>
							<td style="text-align: center;">
								<span class="error" id="err-txt"></span>
							</td>
						</tr>
						<tr>
							<td>
								<span class="label">Name</span>
							</td>
						</tr>
						<tr>
							<td>
								<input type="text" name="fullname" class="ip-field" autocomplete="off">
							</td>
						</tr>
						<tr>
							<td>
								<span class="label">Username</span>
							</td>
						</tr>
						<tr>
							<td>
								<input type="text" name="username" class="ip-field" autocomplete="off">
							</td>
						</tr>
						<tr>
							<td>
								<span class="label">Password</span>
							</td>
						</tr>
						<tr>
							<td>
								<input type="password" name="pass" class="ip-field" id="pass" autocomplete="off">
							</td>
						</tr>
						<tr>
							<td>
								<span class="label">Confirm Password</span>
							</td>
						</tr>
						<tr>
							<td>
								<input type="password" name="cpass" class="ip-field" id="cpass" autocomplete="off">
							</td>
						</tr>
						<tr>
							<td style="text-align: center;">
								<br>
								<button class="butt" id="signup-btn" data-form="#signup-form">Let's Get Started</button>
							</td>
						</tr>
						<tr>
							<td style="text-align: center;">
								<br>
								<a href="/">login</a>
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