#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

Servo servoMotor;

#define TRIG 0
#define ECHO 2

const char* ssid = "TOPNET-UXHPSP";
const char* password = "47cr2833xa";
WebServer server(80);

// Function to read ultrasonic distance
long readDistance() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  long duration = pulseIn(ECHO, HIGH, 30000);
  long distance = duration * 0.034 / 2;

  if (distance == 0) distance = 999; // No reading
  return distance;
}

// Handle OPEN
void handleOpen() {
  long d = readDistance();

  if (d < 1) {
    server.send(200, "application/json", "{\"success\":false, \"reason\":\"object_too_close\"}");
    return;
  }

  servoMotor.write(90); // OPEN
  server.send(200, "application/json", "{\"success\":true}");
}

// Handle CLOSE
void handleClose() {
  servoMotor.write(0);  // CLOSE
  server.send(200, "application/json", "{\"success\":true}");
}

// Handle FILLSTATUS
void handleFillStatus() {
  long distance = readDistance();
  String status;
  int percent;

  if (distance < 1) {
    status = "FULL";
    percent = 100;
  } else if (distance < 3) {
    status = "50%";
    percent = 50;
  } else {
    status = "EMPTY";
    percent = 0;
  }

  String json = "{\"status\":\"" + status + "\",\"percent\":" + String(percent) + ",\"distance\":" + String(distance) + "}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);

  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);

  servoMotor.attach(4);
  servoMotor.write(0); // Start closed

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/open", handleOpen);
  server.on("/close", handleClose);
  server.on("/fillstatus", handleFillStatus); // ← ajouté

  server.begin();
}

void loop() {
  server.handleClient();
}
