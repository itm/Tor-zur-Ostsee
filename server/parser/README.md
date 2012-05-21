# Parser

Receives raw AIS data via TCP, parses it with a 3rd party library and publishes human readable data in an XML document via HTTP.
The first argument when starting the program is the TCP port the data will be pubished via HTTP (see ``pom.xml`` when using maven to run)

# Instructions

Can be packaged to a single jar containing all dependencies via
``mvn package``