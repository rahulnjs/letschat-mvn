package com.chat.data.service;

import org.bson.Document;

import com.chat.component.Worker;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.IndexOptions;


import com.chat.controller.ws.ApplicationController;

public class MongoDB {

	private static MongoDatabase database;
	private static MongoClient mongoClient;

	
	private static void init() {
		database.getCollection(Worker.CHAT_USER).createIndex(new BasicDBObject("user", 1), new IndexOptions().unique(true));
		database.getCollection(Worker.CHAT).createIndex(new BasicDBObject("slug", 1), new IndexOptions().unique(true));
		database.getCollection(Worker.CHAT).createIndex(new BasicDBObject("creator", 1));
		database.getCollection(Worker.CHAT_MSG).createIndex(new BasicDBObject("time", 1));
		database.getCollection(Worker.CHAT_MSG).createIndex(new BasicDBObject("cr", 1));
	}
	
	static {
		String url = ApplicationController.PRODUCTION ? 
			"mongodb://admin:11_root@ds135547.mlab.com:35547/heroku_hspfz0qg" :
			"mongodb+srv://chat_user:root@chat-cluster-pn5pu.mongodb.net/chat?retryWrites=true";

		try { 
			mongoClient = new MongoClient(
					new MongoClientURI(url));
			database = mongoClient.getDatabase("chat");
			init();
		} catch (Exception e) {
			System.out.println(e);
		}
	}
	
	public static void closeCon() {
		mongoClient.close();
	}
	
	
	public static MongoCollection<Document> _cln(String cln) {
		return database.getCollection(cln);
	}
	
	
	
}
