package com.chat.data.service;

import org.bson.Document;

import com.chat.component.Worker;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class MongoDB {

	private static MongoDatabase database;
	private static MongoClient mongoClient;

	
	private static void init() {
		//System.out.println(database.getCollection(Worker.CHAT_USER).deleteMany(new BasicDBObject()).wasAcknowledged());
		//database.getCollection(Worker.CHAT_USER).createIndex(new BasicDBObject("user", 1), new IndexOptions().unique(true));
		//database.getCollection(Worker.CHAT).createIndex(new BasicDBObject("slug", 1), new IndexOptions().unique(true));
		//database.getCollection(Worker.CHAT).createIndex(new BasicDBObject("creator", 1));
		//database.getCollection(Worker.CHAT_MSG).createIndex(new BasicDBObject("time", 1));
		//database.getCollection(Worker.CHAT_MSG).createIndex(new BasicDBObject("cr", 1));
	}
	
	static {
		try {
			mongoClient = new MongoClient(
					new MongoClientURI("mongodb+srv://chat_user:root@chat-cluster-pn5pu.mongodb.net/chat?retryWrites=true"));
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
