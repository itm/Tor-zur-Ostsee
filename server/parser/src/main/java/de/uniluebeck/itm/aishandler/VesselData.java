package de.uniluebeck.itm.aishandler;

import java.util.Date;

import dk.tbsalling.aismessages.messages.PositionReport;
import dk.tbsalling.aismessages.messages.ShipAndVoyageData;
import dk.tbsalling.aismessages.messages.types.NavigationStatus;
import dk.tbsalling.aismessages.messages.types.ShipType;


public class VesselData {
	
	private Date lastUpdate = new Date();
	private long mmsi;
	private String name;
	private String status;
	private String call;
	private String type;
	private float lng;
	private float lat;
	private float draught;
	private Long imo;
	private String destination;
	private int trueHeading;
	private float course;
	private float speed;
	private int length;
	private int width;
	
	public VesselData(long mmsi) {
		this.mmsi = mmsi;
	}
	
	public void updateInfo(ShipAndVoyageData msg) {
		update();
		name = msg.getShipName().replace("@", "").trim();
		call = msg.getCallsign().replace("@", "").trim();
		type = formatType(msg.getShipType());
		draught = msg.getDraught();
		imo = msg.getImo().getIMO();
		destination = msg.getDestination().replace("@", "").trim();
		length = msg.getToBow() + msg.getToStern();
		width = msg.getToPort() + msg.getToStarboard();
	}

	private String formatType(ShipType shipType) {
		if (shipType == null) {
			return "none";
		}
		
		switch (shipType) {
		case Cargo:
		case CargoNoAdditionalInfo:
		case CargoHazardousA:
		case CargoHazardousB:
		case CargoHazardousC:
		case CargoHazardousD:	
			return "cargo_ships";
		case Tanker:
			return "tankships";
		case PleasureCraft:
			return "pleasure_crafts";
		case Passenger:
		case PassengerNoAdditionalInfo:
			return "passenger_ships";
		case PilotVessel:
			return "pilot_vessels";
		case Fishing:
			return "fishing_boats";
		case Sailing:
			return "sailing_vessels";
		case Tug:
			return "tugboats";
		case HighSpeedCraft:
			return "high-speed_crafts";
		case DredgingOrUnderwaterOps:
			return "dredgers";
		case AntiPollutionEquipment:
			return "anti-pollution_vessels";
		case Towing:
			return "towing_vessels";
		case LawEnforcement:
			return "coast_guard_ships";
		case Other:
			return "others";
		default:
			return shipType.toString();
		}
	}

	public void updatePosition(PositionReport msg) {
		update();
		status = formatStatus(msg.getNavigationStatus());
		lng = msg.getLongitude();
		lat = msg.getLatitude();
		trueHeading = msg.getTrueHeading();
		course = msg.getCourseOverGround();
		speed = msg.getSpeedOverGround();
	}
	
	private String formatStatus(NavigationStatus navigationStatus) {
		if (navigationStatus == null) {
			return "UNKNOWN";
		}
		switch (navigationStatus) {
		case Moored:
			return "MOORED";
		case UnderwaySailing:
		case UnderwayUsingEngine:
			return "MOVING";
		case AtAnchor:
			return "ANCHORAGE";
		case NotDefined:
			return "UNKNOWN";
		default:
			return navigationStatus.toString();
		}
	}

	private void update() {
		long diffSeconds = (new Date().getTime()-lastUpdate.getTime()) / 1000;
		int seconds = (int) (diffSeconds % 60);
		int minutes = (int) (diffSeconds-seconds)/60;
		//System.out.println("Updated "+mmsi+":\""+name+"\" (last update "+minutes+"m"+seconds+"s ago)");
		
		lastUpdate = new Date();
	}

	public String getStatus() {
		return status;
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
	
	public String getCallSign() {
		return call;
	}
	
	public String getType() {
		return type;
	}
	
	public float getDraught() {
		return draught;
	}

	public Long getImo() {
		return imo;
	}

	public String getDestination() {
		return destination;
	}
	
	public int getTrueHeading() {
		return trueHeading;
	}
	
	public int getCourseOverGround() {
		return (int) course;
	}
	
	public float getSpeed() {
		return speed;
	}
	
	public int getWidth() {
		return width;
	}
	
	public int getLength() {
		return length;
	}

}
