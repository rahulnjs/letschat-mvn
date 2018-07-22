package com.chat.controller.ws;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.chat.component.Worker;

@Configuration
@EnableWebSocket
@Controller
public class WebSocketConfig implements WebSocketConfigurer { 

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(new EchoHandler(), "/chat").setAllowedOrigins("*");
	}
	
	class EchoHandler extends TextWebSocketHandler {
		
		private Map<String, List<WebSocketSession>> users = new HashMap<>();
		
		private Map<String, String> userChatRoom = new HashMap<>();
		
		private Map<String, String> suMap = new HashMap<>();
		
		Worker worker = new Worker();
		
		private static final String DELIM = "-_-_-_-";
		
		@Override
		public void afterConnectionClosed(WebSocketSession session,
				CloseStatus status) {
			String id = session.getId();
			List<WebSocketSession> list = users.get(userChatRoom.get(id));
			list.remove(session);
			if(list.isEmpty()) {
				users.remove(userChatRoom.get(id));
			}
			userChatRoom.remove(id);
			suMap.remove(id);
		}

		@Override
		protected void handleTextMessage(WebSocketSession session,
				TextMessage message) {
			String[] parts;
			try {
				String msg = message.getPayload();
				char what = msg.charAt(0);
				msg = msg.substring(1);
				switch(what) {
				case 'i': //initialize connection
						parts = msg.split("=");
						List<WebSocketSession> list = users.get(parts[0]);
						if(list == null) {
							list = new ArrayList<WebSocketSession>();
							users.put(parts[0], list);
						}
						list.add(session); 
						suMap.put(session.getId(), parts[1]);
						userChatRoom.put(session.getId(), parts[0]);
						session.sendMessage(new TextMessage("i"));
						break;
				case 'm':
						parts = msg.split(DELIM);
						String json = worker.postMsg(parts[0], parts[1]);
						for(WebSocketSession s : users.get(parts[0])) {
							try {
								s.sendMessage(new TextMessage("m" + json));
							} catch(Exception e) {}
						}
						break;
				case 's':
						parts = msg.split(DELIM);
						worker.setStatus(parts[0], parts[1], parts[2]);
						for(WebSocketSession s : users.get(parts[0])) {
							try {
								s.sendMessage(new TextMessage("s" + worker.getUserStatus(parts[0])));
							} catch(Exception e) {}
						}
						break;
				}
			} catch(Exception e) {
				e.printStackTrace();
			}
			
		}

		
	}

}
