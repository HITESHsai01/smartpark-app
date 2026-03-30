# SmartPark — React Native (Expo) Mobile App Prompt

> Copy-paste this entire prompt into your AI assistant to build the mobile version.

---

## 🎯 Project Overview

Build a **React Native (Expo)** mobile app called **SmartPark** — a smart parking booking platform. The app has **two user roles**: **Driver** (finds & books parking spots) and **Owner** (lists & manages parking lots). Currency is **₹ (INR)**.

### Tech Stack (MANDATORY)
- **Framework**: React Native with **Expo** (latest SDK, Expo Router for file-based navigation)
- **Auth**: **Clerk** (`@clerk/clerk-expo`) — email/password sign-up & sign-in, role-based access
- **Styling**: **NativeWind** (TailwindCSS for React Native)
- **Database**: **PostgreSQL** (use **Drizzle ORM** or **Prisma** with a serverless adapter)
- **API Layer**: Expo API Routes OR a separate Express/Hono backend connecting to PostgreSQL
- **Maps**: `react-native-maps` (Google Maps / Apple Maps)
- **Geocoding**: OpenStreetMap Nominatim API (free, no key needed)
- **Routing/Directions**: OSRM (Open Source Routing Machine) for route polylines
- **Icons**: `lucide-react-native` or `@expo/vector-icons`
- **Date handling**: `date-fns`
- **Form validation**: `zod`

---

## 📊 Database Schema (PostgreSQL)

Replicate this exact schema. Adapt for Drizzle or Prisma syntax:

```sql
-- ENUMS
CREATE TYPE "Role" AS ENUM ('DRIVER', 'ADMIN', 'GUARD', 'OWNER');
CREATE TYPE "SlotStatus" AS ENUM ('FREE', 'RESERVED', 'OCCUPIED');
CREATE TYPE "BookingStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- TABLES
CREATE TABLE "User" (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  clerkId    TEXT UNIQUE NOT NULL,   -- Clerk user ID mapping
  role       "Role" DEFAULT 'DRIVER',
  name       TEXT,
  email      TEXT UNIQUE NOT NULL,
  phone      TEXT UNIQUE,
  createdAt  TIMESTAMP DEFAULT NOW(),
  updatedAt  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Vehicle" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  plateNumber TEXT NOT NULL,
  type        TEXT NOT NULL,         -- CAR, BIKE, SUV, etc.
  model       TEXT,
  userId      TEXT REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "Owner" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  userId      TEXT UNIQUE REFERENCES "User"(id) ON DELETE CASCADE,
  documentUrl TEXT,
  verified    BOOLEAN DEFAULT false
);

CREATE TABLE "ParkingLot" (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  address    TEXT NOT NULL,
  country    TEXT DEFAULT 'IN',
  squareFeet FLOAT,
  capacity   INT DEFAULT 1,
  baseRate   FLOAT DEFAULT 50.0,    -- ₹ per hour
  lat        FLOAT,
  lng        FLOAT,
  ownerId    TEXT REFERENCES "Owner"(id) ON DELETE CASCADE
);

CREATE TABLE "Slot" (
  id       TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  number   TEXT NOT NULL,            -- e.g., "A-1", "S-1"
  size     TEXT DEFAULT 'MEDIUM',    -- SMALL, MEDIUM, LARGE
  status   "SlotStatus" DEFAULT 'FREE',
  lotId    TEXT REFERENCES "ParkingLot"(id) ON DELETE CASCADE
);

CREATE TABLE "Booking" (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  userId    TEXT REFERENCES "User"(id) ON DELETE CASCADE,
  slotId    TEXT REFERENCES "Slot"(id) ON DELETE CASCADE,
  vehicleId TEXT REFERENCES "Vehicle"(id) ON DELETE CASCADE,
  startTime TIMESTAMP NOT NULL,
  endTime   TIMESTAMP,
  amount    FLOAT,
  status    "BookingStatus" DEFAULT 'ACTIVE'
);

CREATE TABLE "Payment" (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  amount    FLOAT NOT NULL,
  status    TEXT NOT NULL,
  method    TEXT NOT NULL,
  bookingId TEXT UNIQUE REFERENCES "Booking"(id) ON DELETE CASCADE
);
```

> **Key difference from web version**: Add a `clerkId` field to the `User` table to map Clerk authentication IDs to your database users.

---

## 🔐 Authentication (Clerk)

### Setup
1. Use `@clerk/clerk-expo` with Expo Router
2. Wrap the app in `<ClerkProvider>` with your publishable key
3. Use Clerk's `<SignIn>` and `<SignUp>` components, OR build custom forms using `useSignIn()` and `useSignUp()` hooks
4. Store the Clerk JWT token securely using `expo-secure-store`

### Role-Based Access
- After Clerk sign-up, create a corresponding `User` record in PostgreSQL with `clerkId` mapping
- Store the user role (`DRIVER` or `OWNER`) in both Clerk's public metadata AND the PostgreSQL `User.role` field
- Use Clerk's `useUser()` hook to check role for conditional navigation
- Protect Owner screens: if user role is not `OWNER`, redirect to home with an error toast

### Auth Flows
1. **Driver Sign Up**: Name + Email + Password → creates Clerk account → creates DB `User` with role `DRIVER`
2. **Driver Sign In**: Email + Password → Clerk auth → fetch DB user by `clerkId`
3. **Owner Sign Up / Upgrade**: Existing drivers can upgrade to `OWNER` role by submitting a parking lot listing (address, country, sqft, capacity). This:
   - Updates `User.role` to `OWNER`
   - Creates an `Owner` record
   - Creates a `ParkingLot` with auto-generated slots
4. **Owner Sign In**: Separate sign-in screen at `/owner/sign-in`, redirects to Owner Dashboard
5. **Change Password**: Available from the user profile menu
6. **Sign Out**: `useClerk().signOut()`

---

## 📱 Screens & Navigation (Expo Router)

Use **Expo Router** with file-based routing. Structure:

```
app/
├── _layout.tsx                  # Root layout (ClerkProvider, NativeWind)
├── (auth)/
│   ├── sign-in.tsx              # Driver Sign In
│   ├── sign-up.tsx              # Driver Sign Up
│   └── _layout.tsx              # Auth layout (redirect if logged in)
├── (tabs)/
│   ├── _layout.tsx              # Bottom tab navigator
│   ├── index.tsx                # Home Screen (hero + search)
│   ├── map.tsx                  # Map Screen (find parking)
│   ├── bookings.tsx             # My Bookings (driver's active bookings)
│   └── profile.tsx              # Profile & Settings
├── booking/
│   ├── [id].tsx                 # Booking Form (select duration, vehicle, pay)
│   └── success.tsx              # Booking Success Screen
├── owner/
│   ├── _layout.tsx              # Owner tab/drawer layout with sidebar nav
│   ├── index.tsx                # Owner Dashboard
│   ├── bookings.tsx             # Owner Bookings Management
│   ├── properties/
│   │   ├── index.tsx            # My Properties list
│   │   └── new.tsx              # Create New Property form
│   ├── sign-in.tsx              # Owner Sign In
│   └── sign-up.tsx              # Owner Sign Up / Upgrade
└── api/                         # API routes (if using Expo API Routes)
    ├── bookings+api.ts
    ├── properties+api.ts
    └── users+api.ts
```

---

## 🏠 Screen Details

### 1. Home Screen (`(tabs)/index.tsx`)
- **Header**: SmartPark logo (MapPin icon + "SmartPark" text), "Become a Partner" link, profile avatar or "Sign In" button
- **Hero Section**: 
  - Large heading: "Find parking in seconds, not minutes." with gradient text (blue→cyan)
  - Subtitle: "The smartest way to park. Book spots instantly, manage your listings, and save time with SmartPark."
  - **Destination search input** with MapPin icon
  - **"Book Parking Slot" button** (gradient blue→cyan) → navigates to Map screen with destination query
- **Features Section**: 3 cards in a horizontal scroll or vertical list:
  - Real-time Availability (Clock icon, blue)
  - Secure Booking (Shield icon, purple)
  - Wide Coverage (MapPin icon, orange)
- **Profile dropdown** (when logged in): Shows user initial in a gradient circle, opens a bottom sheet with: user name, email, "Change Password" option, "Sign Out" button

### 2. Map Screen (`(tabs)/map.tsx`)
- **Full-screen interactive map** using `react-native-maps`
- **Top search bar** with destination input
- **Map markers** for all parking lots from the database:
  - Default: Blue parking icon
  - Selected/routed: Yellow icon
  - Booked: Green icon
- **User's live location** marker (blue pulsing dot) using `expo-location`
- **Destination marker** (red pin)
- **Route polylines**: 
  - Cyan line: User → Destination
  - Blue dashed line: Destination → Selected Parking
- **Marker tap**: Shows a bottom sheet/card with:
  - Property name & address
  - Rate: `₹{baseRate}/hr`
  - Free slots count
  - "Route Here" button (calculates multi-leg route via OSRM)
  - "Book This Spot" button → navigates to booking form
  - "Successfully Booked!" badge if already booked
- **Route info card** (bottom-left overlay):
  - Total distance (km) & estimated duration (min)
  - Selected parking name
  - "Clear Route" button
- **Speed camera markers** along the route (camera icon)

### 3. Booking Form Screen (`booking/[id].tsx`)
- **Property info header**: Name, address, available slots count, rate
- **Duration selector**: – / + buttons with hour display (min 1hr)
- **Vehicle selector**: Dropdown of user's vehicles or "Add new vehicle"
- **Price breakdown**: Rate × hours = Total
- **"Pay & Book" button**: 
  - POST to `/api/bookings` with `{ propertyId, duration, vehicleType, amount }`
  - Creates booking, updates slot status to RESERVED
  - On success → navigate to success screen

### 4. Booking Success Screen (`booking/success.tsx`)
- Large green checkmark animation
- "Booking Confirmed!" heading
- "Your spot has been reserved" message
- "Back to Map" and "Go Home" buttons

### 5. My Bookings Screen (`(tabs)/bookings.tsx`)
- List of user's active bookings
- Each card shows: property name, slot number, start/end time, amount, status badge

### 6. Profile Screen (`(tabs)/profile.tsx`)
- User avatar (initial), name, email
- Change Password form
- "Become a Partner" link (if role is DRIVER)
- Sign Out button

---

## 🏢 Owner Screens

### 7. Owner Dashboard (`owner/index.tsx`)
- **Stat cards** (4 cards in 2×2 grid):
  - Total Revenue (₹), Active Bookings, Total Slots, Occupancy Rate
  - Each with icon, value, change percentage, trend arrow (up/down)
- **Revenue Analytics**: Pie chart (use `react-native-chart-kit` or `victory-native`)
  - Revenue breakdown by property
  - Time filter dropdown (7 days / This Month / Last Quarter)
- **Recent Bookings list**: Last 5 bookings with user initials, spot name, time, "Paid" badge
- **My Properties Status table**: Property name, location, status (Active badge), occupancy bar, "Manage" button

### 8. Owner Bookings Management (`owner/bookings.tsx`)
- **Stats row**: Total Earnings, Active Bookings, Completed, Today's count
- **Search & filter bar**: Search by customer/vehicle/property, filter by status (All/Active/Completed/Cancelled/Expired)
- **Bookings list** (card-based for mobile): Each card shows:
  - Customer avatar + name + email
  - Property & slot info
  - Vehicle plate + type
  - Date/time + relative time ("2 hours ago")
  - Status badge (color-coded: Active=green, Completed=blue, Cancelled=red, Expired=gray)
  - Payment status (Paid/Pending)
  - Amount in ₹
- **Summary footer**: Total count, active vs completed breakdown

### 9. Owner Properties (`owner/properties/index.tsx`)
- **Header**: "My Properties" title + "Add Property" button
- **Property cards grid**: Each card has:
  - Placeholder image area with MapPin icon
  - Property name, address
  - Slot count + rate per hour
- **Empty state**: "No properties" with MapPin icon and "Add Property" CTA

### 10. New Property Form (`owner/properties/new.tsx`)
- Form fields: Property Name, Address, Base Rate (₹/hr), Number of Slots
- On submit:
  - Geocode the address (Nominatim API) to get lat/lng
  - Create `Owner` record if not exists
  - Create `ParkingLot` with auto-generated slots (`S-1`, `S-2`, etc.)
  - Navigate back to properties list

### 11. Owner Sign Up / Upgrade (`owner/sign-up.tsx`)
- **Split layout** (or scrollable on mobile):
  - Branding section: "Turn your parking space into passive income" with benefits list
  - Form section: If logged in as Driver → show "Upgrade" form (address, country, sqft, capacity). If not logged in → show full sign-up form
- On submit: Creates owner profile, upgrades role, creates first parking lot with slots

---

## 🎨 Design System (NativeWind)

### Colors
- Primary gradient: `from-blue-600 to-cyan-500`
- Background: Light `#f7f9fc` / Dark `neutral-950`
- Cards: Light `white` / Dark `neutral-900`
- Borders: Light `gray-100` / Dark `neutral-800`
- Text: Light `gray-900` / Dark `white`
- Accent: Blue-600 for CTAs

### Typography
- Use Inter or system font
- Headings: `font-bold tracking-tight`
- Body: `text-sm` or `text-base`

### Component Patterns
- Cards: `rounded-xl border shadow-sm` with hover states
- Buttons: `rounded-xl` or `rounded-full` with gradient backgrounds
- Inputs: `rounded-xl border bg-gray-50 dark:bg-zinc-800 px-4 py-3`
- Badges: `rounded-full px-2.5 py-1 text-xs font-medium` with color variants
- Avatars: Gradient circle with user initial, `rounded-full`
- Bottom sheets for mobile interactions instead of dropdowns/popups

### Dark Mode
- Support system theme detection
- Use NativeWind's `dark:` prefix throughout
- Dark backgrounds: `#0a0a0a`, `#111111`, `neutral-900/950`

---

## 🔌 API Endpoints

Build these REST endpoints (either Expo API Routes or Express backend):

### `POST /api/users` — Create user after Clerk sign-up
- Body: `{ clerkId, name, email }`
- Creates `User` record with role `DRIVER`

### `GET /api/properties` — Get all parking lots
- Requires auth (Clerk JWT)
- Returns all `ParkingLot` with `slots` and `owner.user` included

### `POST /api/properties` — Create parking lot
- Requires auth + OWNER role
- Body: `{ name, address, baseRate, slots }`
- Geocodes address, creates lot + slots in a transaction

### `GET /api/bookings` — Get user's active bookings
- Requires auth
- Returns bookings with `slot.lot` included

### `POST /api/bookings` — Create a booking
- Requires auth
- Body: `{ propertyId, duration, vehicleType, amount }`
- Finds free slot, creates/finds vehicle, creates booking, updates slot to RESERVED (all in a transaction)

### `POST /api/auth/password` — Change password
- Uses Clerk SDK to update password

### `POST /api/owner/upgrade` — Upgrade driver to owner
- Body: `{ address, country, squareFeet, capacity }`
- Updates user role, creates Owner + ParkingLot + Slots in a transaction

---

## 🗺️ Map & Routing Implementation

### Geocoding
- Use Nominatim API: `https://nominatim.openstreetmap.org/search?format=json&q={query}`
- Include `User-Agent: SmartPark/1.0` header
- Convert response to `{ lat, lng }`

### Routing
- Use OSRM API: `https://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson`
- Draw polyline on map from response geometry
- Calculate distance (km) and duration (min) from response

### Multi-leg Routing
- Leg 1: User location → Destination (cyan line)
- Leg 2: Destination → Selected Parking (blue dashed line)
- Save selected parking in state, persist across booking flow

### Live Location
- Use `expo-location` with `watchPositionAsync()` for real-time updates
- Show blue pulsing marker at user's position

---

## 📋 Key Implementation Notes

1. **Clerk + PostgreSQL sync**: After every Clerk sign-up, immediately create a `User` record in PostgreSQL with the `clerkId`. Use Clerk webhooks or do it in the sign-up success callback.

2. **Role middleware**: Before rendering Owner screens, check `user.publicMetadata.role === 'OWNER'`. Redirect to home with error toast if unauthorized.

3. **Transactions**: Use database transactions for booking creation (create booking + update slot status) and owner upgrade (update role + create owner + create lot + create slots).

4. **Bottom sheets**: Use `@gorhom/bottom-sheet` for parking spot details, profile menu, and filters on mobile instead of modal overlays.

5. **Animations**: Use `react-native-reanimated` for smooth transitions, loading states, and the booking success checkmark animation.

6. **Error handling**: Show toast notifications (use `react-native-toast-message`) for errors like "Access Denied", "No slots available", "Booking failed".

7. **Pull-to-refresh**: Implement on booking lists, property lists, and dashboard.

8. **Offline consideration**: Cache map tiles and show graceful empty states when offline.

9. **Currency**: All monetary values displayed with ₹ symbol. Default base rate is ₹50/hr.

10. **Vehicle management**: If user has no vehicles, auto-create one with a placeholder plate number during booking. Allow adding real vehicles from profile.

---

## 🚀 Getting Started Commands

```bash
# Create Expo project
npx create-expo-app@latest SmartParkMobile --template tabs

# Install core dependencies
npx expo install react-native-maps expo-location expo-secure-store

# Install Clerk
npm install @clerk/clerk-expo

# Install NativeWind
npm install nativewind tailwindcss
npx tailwindcss init

# Install other dependencies
npm install @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler
npm install drizzle-orm pg         # OR prisma equivalents
npm install zod date-fns lucide-react-native
npm install react-native-chart-kit  # For pie charts
npm install react-native-toast-message
```

---

## ✅ Feature Checklist

- [ ] Clerk auth (sign-up, sign-in, sign-out, change password)
- [ ] Driver role: search destination, view map, book parking, view bookings
- [ ] Owner role: dashboard, manage bookings, manage properties, add properties
- [ ] Role-based navigation guards
- [ ] Interactive map with custom markers
- [ ] Live location tracking
- [ ] Route calculation & polyline rendering
- [ ] Booking flow with duration & vehicle selection
- [ ] PostgreSQL database with all 7 tables
- [ ] API routes with Zod validation
- [ ] Dark mode support
- [ ] NativeWind styling throughout
- [ ] Bottom sheets for mobile UX
- [ ] Pull-to-refresh on lists
- [ ] Error toasts & loading states
- [ ] Revenue pie chart on owner dashboard
