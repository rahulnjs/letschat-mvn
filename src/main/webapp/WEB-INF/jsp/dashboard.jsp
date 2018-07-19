<%@include file="common_h.jspf" %>
<body  style="overflow-x: hidden;">
	<%@include file="header.jspf" %>
	<div id="wrapper">
		<span id="pid">dbrd</span>
		<div id="content">
			<div class="user-opts">
				<ul>
					<li id="new-cr-btn"><i class="fas fa-plus"></i> New</li>
					<li id="join-cr-btn"><i class="fas fa-sign-in-alt"></i> Join</li>
				</ul>
			</div>	

			<div id="no-cr-found" style="padding-top: 5%; display:none; text-align: center;" class="banner-txt">
				<div style="margin: 0px auto; width: 260px; opacity: .5">
					<img src="https://png.icons8.com/doodle/500/000000/topic.png" style="width:100%">
				</div>
				<div style="margin-top: 15px; padding: 10px;">
					You are not part of any chat rooms, Join or Create chat rooms.
				</div>
			</div>
			
			<div class="cr-list" id="cr-list-0-p">
				<header class="label">
					Chat Rooms you created,
				</header>
				<section id="cr-list-0" class="cl w3-row">
					
				</section>
			</div>	
			
			<div class="cr-list"  id="cr-list-1-p">
				<header class="label">
					Chat Rooms you are part of,
				</header>
				<section id="cr-list-1"  class="cl w3-row">
				
				</section>
			</div>	
		</div>
		<%@include file="footer.jspf" %>
	</div>
</body>
