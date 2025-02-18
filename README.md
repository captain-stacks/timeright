# **Timeright: decentralized event coordination app**

This app is a **decentralized platform** designed to coordinate events, starting with **weekly Friday dinner events** at restaurants. Built with **Next.js 13+ (App Router) and NextAuth.js**, it combines **secure authentication**, **cryptographic identity management**, and **decentralized event coordination** to provide a seamless and flexible experience for users.

---

## **🔹 Key Features**

### **1. Authentication with Multiple Methods**
- Users can log in via Email (Magic Link) or Google.
- **NextAuth.js** handles authentication and session management.
- A **database adapter is used only for email logins**, ensuring efficient resource use.

### **2. Deterministic Cryptographic Identity**
- Upon authentication, a **Nostr private key** is derived using **HMAC-SHA256** from the user's email and a secret salt.
- This ensures that users have a **consistent, decentralized identity** without requiring them to manually manage cryptographic keys.

### **3. Pre-Populated Event Calendar**
- The app **automatically generates dinner events** every **Friday evening**.
- Users can see upcoming events and decide which ones to attend.

### **4. Decentralized RSVP System**
- Users can **RSVP** by broadcasting an **RSVP event** on a decentralized network.
- RSVP data is **aggregated dynamically** to prevent conflicts and ensure fairness.

### **5. Organizer Role & Group Management**
- **Multiple organizer groups** can exist for a single event.
- When a user volunteers as an **event organizer**, they provide a **Signal group link** to the app.
- The app **displays the correct Signal group link** to confirmed RSVPs without central coordination.

### **6. Conflict Resolution for RSVPs**
- Since multiple organizers can claim RSVPs, a **deterministic tie-breaking mechanism** (e.g., lexicographical ordering of event IDs) ensures that each RSVP is assigned fairly.

### **7. Distributed and Secure Data Handling**
- The app leverages **Nostr relays** for decentralized communication.
- Sensitive user data (like cryptographic keys) is **never stored unencrypted**.

---

## **🔹 User Flow**
1. **User logs in** via Email or Google.
2. The app **derives a deterministic private key** for Nostr interactions.
3. The user views the **pre-populated event calendar**.
4. If interested in attending a dinner, they **RSVP** via the decentralized network.
5. **Organizers claim RSVPs** and provide a **Signal group link**.
6. The app **displays the correct Signal group link** to confirmed attendees.
7. Participants join the **Signal group** for real-time coordination.

---

## **🔹 Technology Stack**
- **Frontend:** Next.js 13+ (App Router), React  
- **Authentication:** NextAuth.js (with Email or Google)
- **Database:** nostr relays used as application database
- **Cryptography:** HMAC-SHA256 (for deterministic key derivation)  
- **Decentralized Messaging:** Nostr protocol  
- **Server-Side Logic:** Next.js API Routes  

---

## **🔹 Final Summary**
This app provides a **secure, decentralized** way to **organize dinner events** while ensuring **fair RSVP handling** and **distributed coordination**. By combining **NextAuth for authentication**, **HMAC-SHA256 for key derivation**, and **Nostr for decentralized messaging**, it offers a **trustless, efficient**, and **privacy-preserving** way for groups to self-organize without a central authority.