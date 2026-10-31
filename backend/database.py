"""
CampusOn Supabase Database Connector
Handles cloud PostgreSQL interactions with Row-Level Security
"""

import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://agnscincokkwkhgdwoab.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "")

supabase_client: Client = None

def get_supabase_client():
    global supabase_client
    if supabase_client is None and SUPABASE_KEY:
        try:
            supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
            print("[SUPABASE] Connected to cloud PostgreSQL database!")
        except Exception as e:
            print(f"[SUPABASE] Connection warning: {e}")
    return supabase_client

def log_sensor_reading(device_id: str, temp: float, humidity: float, pir: bool, distance: float, gas_ppm: int):
    client = get_supabase_client()
    if client:
        try:
            client.table("sensor_readings").insert({
                "device_id": device_id,
                "temperature": temp,
                "humidity": humidity,
                "pir_motion": pir,
                "ultrasonic_distance_cm": distance,
                "mq2_gas_ppm": gas_ppm
            }).execute()
        except Exception as e:
            print(f"[SUPABASE] Error inserting sensor reading: {e}")
