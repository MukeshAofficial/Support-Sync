import requests
import json
import socket

# Configuration
BHINDI_API_KEY = "9qa1gky21og8yh4r34z9lp"
PROMPT = """
Fetch the top 5 trending posts from r/programming,
include title, URL, and upvote count for each.
Format as a numbered list.
"""

def test_dns():
    try:
        socket.gethostbyname("api.bhindi.io")
        return True
    except socket.gaierror:
        print("❌ DNS Error: Could not resolve api.bhindi.io")
        print("Try these fixes:")
        print("1. Check your internet connection")
        print("2. Temporarily disable VPN/firewall")
        print("3. Try using Google DNS (8.8.8.8)")
        return False

def call_bhindi_api():
    headers = {
        "Authorization": f"Bearer {BHINDI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "prompt": PROMPT,
        "variables": {
            "sort": "top",
            "timeframe": "day"
        }
    }
    
    try:
        response = requests.post(
            "https://api.bhindi.io/v1/agents/execute",
            headers=headers,
            json=payload,
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"🚨 API Error: {str(e)}")
        if hasattr(e, 'response') and e.response:
            print(f"Status Code: {e.response.status_code}")
            print(f"Response: {e.response.text[:200]}...")
        return None

# Main execution
if __name__ == "__main__":
    if test_dns():
        print("✅ DNS resolved successfully. Calling Bhindi API...")
        result = call_bhindi_api()
        
        if result:
            print("\n🎉 Success! Reddit data:")
            print(json.dumps(result, indent=2))
            
            # Sample output processing
            if "output" in result:
                print("\nFormatted Results:")
                for idx, post in enumerate(result["output"], 1):
                    print(f"{idx}. {post.get('title', 'No title')}")
                    print(f"   🔗 {post.get('url', 'No URL')}")
                    print(f"   ⬆️ {post.get('upvotes', 0)} upvotes\n")
        else:
            print("Failed to get results from Bhindi API")