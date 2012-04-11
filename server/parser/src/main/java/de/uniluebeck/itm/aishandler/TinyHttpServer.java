package de.uniluebeck.itm.aishandler;

import java.net.*;
import java.io.*;

public class TinyHttpServer extends Thread {
	Socket client;

	public TinyHttpServer(Socket s) {
		client = s;
		start();
	}

	public void run() {
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(
					client.getInputStream()));
			OutputStreamWriter out = new OutputStreamWriter(client.getOutputStream());
			try {
				String s, path;
				while ((s = in.readLine()).length() > 0) {
					if (s.startsWith("GET")) {
						path = (s.split(" "))[1];
						processRequest(path, out);
					}
				}
			} catch (Exception e) {
				out.write("HTTP/1.0 404 ERROR\n\n");
				e.printStackTrace();
			}
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private void processRequest(String path, OutputStreamWriter out) throws IOException {
		String answer = "";
		if (path.startsWith("/xml")) {
			answer = Main.instance.getXML();
		}
		
		//write answer
		if ( !answer.equals("") ) {
			out.write("HTTP/1.0 200 OK\n");
			out.write("Content-Length:" + answer.length() + "\n");
			out.write("Access-Control-Allow-Origin: *\n");
			// headers end with an empty line
			out.write("\n");
			out.write(answer);
		} else {
			out.write("HTTP/1.0 404 ERROR\n\n");
		}
	}
	
}