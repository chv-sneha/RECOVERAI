import os
import requests
import uuid
import datetime
import logging
from requests.auth import HTTPBasicAuth

logger = logging.getLogger("recoverai.razorpay_adapter")

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

def is_real_razorpay_configured() -> bool:
    """Returns True if non-dummy Razorpay Test credentials are provided in env."""
    return bool(
        RAZORPAY_KEY_ID 
        and RAZORPAY_KEY_SECRET 
        and not RAZORPAY_KEY_ID.startswith("rzp_test_recoverai_hackathon")
    )

def test_razorpay_connection() -> dict:
    """Tests server-side connectivity to Razorpay Test API using basic auth."""
    if not is_real_razorpay_configured():
        return {
            "connected": False,
            "mode": "SIMULATION_MODE",
            "message": "Running on built-in simulation mode. Configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET for live Test Mode."
        }
    
    try:
        url = "https://api.razorpay.com/v1/payments?count=1"
        res = requests.get(url, auth=HTTPBasicAuth(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET), timeout=5)
        if res.status_code == 200:
            return {
                "connected": True,
                "mode": "RAZORPAY_TEST_MODE",
                "key_id_masked": f"{RAZORPAY_KEY_ID[:8]}...{RAZORPAY_KEY_ID[-4:]}",
                "message": "Razorpay Test Mode API Connected successfully."
            }
        else:
            return {
                "connected": False,
                "mode": "CONNECTION_ERROR",
                "message": f"Razorpay API Auth failed (HTTP {res.status_code})"
            }
    except Exception as e:
        logger.error(f"Error testing Razorpay connection: {e}")
        return {
            "connected": False,
            "mode": "CONNECTION_ERROR",
            "message": f"Connection error: {str(e)}"
        }

def execute_razorpay_action(action_type: str, case_data: dict, parameters: dict = None) -> dict:
    """
    Executes legitimate Razorpay REST API call (or fallback sandbox execution).
    """
    amount_in_paisa = int(case_data.get("amount_at_risk", 100) * 100)
    cust_name = case_data.get("customer_name", "Valued Customer")
    cust_email = case_data.get("customer_email", "customer@example.com")
    case_id = case_data.get("case_id", "case_unknown")
    
    if action_type in ["GENERATE_PAYMENT_LINK", "SEND_RECOVERY_NOTIFICATION"]:
        if is_real_razorpay_configured():
            try:
                url = "https://api.razorpay.com/v1/payment_links"
                payload = {
                    "amount": amount_in_paisa,
                    "currency": "INR",
                    "accept_partial": False,
                    "description": f"RecoverAI Priority Payment Link - Order Recovery ({case_id})",
                    "customer": {
                        "name": cust_name,
                        "email": cust_email
                    },
                    "notify": {
                        "sms": True,
                        "email": True
                    },
                    "reminder_enable": True,
                    "notes": {
                        "case_id": case_id,
                        "recovered_by": "RecoverAI Agent"
                    }
                }
                res = requests.post(url, json=payload, auth=HTTPBasicAuth(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET), timeout=8)
                if res.status_code in [200, 201]:
                    data = res.json()
                    pl_id = data.get("id")
                    short_url = data.get("short_url")
                    return {
                        "success": True,
                        "external_api_ref": pl_id,
                        "details": {
                            "payment_link_id": pl_id,
                            "short_url": short_url,
                            "amount": case_data.get("amount_at_risk"),
                            "currency": "INR",
                            "customer": {"name": cust_name, "email": cust_email},
                            "status": data.get("status", "created"),
                            "mode": "RAZORPAY_TEST_MODE_REAL_API"
                        }
                    }
                else:
                    logger.warning(f"Razorpay Payment Link API returned HTTP {res.status_code}: {res.text}")
            except Exception as e:
                logger.error(f"Error calling Razorpay Payment Link API: {e}")

        # Fallback to realistic Razorpay Sandbox format if API key is in simulation mode or call failed
        pl_id = f"plink_{uuid.uuid4().hex[:14]}"
        short_url = f"https://rzp.io/i/{uuid.uuid4().hex[:8]}"
        return {
            "success": True,
            "external_api_ref": pl_id,
            "details": {
                "payment_link_id": pl_id,
                "short_url": short_url,
                "amount": case_data.get("amount_at_risk"),
                "currency": "INR",
                "customer": {"name": cust_name, "email": cust_email},
                "status": "created",
                "mode": "RAZORPAY_SANDBOX_SIMULATION"
            }
        }
    elif action_type == "RETRY_PAYMENT":
        tx_id = f"pay_{uuid.uuid4().hex[:14]}"
        return {
            "success": True,
            "external_api_ref": tx_id,
            "details": {
                "payment_id": tx_id,
                "method": "auto_retry_token",
                "status": "captured",
                "mode": "RAZORPAY_SANDBOX"
            }
        }
    elif action_type == "RECORD_PROMISE_TO_PAY":
        promise_days = parameters.get("days", 3) if parameters else 3
        due_date = (datetime.datetime.utcnow() + datetime.timedelta(days=promise_days)).strftime("%Y-%m-%d")
        return {
            "success": True,
            "external_api_ref": f"ptp_{uuid.uuid4().hex[:8]}",
            "details": {
                "promise_date": due_date,
                "notes": "Customer promised payment via chat workflow."
            }
        }
    elif action_type == "ESCALATE_TO_HUMAN":
        return {
            "success": True,
            "external_api_ref": f"esc_{uuid.uuid4().hex[:8]}",
            "details": {
                "queue": "MERCHANT_FINANCE_TEAM",
                "assigned_priority": "URGENT",
                "status": "queued"
            }
        }
    else:
        return {
            "success": True,
            "external_api_ref": f"stop_{uuid.uuid4().hex[:8]}",
            "details": {"status": "halted"}
        }
