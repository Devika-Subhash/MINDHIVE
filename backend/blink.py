import cv2
import mediapipe as mp
import requests
import time
import threading
import numpy as np

# 🔴 CONFIGURATION
ESP_IP = "192.168.1.7" 
# Average EAR is ~0.2 to 0.3 when open, drops below 0.15 when blinking.
EAR_THRESHOLD = 0.18  
# How many seconds to wait to distinguish between 1 and 2 blinks
COMMAND_DELAY = 1.2 

mp_face = mp.solutions.face_mesh
face_mesh = mp_face.FaceMesh(refine_landmarks=True)

cap = cv2.VideoCapture(0)

# State Variables
eye_closed = False
blink_count = 0
last_blink_time = 0

def calculate_ear(landmarks, eye_indices):
    # Vertical distances
    p2_p6 = np.linalg.norm(np.array([landmarks[eye_indices[1]].x, landmarks[eye_indices[1]].y]) - 
                           np.array([landmarks[eye_indices[5]].x, landmarks[eye_indices[5]].y]))
    p3_p5 = np.linalg.norm(np.array([landmarks[eye_indices[2]].x, landmarks[eye_indices[2]].y]) - 
                           np.array([landmarks[eye_indices[4]].x, landmarks[eye_indices[4]].y]))
    # Horizontal distance
    p1_p4 = np.linalg.norm(np.array([landmarks[eye_indices[0]].x, landmarks[eye_indices[0]].y]) - 
                           np.array([landmarks[eye_indices[3]].x, landmarks[eye_indices[3]].y]))
    
    return (p2_p6 + p3_p5) / (2.0 * p1_p4)

def send_esp_command(action):
    def network_task():
        try:
            r = requests.get(f"http://{ESP_IP}/{action}", timeout=1)
            print(f"✅ ESP ({action}): {r.text}")
        except:
            print(f"❌ Connection to {ESP_IP} failed")
    threading.Thread(target=network_task).start()

# Landmark indices for Left Eye
LEFT_EYE = [33, 160, 158, 133, 153, 144]

print("🚀 MindHive EAR Controller Active...")

while True:
    ret, frame = cap.read()
    if not ret: break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = face_mesh.process(rgb)

    current_ear = 0

    if result.multi_face_landmarks:
        landmarks = result.multi_face_landmarks[0].landmark
        current_ear = calculate_ear(landmarks, LEFT_EYE)

        # -------- BLINK DETECTION --------
        if current_ear < EAR_THRESHOLD:
            if not eye_closed:
                eye_closed = True
        else:
            if eye_closed:
                blink_count += 1
                eye_closed = False
                last_blink_time = time.time()
                print(f"👁 Blink {blink_count} detected!")

    # -------- DECISION LOGIC (Outside face loop) --------
    if blink_count > 0 and (time.time() - last_blink_time > COMMAND_DELAY):
        if blink_count == 1:
            print("👉 SINGLE BLINK -> ON")
            send_esp_command("on")
        elif blink_count == 2:
            print("👉 DOUBLE BLINK -> OFF")
            send_esp_command("off")
        
        blink_count = 0 

    # -------- UI OVERLAY --------
    status_color = (0, 0, 255) if eye_closed else (0, 255, 0)
    cv2.putText(frame, f"EAR: {round(current_ear, 3)}", (30, 40), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
    cv2.putText(frame, f"Blinks: {blink_count}", (30, 80), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, status_color, 2)

    cv2.imshow("MindHive - EAR Tracking", frame)

    if cv2.waitKey(1) & 0xFF == 27: break

cap.release()
cv2.destroyAllWindows()