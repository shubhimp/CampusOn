"""
CampusOn Supabase Database Connector
Handles cloud PostgreSQL interactions with Row-Level Security
"""

import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://agnscincokkwkhgdwoab.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbnNjaW5jb2trd2toZ2R3b2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0NDQwMzksImV4cCI6MjEwOTAyMDAzOX0.UqUJZXeZRchsaoiLcGwYdlmx4EWPAqa-aXFbIPeuA6E")

supabase_client = None

def get_supabase_client():
    global supabase_client
    if supabase_client is None and SUPABASE_KEY:
        try:
            from supabase import create_client
            supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
            print("[SUPABASE] Connected to cloud PostgreSQL database at:", SUPABASE_URL)
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
