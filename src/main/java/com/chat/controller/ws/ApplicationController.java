package com.chat.controller.ws;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


import com.chat.component.Worker;


@Controller
public class ApplicationController {
	
	Worker worker = new Worker();


	@RequestMapping("/")
	public String index() {
		return "index";
	}
	
	
	@RequestMapping("/login")
	@ResponseBody
	public String login(@RequestParam String un, @RequestParam String pass, HttpServletRequest req) {
		String name = worker.login(un, pass);
		if(true) {
			HttpSession s = req.getSession(true);
			s.setAttribute("user", un);
		}
		return name;
	}
	
	
	@RequestMapping("/signup")
	public String signUpForm( ) {
		return "sign-up";
	}
	
	@RequestMapping("/user/{user}")
	public String dashboard(@PathVariable String user, HttpServletRequest req) {
		HttpSession s = req.getSession(false);
		if(s == null || !s.getAttribute("user").equals(user)) {
			return "redirect:/";
		} else {
			return "dashboard";
		}
		
	}
	
	@ResponseBody
	@RequestMapping("/user/{user}/create-cr")
	public String createCR(@PathVariable String user, HttpServletRequest req, @RequestParam String cr) {
		HttpSession s = req.getSession(false);
		if(s == null || !s.getAttribute("user").equals(user)) {
			return "un_auth";
		} else {
			return worker.createCR(cr) ? "c" : "e";
		}
		
	}

	@ResponseBody
	@RequestMapping("/user/{user}/join-cr")
	public String createCR(@RequestParam String cr, @RequestParam String u) {
		return "" + worker.joinCR(u, cr);
	}
	
	
	@ResponseBody
	@RequestMapping("/user/{user}/all-chat")
	public String allChats(@PathVariable String user) {
		return worker.getAllChats(user);
	}
	
	@RequestMapping("/chat/{chatRoom}")
	public String showChatRoom(@PathVariable String chatRoom, HttpServletRequest req) {
		HttpSession s = req.getSession(false);
		if(s == null) {
			return "redirect:/ ";
		} else {
			return "chat-room";
		}
	}

	@ResponseBody
	@RequestMapping("/chat/{chatRoom}/init")
	public String initChatRoom(@PathVariable String chatRoom) {
		return worker.getChatRoom(chatRoom);
	}
	
	@ResponseBody
	@RequestMapping("/chat/{chatRoom}/gms")
	public String getMsgsAndStatus(@PathVariable String chatRoom, 
			@RequestParam boolean status, @RequestParam String time,
			@RequestParam String user, @RequestParam long lmt) {
		return worker.gms(chatRoom, time, user, status, lmt);
	}
	
	@ResponseBody
	@RequestMapping("/chat/{chatRoom}/post-msg")
	public String postMsg(@PathVariable String chatRoom, @RequestParam String msg) {
		return "" + worker.postMsg(chatRoom, msg);
	}
	
	
	
	
	@ResponseBody
	@RequestMapping("/me-signup")
	public String signUp(@RequestParam String name, @RequestParam String user,
			@RequestParam String pass, HttpServletRequest req) {
		boolean result = worker.signup(user, pass, name);
		if(true) {
			HttpSession s = req.getSession(true);
			s.setAttribute("user", user);
		}
		return result ? name : "null";
	}
	
	
	@ResponseBody
	@RequestMapping("/sc/{coll}")
	public String showColl(@PathVariable String coll) {
		return worker.showCollection(coll);
	}
	
	@ResponseBody
	@RequestMapping("/sc/chat_msg/{slug}")
	public String showAllMsg(@PathVariable String slug) {
		return worker.getAllMsg(slug);
	}
	
	@ResponseBody
	@RequestMapping("/sc/sample/{slug}/{time}")
	public String sample(@PathVariable String slug, @PathVariable long time) {
		return worker.getmsggt(time, slug);
	}
	
	
}
