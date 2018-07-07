package com.chat.component;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import org.bson.Document;

import com.chat.data.service.MongoDB;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Projections;

public class Worker {
	
	public static final String CHAT_USER = "chat_user";
	public static final String CHAT = "chat";
	public static final String CHAT_MSG = "chat_msg";
	
	
	
	public String login(String u, String p) {
		BasicDBObject obj = new BasicDBObject();
    	obj.put("user", new BasicDBObject("$eq", u));
    	obj.put("pass", new BasicDBObject("$eq", p));
		Document doc = MongoDB._cln(CHAT_USER).find(obj).first();
		return doc == null ? "null" : doc.get("name").toString();
	}
	
	
	
	
	public boolean signup(String u, String p, String n) {
		try {
			BasicDBObject obj = new BasicDBObject();
			obj.put("user", u);
			obj.put("name", n);
			obj.put("pass", p);
			Document doc = new Document(obj);
			MongoDB._cln(CHAT_USER).insertOne(doc);
			return true;
		} catch(Exception exp) {
			System.out.println(exp);
			return false;
			
		}
	}
	
	
	public boolean createCR(String json) {
		try {
			Document doc = Document.parse(json);
			MongoDB._cln(CHAT).insertOne(doc);
			return true;
		} catch (Exception e) {
			System.out.println(e);
			return false;
		}
	}
	
	public boolean joinCR(String json, String cr) {
		try {
			BasicDBObject qry = new BasicDBObject();
			qry.put("slug", cr);
			Document doc = Document.parse(json);
			BasicDBObject obj = new BasicDBObject();
			obj.put("users", doc);
			MongoDB._cln(CHAT).updateOne(qry, new BasicDBObject("$push", obj));
			return true;
		} catch (Exception e) {
			System.out.println(e);
			return false;
		}
	}
	
	public String showCollection(String coll) {
		return toJSON(MongoDB._cln(coll).find());
		
	}
	
	public String getAllChats(String user) {
		BasicDBObject qry = new BasicDBObject();
		qry.put("creator", user);
		BasicDBObject qry2 = new BasicDBObject().append("users.user", user);
		qry2.append("creator", new BasicDBObject("$ne", user));
		FindIterable<Document> itr = MongoDB._cln(CHAT).find(qry).projection(Projections.exclude("msgs"));
		FindIterable<Document> itrw = MongoDB._cln(CHAT).find(qry2).projection(Projections.exclude("msgs"));
		return "{\"0\": " + toJSON(itr) + ", \"1\": " + toJSON(itrw) + "}";
	}
	
	public String getChatRoom(String slug) {
		BasicDBObject qry = new BasicDBObject();
		qry.put("slug", slug);
		FindIterable<Document> result = MongoDB._cln(CHAT).find(qry);
		String s = result.first().toJson();
		result.iterator().close();
		return s;
	}
	
	
	public String gms(String slug, String time, String user, boolean typing, long lmt) {
		BasicDBObject qry = new BasicDBObject();
		qry.put("slug", slug);
		updateStatus(slug, time, user, typing);
		FindIterable<Document> result = MongoDB._cln(CHAT).find(qry);
		Document doc = result.first();
		String s = "{\"msg\": " + getmsggt(lmt, slug) + ","
				+ " \"status\": " + toJSON(doc.get("users")) + "}";
		result.iterator().close();
		return s;
	}
	
	public String getAllMsg(String slug) {
		BasicDBObject qry = new BasicDBObject();
		qry.put("cr", slug);
		return toJSON(MongoDB._cln(CHAT_MSG).find(qry));
	}
	
	/////////
	public String getmsggt(long l, String slug) {
		BasicDBObject qry = new BasicDBObject();
		qry.put("cr", slug);
		qry.append("time", new BasicDBObject("$gt", l));
		return toJSON(MongoDB._cln(CHAT_MSG).find(qry));
	}
	
	
	private boolean updateStatus(String slug, String time, String user, boolean typing) {
		String status = typing ? "Typing..." : time;
		BasicDBObject qry = new BasicDBObject();
		qry.put("users.user", user);
		qry.put("slug", slug);
		BasicDBObject qry2 = new BasicDBObject();
		qry2.put("users.$.status", status);
		long i = MongoDB._cln(CHAT).updateOne(qry, new Document("$set", qry2)).getModifiedCount();
		return i > 0;
	}
	
	public boolean postMsg(String slug, String json) {
		try {
			Document doc = Document.parse(json);
			doc.put("cr", slug);
			doc.put("time", new Date().getTime());
			MongoDB._cln(CHAT_MSG).insertOne(doc);
			return true;
		} catch (Exception e) {
			System.out.println(e);
			return false;
		}
	}
	
	@SuppressWarnings("unchecked")
	private String toJSON(Object o) {
		Iterator<Document> itr = ((ArrayList<Document>) o).iterator();
		String json = "[";
		while(itr.hasNext()) {
			if(json.length() > 1) {
				json += ",";
			}
			json += itr.next().toJson();
		}
		return json + "]";
	}

	private String toJSON(FindIterable<Document> itr2) {
		MongoCursor<Document> itr = itr2.iterator();
		String json = "[";
		while(itr.hasNext()) {
			if(json.length() > 1) {
				json += ",";
			}
			json += itr.next().toJson();
		}
		itr.close();
		return json + "]";
	}
	
	
	
}

