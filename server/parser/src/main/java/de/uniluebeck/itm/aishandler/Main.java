import java.io.IOException;
import java.io.StringWriter;
import java.net.ServerSocket;
import java.net.UnknownHostException;
import java.text.DateFormat;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import dk.tbsalling.aismessages.DecodedAISMessageHandler;
import dk.tbsalling.aismessages.NMEAMessageSocketClient;
import dk.tbsalling.aismessages.messages.DecodedAISMessage;
import dk.tbsalling.aismessages.messages.PositionReport;
import dk.tbsalling.aismessages.messages.ShipAndVoyageData;


public class Main implements DecodedAISMessageHandler {
	
	public static final Main instance = new Main();
	
	/**
	 * A map containing the currently visible and active vessels in the Luebeck
	 * area. The key is the MMSI.
	 */
	private Map<Long, VesselData> vessels = new ConcurrentHashMap<Long, VesselData>();

	@Override
	public void handleMessageReceived(DecodedAISMessage msg) {
		// are we interested in the message?
		if ( msg instanceof ShipAndVoyageData || msg instanceof PositionReport ) {
			
			// get data for mmsi or insert new entry
			long mmsi = msg.getSourceMmsi().getMMSI();
			VesselData vesselData = vessels.get(mmsi);
			if ( vesselData == null ) {
				vesselData = new VesselData(mmsi);
				vessels.put(mmsi, vesselData);
			} 
	
			// update data
			if ( msg instanceof ShipAndVoyageData ) {
				vesselData.updateInfo((ShipAndVoyageData)msg);
			} else if ( msg instanceof PositionReport ) {
				vesselData.updatePosition((PositionReport)msg);
			}
			
			// remove invalid vessels
			for ( VesselData data : vessels.values() ) {
				if ( isTooOld(data) ) {
					vessels.remove(data.getMMSI());
				}
			}
		}
	}
	
	private boolean isTooOld(VesselData data) {
		// 10 minutes
		long max = 10 * 60 * 1000;
		return (new Date().getTime()-data.getLastUpdate().getTime()) > max;
	}
	
	private boolean isOutOfScope(VesselData data) {
		// TODO implement Luebeck area check
		return false;
	}
	
	public String getXML() {
		String xmlString = "Error creating XML";
		try {
			// we need a Document
			DocumentBuilderFactory dbfac = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder = dbfac.newDocumentBuilder();
			Document doc = docBuilder.newDocument();
			
			//create the root element and add it to the document
			Element root = doc.createElement("markers");
			DateFormat df = DateFormat.getDateInstance();
			root.setAttribute("created", df.format(new Date()) );
			doc.appendChild(root);
			
			//create child elements, add attributes and add to root
			for ( VesselData data : vessels.values() ) {
				Element child = doc.createElement("marker");
				child.setAttribute("name", data.getName());
				child.setAttribute("lat", data.getLat()+"");
				child.setAttribute("lng", data.getLng()+"");
				child.setAttribute("mmsi", data.getMMSI()+"");
				root.appendChild(child);
			}
			
			//set up a transformer
			TransformerFactory transfac = TransformerFactory.newInstance();
			Transformer trans = transfac.newTransformer();
			trans.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
			trans.setOutputProperty(OutputKeys.INDENT, "yes");
			
			//create string from XML tree
			StringWriter sw = new StringWriter();
			StreamResult result = new StreamResult(sw);
			DOMSource source = new DOMSource(doc);
			trans.transform(source, result);
			xmlString = sw.toString();
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return xmlString;
	}
	
	private static void startParserClient() {
		new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					NMEAMessageSocketClient nmeaMessageHandler = new NMEAMessageSocketClient("AIS Parser", "127.0.0.1", 8124, instance);
					nmeaMessageHandler.run();
					System.out.println("Parser started...");
				} catch (UnknownHostException e) {
					System.err.println("Unknown host: " + e.getMessage());
				} catch (IOException e) {
					System.err.println("I/O error: " + e.getMessage());
				}
			}
		}).start();
	}
	
	private static void startHttpServer() {
		new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					ServerSocket s = new ServerSocket(8181);
					System.out.println("HTTP Server listening on 8181");
					for (;;) {
						new TinyHttpServer(s.accept());
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}).start();
	}

	public static void main(String[] args) {
		startParserClient();
		startHttpServer();
	}

}
