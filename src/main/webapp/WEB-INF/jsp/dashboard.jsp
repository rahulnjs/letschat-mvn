<%@include file="common_h.jspf" %>
<body  style="overflow-x: hidden;">
	<div id="header">
		<%@include file="header.jspf" %>
	</div>
	<div id="wrapper">
		<span id="pid">dbrd</span>
		<div id="content">
			<div class="user-opts">
				<ul>
					<li id="new-cr-btn"><i class="fas fa-plus"></i> New</li>
					<li id="join-cr-btn"><i class="fas fa-sign-in-alt"></i> Join</li>
				</ul>
			</div>	
			
			<div class="cr-list" id="cr-list-0-p">
				<header class="label">
					Chat Rooms you created,
				</header>
				<section id="cr-list-0" class="cl">
					
				</section>
			</div>	
			
			<div class="cr-list"  id="cr-list-1-p">
				<header class="label">
					Chat Rooms you are part of,
				</header>
				<section id="cr-list-1"  class="cl">
				
				</section>
			</div>	
		</div>
		<%@include file="footer.jspf" %>
	</div>
</body>
