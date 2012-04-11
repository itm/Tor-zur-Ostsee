import java.util.Date;

import dk.tbsalling.aismessages.messages.PositionReport;
import dk.tbsalling.aismessages.messages.ShipAndVoyageData;
import dk.tbsalling.aismessages.messages.types.NavigationStatus;


public class VesselData {
	
	private Date lastUpdate = new Date();
	private long mmsi;
	private String name;
	private String status;
	private float lng;
	private float lat;
	
	public VesselData(long mmsi) {
		this.mmsi = mmsi;
	}
	
	public void updateInfo(ShipAndVoyageData msg) {
		update();
		name = msg.getShipName().replace("@", "").trim();
	}

	public void updatePosition(PositionReport msg) {
		update();
		lng = msg.getLongitude();
		lat = msg.getLatitude();
		status = msg.getNavigationStatus().getValue();
	}
	
	private void update() {
		long diffSeconds = (new Date().getTime()-lastUpdate.getTime()) / 1000;
		int seconds = (int) (diffSeconds % 60);
		int minutes = (int) (diffSeconds-seconds)/60;
		//System.out.println("Updated "+mmsi+":\""+name+"\" (last update "+minutes+"m"+seconds+"s ago)");
		
		lastUpdate = new Date();
	}

	public Date getLastUpdate() {
		return lastUpdate;
	}

	public String getName() {
		return name;
	}

	public float getLng() {
		return lng;
	}

	public float getLat() {
		return lat;
	}
	
	public long getMMSI() {
		return mmsi;
	}

}
